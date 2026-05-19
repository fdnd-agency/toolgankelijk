import { TOOLGANKELIJK_AUDIT_URL } from '$env/static/private';
import { SSEConsumer, SSEService } from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';

function toClientMessage(eventType, payload, fallbackWebsiteSlug, urlBySlug, requestTotalUrls) {
	const websiteSlug = payload.websiteSlug ?? fallbackWebsiteSlug;

	if (eventType === 'audit_started') {
		const total = Number.isFinite(payload.totalUrls) ? payload.totalUrls : requestTotalUrls;
		const urlWord = total === 1 ? '1 URL' : `${total} URL's`;
		return {
			status: `Audit gestart (${urlWord})`,
			type: 'loading',
			count: 0,
			total
		};
	}

	if (eventType === 'url_processed') {
		const urlLabel = payload.url ?? urlBySlug[payload.urlSlug] ?? payload.urlSlug ?? 'URL';
		const violationCount = Number.isFinite(payload.violationCount) ? payload.violationCount : 0;
		const hasViolations =
			typeof payload.hasViolations === 'boolean' ? payload.hasViolations : violationCount > 0;
		const violationPart = hasViolations
			? `${violationCount} overtreding${violationCount === 1 ? '' : 'en'} gevonden`
			: 'geen overtredingen';

		const current = Number.isFinite(payload.current) ? payload.current : 0;
		const total = Number.isFinite(payload.total) ? payload.total : requestTotalUrls;

		return {
			status: `${urlLabel} — ${violationPart}`,
			type: hasViolations ? 'warning' : 'done',
			currentUrl: urlLabel,
			count: current,
			total,
			urlSlug: payload.urlSlug,
			websiteSlug,
			hasViolations,
			violationCount
		};
	}

	if (eventType === 'audit_failed') {
		const message = payload.message ?? 'Audit mislukt';
		const details = payload.details ? ` (${payload.details})` : '';
		return {
			status: `${message}${details}`,
			type: 'error'
		};
	}

	if (eventType === 'audit_completed') {
		return null; // ends the audit
	}

	const base = {
		status: payload.status ?? 'Audit update ontvangen',
		type: payload.type ?? eventType ?? 'loading'
	};

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

	return SSEService.createSseResponse(request, async (session) => {
		const pushClientUpdateThenWait = async (statusText, statusType, waitMilliseconds) => {
			SSEService.push(session, { status: statusText, type: statusType });
			await delay(waitMilliseconds);
		};

		try {
			if (urls.length === 0) {
				SSEService.pushError(session, undefined, "Geen URL's om te auditen");
				await delay(2000);
				return;
			}

			await fetch(`${TOOLGANKELIJK_AUDIT_URL}/api/isProjectRunning`);

			for (const [statusText, statusType, waitMilliseconds] of [
				['Audit gestart', 'done', 500],
				['Urls worden gecheckt, dit duurt even', 'loading', 500]
			]) {
				await pushClientUpdateThenWait(statusText, statusType, waitMilliseconds);
			}

			const response = await fetch(`${TOOLGANKELIJK_AUDIT_URL}/api/specifiedUrls`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ urls, websiteSlug })
			});

			if (!response.ok) {
				let auditErrorMessage = `Audit service fout: ${response.status}`;
				try {
					const maybeJson = await response.json();
					auditErrorMessage = maybeJson?.message || maybeJson?.error || auditErrorMessage;
				} catch {}

				SSEService.pushError(session, undefined, auditErrorMessage);
				await delay(2000);
				return;
			}

			if (!response.body) {
				SSEService.pushError(session, undefined, 'Geen audit stream ontvangen');
				await delay(2000);
				return;
			}

			const requestTotalUrls = urls.length;
			const urlBySlug = Object.fromEntries(
				urls.map((urlEntry) => [urlEntry.urlSlug, urlEntry.url])
			);
			const sseConsumer = new SSEConsumer();

			const forwardAuditEvent = async ({ eventType, payload }) => {
				const clientMessage = toClientMessage(
					eventType,
					payload,
					websiteSlug,
					urlBySlug,
					requestTotalUrls
				);

				if (clientMessage === null) return;

				console.info('[startAudit] forwarding Server-Sent Events update to client', {
					eventType,
					clientMessage
				});
				try {
					if (session.isConnected) SSEService.push(session, clientMessage);
				} catch {}
			};

			await sseConsumer.consume(response.body, {
				onEvent: (event) => forwardAuditEvent(event),
				onTrailingEvent: (event) => forwardAuditEvent(event),
				onParseError: async (parseError, context) => {
					const suffix = context?.eventType ? ` (event: ${context.eventType})` : '';
					console.warn('[startAudit] failed to parse upstream Server-Sent Events message', {
						error: parseError.message,
						eventType: context?.eventType
					});
					try {
						if (session.isConnected) {
							SSEService.pushError(
								session,
								parseError,
								`Ongeldige audit update ontvangen${suffix}`
							);
						}
					} catch {}
				},
				onTrailingParseError: async () => {}
			});

			await pushClientUpdateThenWait('Audit afgerond', 'done', 1000);
		} catch (error) {
			SSEService.pushError(session, error, 'Fout bij verbinden met audit server.');
			await delay(2000);
		}
	});
}
