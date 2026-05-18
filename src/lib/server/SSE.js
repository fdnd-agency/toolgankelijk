//@ts-check
import { FetchConnection, SseError, createResponse } from 'better-sse';

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

/**
 * @typedef {{ isConnected: boolean; push: (data: unknown, eventName?: string) => unknown }} SseSessionLike
 * @typedef {AsyncIterable<{ type?: string } & Record<string, unknown>>} EventSource
 * @typedef {(err: unknown) => { type?: string } & Record<string, unknown>} SSEError
 */

/**
 * @typedef {Object} SseResponseOptions
 * @property {number} [status]
 */

//#endregion TYPES
export class SSEService {
	/**
	 * @param {Error | unknown} error
	 */
	static errorMessage(error) {
		if (error instanceof Error) return error.message;
		if (error === undefined) return 'Stream writer rejected without a reason';
		return String(error);
	}
	/** @param {unknown} err @param {{ phase: string; eventType?: string; session?: SseSessionLike }} ctx */
	static handleSsePushError(err, ctx) {
		if (ctx.session?.isConnected === false || err instanceof SseError) {
			console.warn(
				`[sse] ${ctx.phase} not delivered (session inactive)` +
					(ctx.eventType ? ` [${ctx.eventType}]` : '')
			);
			return;
		}
		console.error(`[sse] ${ctx.phase} push failed:`, err);
	}

	/** Catches rejected writes after disconnect. */
	static ResilientFetchConnection = class ResilientFetchConnection extends FetchConnection {
		/** @type {TextEncoder} */
		static textEncoder = new TextEncoder();

		/** @param {string} chunk */
		sendChunk = (chunk) => {
			const encoded = ResilientFetchConnection.textEncoder.encode(chunk);
			// @ts-ignore
			void this.writer.write(encoded).catch((err) => {
				console.warn(`[sse] stream write skipped: ${SSEService.errorMessage(err)}`);
			});
		};

		cleanup = () => {
			// @ts-ignore
			void this.writer.close().catch((err) => {
				console.warn(`[sse] stream close skipped: ${SSEService.errorMessage(err)}`);
			});
		};
	};

	/**
	 * @param {import('better-sse').Session} session
	 */
	static closeSession(session) {
		if (!session.isConnected) return;
		try {
			// @ts-ignore - onDisconnected is private in Session
			session.onDisconnected?.();
		} catch (err) {
			console.error('[sse] failed to close session:', err);
		}
	}

	/**
	 * Creates a `better-sse` response.
	 *
	 * @param {Request} request
	 * @param {(session: import('better-sse').Session) => (void | Promise<void>)} callback
	 * @param {SseResponseOptions} options
	 */
	static createSseResponse(request, callback, { status = 200 } = {}) {
		const connection = new SSEService.ResilientFetchConnection(request, null, {
			statusCode: status,
			headers: {
				'Content-Type': 'text/event-stream; charset=utf-8',
				Connection: 'keep-alive',
				'Cache-Control': 'no-cache'
			}
		});

		return createResponse(connection, async (session) => {
			try {
				await callback(session);
			} catch (err) {
				console.error('[sse] session task:', err);
			} finally {
				SSEService.closeSession(session);
			}
		});
	}

	/**
	 * Pushes data to the session, handling errors and disconnection states.
	 *
	 * @param {SseSessionLike} session
	 * @param {unknown} data
	 * @param {string} eventName
	 */
	static push(session, data, eventName = 'message') {
		if (!session.isConnected) return;
		try {
			session.push(data, eventName);
		} catch (error) {
			SSEService.handleSsePushError(error, { phase: 'event', eventType: eventName, session });
		}
	}
	/**
	 * Pushes a JSON payload to the browser as an SSE `message` event.
	 * @param {unknown[]} session
	 * @param {unknown} clientUpdatePayload
	 */
	pushSSEUpdate(session, clientUpdatePayload) {
		session.push(clientUpdatePayload, 'message');
	}
}
/** Consumes an upstream SSE stream, parses the blocks and calls handlers.*/
export class SSEConsumer {
	/**
	 * @param {string} block
	 */
	static parseSSEMessageBlock(block) {
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

	/**
	 * Consumes the readable stream until done
	 * @param {ReadableStream<Uint8Array>} readable
	 * @param {SSEConsumeHandlers} [handlers]
	 */
	async consume(readable, handlers = {}) {
		const { onEvent, onParseError, onTrailingEvent, onTrailingParseError } = handlers;
		if (!readable) return;

		const reader = readable.getReader();
		const decoder = new TextDecoder();
		let buffer = '';
		let streamDone = false;

		const processMessageBlock = async (
			/** @type {string} */ block,
			/** @type {SSEOnStreamEvent | undefined} */ streamEventHandler,
			/** @type {SSEOnParseError | undefined} */ parseErrorHandler,
			isTrailing = false
		) => {
			const parsedBlock = SSEConsumer.parseSSEMessageBlock(block);
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
