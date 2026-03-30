import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as sessionModule from '$lib/server/session';
import * as sessionRepository from '$lib/repositories/sessionRepository.js';

vi.mock('$lib/repositories/sessionRepository.js', () => ({
	getSessionByTokenHash: vi.fn(),
	updateSessionExpiry: vi.fn(),
	deleteSessionById: vi.fn(),
	createSessionRecord: vi.fn()
}));

describe('session.js', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.useRealTimers();
	});

	const now = Date.now();
	const fakeSessionRow = {
		id: '1',
		session_id: 'abc123',
		expires_at: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days of lifetime left
		user_id: {
			id: 'u1',
			email: 'test@example.com',
			username: 'tester',
			is_email_verified: true
		}
	};

	it('Should refresh a old session', async () => {
		// Arrange
		vi.useFakeTimers();
		vi.setSystemTime(now);

		sessionRepository.getSessionByTokenHash.mockResolvedValue(fakeSessionRow);
		sessionRepository.updateSessionExpiry.mockResolvedValue(undefined);

		const expectedDate = new Date(now + 1000 * 60 * 60 * 24 * 30);

		// Act
		const { session } = await sessionModule.validateSessionToken('notimportant');

		// Assert
		expect(session).not.toBeNull();
		expect(session.expiresAt).toStrictEqual(expectedDate);
		expect(sessionRepository.getSessionByTokenHash).toHaveBeenCalledTimes(1);
		expect(sessionRepository.updateSessionExpiry).toHaveBeenCalledWith({
			sessionId: 'abc123',
			expiresAt: expectedDate
		});
	});
});
