/**
 * Tests for the SessionRepository class.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RepositoryError } from '$lib/server/repositories/baseRepository.js';
import { SessionRepository } from '$lib/server/repositories/sessionRepository.js';

describe('SessionRepository', () => {
	let client;
	let repository;

	beforeEach(() => {
		vi.clearAllMocks();
		client = { request: vi.fn() };
		repository = new SessionRepository({ client });
	});

	describe('getSessionByTokenHash', () => {
		it('returns mapped session and user from response', async () => {
			const row = {
				id: '1',
				session_id: 'sessionToken',
				expires_at: new Date().toISOString(),
				user_id: { id: '1', email: 'a@b.c', username: 'u', is_email_verified: true }
			};
			client.request.mockResolvedValue([row]);

			const result = await repository.getSessionByTokenHash('hashed');

			expect(result).toEqual({
				session: {
					id: 'sessionToken',
					userId: '1',
					expiresAt: new Date(row.expires_at)
				},
				user: {
					id: '1',
					email: 'a@b.c',
					username: 'u',
					isEmailVerified: true
				}
			});
			expect(client.request).toHaveBeenCalled();
		});

		it('throws RepositoryError when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(repository.getSessionByTokenHash('x')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});

		it('returns null when session list is empty', async () => {
			client.request.mockResolvedValue([]);

			await expect(repository.getSessionByTokenHash('unknown')).resolves.toBeNull();
		});
	});

	describe('updateSessionExpiry', () => {
		it('returns update payload from Directus', async () => {
			const expiresAt = new Date('2000-01-01');
			client.request.mockResolvedValue({ id: '1' });

			const result = await repository.updateSessionExpiry({ sessionId: 'hash', expiresAt });

			expect(result).toEqual({ id: '1' });
			expect(client.request).toHaveBeenCalled();
		});

		it('throws RepositoryError on Directus error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(
				repository.updateSessionExpiry({ sessionId: 'sessionToken', expiresAt: new Date() })
			).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});

		it('throws RepositoryError when mutation returns no row', async () => {
			client.request.mockResolvedValue(null);

			await expect(
				repository.updateSessionExpiry({ sessionId: 'sessionToken', expiresAt: new Date() })
			).rejects.toThrow(RepositoryError);
		});
	});

	describe('deleteSessionById', () => {
		it('returns delete payload from Directus', async () => {
			client.request.mockResolvedValue({});

			const result = await repository.deleteSessionById('sessionToken');

			expect(result).toEqual({ id: 'sessionToken' });
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(repository.deleteSessionById('x')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('createSessionRecord', () => {
		it('returns session shape when Directus create succeeds', async () => {
			client.request.mockResolvedValue({ id: '1' });
			const expiresAt = new Date('2000-01-01');
			const result = await repository.createSessionRecord({
				sessionId: 'sessionToken',
				userId: '1',
				expiresAt
			});

			expect(result).toEqual({ id: 'sessionToken', userId: '1', expiresAt });
			expect(client.request).toHaveBeenCalledTimes(1);
		});

		it('throws RepositoryError when Directus request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(
				repository.createSessionRecord({
					sessionId: 'sessionToken',
					userId: '1',
					expiresAt: new Date()
				})
			).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});
});
