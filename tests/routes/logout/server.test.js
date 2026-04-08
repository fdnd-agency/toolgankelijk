import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../src/routes/logout/+server.js';
import * as sessionModule from '$lib/server/session.js';
import { sessionRepository } from '$lib/server/index.js';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

vi.mock('$lib/server/index.js', () => ({
	sessionRepository: {
		deleteSessionById: vi.fn()
	}
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
		sessionRepository.deleteSessionById.mockResolvedValue(undefined);

		// Act
		const response = await POST({ cookies });

		// Assert
		expect(cookies.get).toHaveBeenCalledWith('session');
		expect(encodeHexLowerCase).toHaveBeenCalled();
		expect(sha256).toHaveBeenCalled();
		expect(sessionRepository.deleteSessionById).toHaveBeenCalledWith('mockedSessionId');
		expect(sessionModule.deleteSessionTokenCookie).toHaveBeenCalledWith({ cookies });
		expect(response.status).toBe(204);
	});

	it('should not delete session if no session token exists', async () => {
		// Arrange
		cookies.get.mockReturnValue(undefined);

		// Act
		const response = await POST({ cookies });

		// Assert
		expect(sessionRepository.deleteSessionById).not.toHaveBeenCalled();
		expect(sessionModule.deleteSessionTokenCookie).not.toHaveBeenCalled();
		expect(response.status).toBe(204);
	});
});
