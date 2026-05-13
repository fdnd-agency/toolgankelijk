import { FetchConnection, createResponse } from 'better-sse';

/** SSE server and client */

//#region TYPES

/**
 * Parsed SSE message block
 *
 * @typedef {Object} SSEParsedMessageBlock
 * @property {string} eventType
 * @property {string} rawData
 */

/**
 * Stream event with payload
 *
 * @typedef {Object} SSEStreamEvent
 * @property {string} eventType
 * @property {Record<string, unknown>} payload
 */

/**
 * Context when parsing the payload of a stream event fails.
 *
 * @typedef {Object} SSEParseErrorContext
 * @property {string} block
 * @property {string} rawData
 * @property {string} eventType
 * @property {boolean} isTrailing
 */

/**
 * Handler for a stream event
 * @callback SSEOnStreamEvent
 * @param {SSEStreamEvent} event
 * @returns {void | Promise<void>}
 */

/**
 * Handler for a parse error
 * @callback SSEOnParseError
 * @param {Error} error
 * @param {SSEParseErrorContext} context
 * @returns {void | Promise<void>}
 */

/**
 * Optional callbacks for the SSE consumer.
 *
 * @typedef {Object} SSEConsumeHandlers
 * @property {SSEOnStreamEvent} [onEvent]
 * @property {SSEOnParseError} [onParseError]
 * @property {SSEOnStreamEvent} [onTrailingEvent]
 * @property {SSEOnParseError} [onTrailingParseError]
 */

//#endregion TYPES

/** Formats a stream write/close failure message. */
function formatStreamErrorMessage(error) {
	if (error instanceof Error) return error.message;
	if (error === undefined) return 'Stream writer rejected without a reason';
	return String(error);
}

/** Wrapper for fetch connection that can handle write/close rejections after the client disconnects. */
export class ResilientSSEFetchConnection extends FetchConnection {
	sendChunk = (chunk) => {
		const encoded = FetchConnection.encoder.encode(chunk);
		void this.writer.write(encoded).catch((err) => {
			console.warn(`[SSEOutbound] stream write skipped: ${formatStreamErrorMessage(err)}`);
		});
	};

	cleanup = () => {
		void this.writer.close().catch((err) => {
			console.warn(`[SSEOutbound] stream close skipped: ${formatStreamErrorMessage(err)}`);
		});
	};
}

/** Closes the SSE session */
function closeSSESession(session) {
	if (!session.isConnected) return;
	try {
		session.onDisconnected?.();
	} catch (error) {
		console.error('[SSEOutbound] failed to close session:', error);
	}
}

/** Creates a SSE response for a job */
export function createSSEJobResponse(request, runJob, options = {}) {
	const connection = new ResilientSSEFetchConnection(request, null, {
		statusCode: options.statusCode ?? 200,
		headers: {
			'Content-Type': 'text/event-stream; charset=utf-8',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache',
			...(options.headers ?? {})
		}
	});

	return createResponse(
		connection,
		{
			retry: options.retry ?? null,
			keepAlive: options.keepAlive ?? null
		},
		(session) => {
			void (async () => {
				try {
					await runJob(session);
				} finally {
					closeSSESession(session);
				}
			})().catch((error) => console.error('[SSEOutbound] job task failed:', error));
		}
	);
}

/** Pushes a JSON payload to the browser as an SSE `message` event. */
export function pushSSEUpdate(session, clientUpdatePayload) {
	session.push(clientUpdatePayload, 'message');
}

/** Consumes an upstream SSE stream, parses the blocks and calls handlers.*/
export class SSEConsumer {
	static #parseSSEMessageBlock(block) {
		const lines = block.split('\n');
		let eventType = '';
		const dataLines = [];

		for (const line of lines) {
			if (line.startsWith('event:')) {
				eventType = line.slice(6).trim();
				continue;
			}

			if (line.startsWith('data:')) {
				dataLines.push(line.slice(5).trim());
			}
		}

		if (dataLines.length === 0) return null;

		return {
			eventType,
			rawData: dataLines.join('\n')
		};
	}

	/** Consumes the readable stream until done */
	async consume(readable, handlers = {}) {
		const { onEvent, onParseError, onTrailingEvent, onTrailingParseError } = handlers;
		if (!readable) return;

		const reader = readable.getReader();
		const decoder = new TextDecoder();
		let buffer = '';
		let streamDone = false;

		const processMessageBlock = async (
			block,
			streamEventHandler,
			parseErrorHandler,
			isTrailing = false
		) => {
			const parsedBlock = SSEConsumer.#parseSSEMessageBlock(block);
			if (!parsedBlock) return;

			try {
				const payload = JSON.parse(parsedBlock.rawData);
				if (streamEventHandler) {
					await streamEventHandler({
						eventType: parsedBlock.eventType,
						payload
					});
				}
			} catch (parseError) {
				if (parseErrorHandler) {
					const error = parseError instanceof Error ? parseError : new Error(String(parseError));
					const context = {
						block,
						rawData: parsedBlock.rawData,
						eventType: parsedBlock.eventType,
						isTrailing
					};
					await parseErrorHandler(error, context);
				}
			}
		};

		while (!streamDone) {
			const { value, done } = await reader.read();
			streamDone = done;
			if (done) break;

			buffer += decoder.decode(value, { stream: true }).replace(/\r/g, '');
			const messageBlocks = buffer.split('\n\n');
			const remainder = messageBlocks.pop();
			buffer = remainder ?? '';

			for (const block of messageBlocks) {
				await processMessageBlock(block, onEvent, onParseError, false);
			}
		}

		buffer += decoder.decode().replace(/\r/g, '');
		const finalMessageBlocks = buffer.split('\n\n');
		const finalRemainder = finalMessageBlocks.pop();
		buffer = finalRemainder ?? '';

		for (const block of finalMessageBlocks) {
			await processMessageBlock(block, onEvent, onParseError, false);
		}

		if (buffer.trim()) {
			await processMessageBlock(
				buffer,
				onTrailingEvent ?? onEvent,
				onTrailingParseError ?? onParseError,
				true
			);
		}
	}
}
