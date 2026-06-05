/** @vitest-environment node */
import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../src/routes/api/startAudit/+server.js';
import * as SSEModule from '$lib/server/SSE.js';

vi.mock('$env/static/private', () => ({
	TOOLGANKELIJK_AUDIT_URL: 'http://mock-audit-url'
}));

global.fetch = vi.fn();

describe('src/routes/api/startAudit/+server.js integration', () => {
	it('starts audit and streams progress updates', async () => {
		const mockUrls = [{ urlSlug: 'slug1', url: 'https://example.com' }];
		const formData = new FormData();
		formData.append('urls', JSON.stringify(mockUrls));
		formData.append('slug', 'test-website');

		const request = {
			formData: async () => formData
		};

		const ssePush = vi.fn();
		vi.spyOn(SSEModule.SSEService, 'createSseResponse').mockImplementation(
			async (req, callback) => {
				await callback({ isConnected: true });
				return new Response();
			}
		);
		vi.spyOn(SSEModule.SSEService, 'push').mockImplementation(ssePush);

		global.fetch.mockResolvedValueOnce({ ok: true }); // isProjectRunning
		global.fetch.mockResolvedValueOnce({
			ok: true,
			body: new ReadableStream({
				start(controller) {
					controller.enqueue(new TextEncoder().encode('event: audit_completed\ndata: {}\n\n'));
					controller.close();
				}
			})
		}); // specifiedUrls

		await POST({ request });

		expect(ssePush).toHaveBeenCalled();
		expect(ssePush).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				status: expect.stringContaining('Audit gestart')
			})
		);
	});
});
