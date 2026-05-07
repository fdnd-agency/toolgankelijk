/**
 * Produces Server-Sent Events for a downstream HTTP response stream.
 */
export class SseProducer {
	static #delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * @param {ReadableStreamDefaultController<Uint8Array>} controller
	 */
	constructor(controller) {
		this.controller = controller;
		this.encoder = new TextEncoder();
		this.closed = false;
	}

	/**
	 * Sends one SSE message payload.
	 *
	 * @param {Record<string, any>} message
	 * @param {{ eventType?: string }} [options]
	 * @returns {void}
	 */
	send(message, { eventType } = {}) {
		let payload = '';
		if (eventType) {
			payload += `event: ${eventType}\n`;
		}
		payload += `data: ${JSON.stringify(message)}\n\n`;
		this.controller.enqueue(this.encoder.encode(payload));
	}

	/**
	 * Sends one SSE message and optionally waits before continuing.
	 *
	 * @param {Record<string, any>} message
	 * @param {number} [waitMs=0]
	 * @returns {Promise<void>}
	 */
	async sendAndPause(message, waitMs = 0) {
		this.send(message);
		if (waitMs) await SseProducer.#delay(waitMs);
	}

	/**
	 * Safely closes the downstream response stream.
	 *
	 * @returns {void}
	 */
	close() {
		if (this.closed) return;
		try {
			this.controller.close();
		} catch (error) {
			console.error('Error closing stream:', error);
		}
		this.closed = true;
	}
}

/**
 * Consumes an upstream SSE stream and forwards parsed events through callbacks.
 */
export class SseConsumer {
	static #parseSseBlock(block) {
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
	 * Reads an SSE stream, parses JSON payloads, and invokes handlers per event.
	 *
	 * @param {ReadableStream<Uint8Array> | null} readable
	 * @param {{
	 *   onEvent?: (event: { eventType: string, payload: Record<string, any> }) => Promise<void> | void,
	 *   onParseError?: (
	 *     error: Error,
	 *     context: { block: string, rawData: string, eventType: string, isTrailing: boolean }
	 *   ) => Promise<void> | void,
	 *   onTrailingEvent?: (event: { eventType: string, payload: Record<string, any> }) => Promise<void> | void,
	 *   onTrailingParseError?: (
	 *     error: Error,
	 *     context: { block: string, rawData: string, eventType: string, isTrailing: boolean }
	 *   ) => Promise<void> | void
	 * }} [handlers]
	 * @returns {Promise<void>}
	 */
	async consume(readable, { onEvent, onParseError, onTrailingEvent, onTrailingParseError } = {}) {
		if (!readable) return;

		const reader = readable.getReader();
		const decoder = new TextDecoder();
		let buffer = '';
		let streamDone = false;

		// Parses one SSE block and delegates event or parse error handling.
		const processBlock = async (block, handler, parseErrorHandler, isTrailing = false) => {
			const parsedBlock = SseConsumer.#parseSseBlock(block);
			if (!parsedBlock) return;

			try {
				const payload = JSON.parse(parsedBlock.rawData);
				if (handler) {
					await handler({
						eventType: parsedBlock.eventType,
						payload
					});
				}
			} catch (parseError) {
				if (parseErrorHandler) {
					await parseErrorHandler(parseError, {
						block,
						rawData: parsedBlock.rawData,
						eventType: parsedBlock.eventType,
						isTrailing
					});
				}
			}
		};

		while (!streamDone) {
			const { value, done } = await reader.read();
			streamDone = done;
			if (done) break;

			buffer += decoder.decode(value, { stream: true }).replace(/\r/g, '');
			const blocks = buffer.split('\n\n');
			buffer = blocks.pop() || '';

			for (const block of blocks) {
				await processBlock(block, onEvent, onParseError, false);
			}
		}

		buffer += decoder.decode().replace(/\r/g, '');
		const finalBlocks = buffer.split('\n\n');
		buffer = finalBlocks.pop() || '';

		for (const block of finalBlocks) {
			await processBlock(block, onEvent, onParseError, false);
		}

		if (buffer.trim()) {
			await processBlock(
				buffer,
				onTrailingEvent ?? onEvent,
				onTrailingParseError ?? onParseError,
				true
			);
		}
	}
}
