import { TOOLGANKELIJK_AUDIT_URL } from '$env/static/private';
import { SseConsumer, SseProducer } from '$lib/server/sseHandler.js';

const STATE_BY_OUTCOME = { pass: 'success', error: 'failed' };
const TYPE_BY_STATE = { success: 'done', mixed: 'warning', failed: 'error' };

function toClientMessage(eventType, payload, fallbackWebsiteSlug, urlBySlug = {}) {
	const websiteSlug = payload.websiteSlug ?? fallbackWebsiteSlug;

	if (eventType === 'done' && payload.urlSlug) {
		const outcome = payload.outcome ?? 'error';
		const state = STATE_BY_OUTCOME[outcome] ?? 'mixed';
		const type = TYPE_BY_STATE[state] ?? 'error';
		const originalUrl = urlBySlug[payload.urlSlug];
		const urlLabel = originalUrl ?? payload.urlSlug;

		return {
			status: `${urlLabel} - ${state}`,
			type,
			state,
			outcome,
			urlSlug: payload.urlSlug,
			websiteSlug
		};
	}

	const base = {
		status: payload.status ?? 'Audit update ontvangen',
		type: payload.type ?? eventType ?? 'loading'
	};

	// Include summary for potential future use without breaking current UI
	if (eventType === 'summary' && payload.summary) {
		return {
			...base,
			type: 'done',
			summary: payload.summary,
			websiteSlug
		};
	}

	return base;
}

export async function POST({ request }) {
	const formData = await request.formData();
	const urls = JSON.parse(formData.get('urls'));
	const websiteSlug = formData.get('slug');

	const stream = new ReadableStream({
		start(controller) {
			const sseProducer = new SseProducer(controller);
			const sseConsumer = new SseConsumer();
			const sendAndPause = async (status, type, waitMs) =>
				sseProducer.sendAndPause({ status, type }, waitMs);

			(async () => {
				try {
					if (urls.length === 0) {
						await sendAndPause("Geen URL's om te auditen", 'error', 2000);
						return;
					}

					// Check if the audit server is running
					await fetch(`${TOOLGANKELIJK_AUDIT_URL}/api/isProjectRunning`);

					for (const [status, type, waitMs] of [
						['Audit gestart', 'done', 500],
						['Urls worden gecheckt, dit duurt even', 'loading', 500]
					]) {
						await sendAndPause(status, type, waitMs);
					}

					const response = await fetch(`${TOOLGANKELIJK_AUDIT_URL}/api/specifiedUrls`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ urls, websiteSlug })
					});

					if (!response.ok) {
						let errorMessage = `Audit service fout: ${response.status}`;
						try {
							const maybeJson = await response.json();
							errorMessage = maybeJson?.message || maybeJson?.error || errorMessage;
						} catch {
							// ignore json parse failures and keep generic error
						}

						await sendAndPause(errorMessage, 'error', 2000);
						return;
					}

					if (!response.body) {
						await sendAndPause('Geen audit stream ontvangen', 'error', 2000);
						return;
					}

					let processedCount = 0;
					const totalUrls = urls.length;
					const urlBySlug = Object.fromEntries(
						urls.map((urlEntry) => [urlEntry.urlSlug, urlEntry.url])
					);
					const forwardAuditEvent = async ({ eventType, payload }, includeProgress = true) => {
						const clientMessage = toClientMessage(
							eventType,
							payload,
							websiteSlug,
							includeProgress ? urlBySlug : {}
						);

						if (includeProgress && payload.urlSlug) {
							if (eventType === 'done') processedCount += 1;
							clientMessage.currentUrl = urlBySlug[payload.urlSlug] ?? payload.urlSlug;
							clientMessage.count = processedCount;
							clientMessage.total = totalUrls;
						}

						console.info('[startAudit] forwarding SSE event to client', {
							eventType,
							includeProgress,
							clientMessage
						});
						sseProducer.send(clientMessage);
					};

					await sseConsumer.consume(response.body, {
						onEvent: (event) => forwardAuditEvent(event, true),
						onTrailingEvent: (event) => forwardAuditEvent(event, false),
						onParseError: async (parseError, context) => {
							const suffix = context?.eventType ? ` (event: ${context.eventType})` : '';
							console.warn('[startAudit] failed to parse upstream SSE event', {
								error: parseError.message,
								eventType: context?.eventType
							});
							sseProducer.send({
								status: `Ongeldige audit update ontvangen${suffix}: ${parseError.message}`,
								type: 'warning'
							});
						},
						onTrailingParseError: async () => {}
					});

					await sendAndPause('Audit afgerond', 'done', 1000);
				} catch (err) {
					await sendAndPause(`Fout bij verbinden met audit server: ${err.message}`, 'error', 2000);
				} finally {
					sseProducer.close();
				}
			})();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
			'Transfer-Encoding': 'chunked'
		}
	});
}
