/** @vitest-environment node */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SSEService, SSEConsumer } from '$lib/server/SSE.js';

describe('SSEService', () => {
	let sseService;

	beforeEach(() => {
		sseService = new SSEService();
	});

	describe('ErrorMessage', () => {
		it('should return error message if error is an instance of Error', () => {
			const error = new Error('test error');
			expect(SSEService.errorMessage(error)).toBe('test error');
		});

		it('should return default message if error is undefined', () => {
			expect(SSEService.errorMessage(undefined)).toBe('Stream writer rejected without a reason');
		});

		it('should return string representation for other types', () => {
			expect(SSEService.errorMessage('string error')).toBe('string error');
			expect(SSEService.errorMessage(123)).toBe('123');
		});
	});

	describe('pushError', () => {
		let mockSession;

		beforeEach(() => {
			mockSession = {
				isConnected: true,
				push: vi.fn(),
				onDisconnected: vi.fn()
			};
			vi.spyOn(console, 'error').mockImplementation(() => {});
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('should push a sanitized message and not the actual error to the client', () => {
			const detailedError = new Error('Error has occurred in ...');
			const safeMessage = 'A safe error occurred';

			SSEService.pushError(mockSession, detailedError, safeMessage, false);

			expect(mockSession.push).toHaveBeenCalledWith(
				{
					status: safeMessage,
					type: 'error'
				},
				'message'
			);
			// Verify the detailed error was NOT pushed
			const pushCall = mockSession.push.mock.calls[0][0];
			expect(JSON.stringify(pushCall)).not.toContain('Error has occurred in ...');
		});

		it('should close the session by default', () => {
			SSEService.pushError(mockSession, new Error('error'), 'message');
			expect(mockSession.onDisconnected).toHaveBeenCalled();
		});

		it('should NOT close the session if shouldClose is false', () => {
			SSEService.pushError(mockSession, new Error('error'), 'message', false);
			expect(mockSession.onDisconnected).not.toHaveBeenCalled();
		});
	});
});

describe('SSEConsumer', () => {
	let sseConsumer;

	beforeEach(() => {
		sseConsumer = new SSEConsumer();
	});

	describe('consume', () => {
		it('should call onEvent for each message block', async () => {
			const onEvent = vi.fn();
			const data = 'event: test\ndata: {"foo": "bar"}\n\nevent: test2\ndata: {"baz": "qux"}\n\n';
			const readable = new ReadableStream({
				start(controller) {
					controller.enqueue(new TextEncoder().encode(data));
					controller.close();
				}
			});

			await sseConsumer.consume(readable, { onEvent });

			expect(onEvent).toHaveBeenCalledTimes(2);
			expect(onEvent).toHaveBeenNthCalledWith(1, {
				eventType: 'test',
				payload: { foo: 'bar' }
			});
			expect(onEvent).toHaveBeenNthCalledWith(2, {
				eventType: 'test2',
				payload: { baz: 'qux' }
			});
		});

		it('should handle chunks correctly', async () => {
			const onEvent = vi.fn();
			const chunk1 = 'event: test\ndata: {"foo":';
			const chunk2 = ' "bar"}\n\n';

			const readable = new ReadableStream({
				async start(controller) {
					controller.enqueue(new TextEncoder().encode(chunk1));
					await new Promise((r) => setTimeout(r, 10));
					controller.enqueue(new TextEncoder().encode(chunk2));
					controller.close();
				}
			});

			await sseConsumer.consume(readable, { onEvent });

			expect(onEvent).toHaveBeenCalledWith({
				eventType: 'test',
				payload: { foo: 'bar' }
			});
		});

		it('should handle trailing events without double newline', async () => {
			const onTrailingEvent = vi.fn();
			const data = 'event: test\ndata: {"foo": "bar"}'; // No \n\n at the end
			const readable = new ReadableStream({
				start(controller) {
					controller.enqueue(new TextEncoder().encode(data));
					controller.close();
				}
			});

			await sseConsumer.consume(readable, { onTrailingEvent });

			expect(onTrailingEvent).toHaveBeenCalledWith({
				eventType: 'test',
				payload: { foo: 'bar' }
			});
		});
	});
});
