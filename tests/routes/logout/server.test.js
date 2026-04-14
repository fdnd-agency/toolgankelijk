import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../src/routes/logout/+server.js';
import * as sessionModule from '$lib/server/session.js';
vi.mock('$lib/server/session.js', () => ({
	sessionService: {
		DeleteSession: vi.fn()
	}
}));

describe('src/routes/logout/+server.js', () => {
	let cookies;

	beforeEach(() => {
		cookies = {
			get: vi.fn()
		};
		vi.clearAllMocks();
	});

	it('should delete session and cookie if session token exists', async () => {
		// Arrange
		cookies.get.mockReturnValue('token');

		// Act
		const response = await POST({ cookies });

		// Assert
		expect(sessionModule.sessionService.DeleteSession).toHaveBeenCalledWith({ cookies });
		expect(response.status).toBe(204);
	});

	it('should not delete session if no session token exists', async () => {
		// Arrange
		cookies.get.mockReturnValue(undefined);

		// Act
		const response = await POST({ cookies });

		// Assert
		expect(sessionModule.sessionService.DeleteSession).toHaveBeenCalledWith({ cookies });
		expect(response.status).toBe(204);
	});
});
