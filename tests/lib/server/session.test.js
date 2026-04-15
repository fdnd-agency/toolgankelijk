import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as sessionModule from '$lib/server/session';
import { sessionRepository } from '$lib/server/index.js';

vi.mock('$lib/server/index.js', () => ({
	sessionRepository: {
		getSessionByTokenHash: vi.fn(),
		updateSessionExpiry: vi.fn(),
		deleteSessionById: vi.fn(),
		createSessionRecord: vi.fn()
	}
}));

describe('session.js', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.useRealTimers();
	});

	const now = Date.now();
	const fakeSessionData = {
		session: {
			id: 'abc123',
			userId: 'u1',
			expiresAt: new Date(now + 10 * 24 * 60 * 60 * 1000) // 10 days of lifetime left
		},
		user: {
			id: 'u1',
			email: 'test@example.com',
			username: 'tester',
			isEmailVerified: true
		}
	};

	it('Should refresh a old session', async () => {
		// Arrange
		vi.useFakeTimers();
		vi.setSystemTime(now);

		sessionRepository.getSessionByTokenHash.mockResolvedValue(fakeSessionData);
		sessionRepository.updateSessionExpiry.mockResolvedValue(undefined);

		const expectedDate = new Date(now + 1000 * 60 * 60 * 24 * 30);

		// Act
		const { session } = await sessionModule.sessionService.validateSessionToken('notimportant');

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
