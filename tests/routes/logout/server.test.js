import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../src/routes/logout/+server.js';
import * as sessionModule from '$lib/server/session.js';
import { hygraph } from '$lib/utils/hygraph.js';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

vi.mock('$lib/utils/hygraph.js', () => ({
	hygraph: { request: vi.fn() }
}));
vi.mock('$lib/server/session.js', () => ({
	deleteSessionTokenCookie: vi.fn()
}));
vi.mock('@oslojs/crypto/sha2', () => ({
	sha256: vi.fn((input) => new Uint8Array([1, 2, 3]))
}));
vi.mock('@oslojs/encoding', () => ({
	encodeHexLowerCase: vi.fn(() => 'mockedSessionId')
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
		expect(cookies.get).toHaveBeenCalledWith('session');
		expect(encodeHexLowerCase).toHaveBeenCalled();
		expect(sha256).toHaveBeenCalled();
		expect(hygraph.request).toHaveBeenCalledWith(expect.stringContaining('deleteSessie'), {
			id: 'mockedSessionId'
		});
		expect(sessionModule.deleteSessionTokenCookie).toHaveBeenCalledWith({ cookies });
		expect(response.status).toBe(204);
	});

	it('should not delete session if no session token exists', async () => {
		// Arrange
		cookies.get.mockReturnValue(undefined);

		// Act
		const response = await POST({ cookies });

		// Assert
		expect(hygraph.request).not.toHaveBeenCalled();
		expect(sessionModule.deleteSessionTokenCookie).not.toHaveBeenCalled();
		expect(response.status).toBe(204);
	});
});
