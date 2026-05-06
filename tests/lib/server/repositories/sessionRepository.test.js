/**
 * Tests for the SessionRepository class.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SessionRepository } from '$lib/server/repositories/sessionRepository.js';

describe('SessionRepository', () => {
	let client;
	let repository;

	beforeEach(() => {
		vi.clearAllMocks();
		client = { query: vi.fn(), request: vi.fn() };
		repository = new SessionRepository({ client });
	});

	describe('getSessionByTokenHash', () => {
		it('returns mapped session and user from GraphQL response', async () => {
			const row = {
				id: '1',
				session_id: 'sessionToken',
				expires_at: new Date().toISOString(),
				user_id: { id: '1', email: 'a@b.c', username: 'u', is_email_verified: true }
			};
			client.query.mockResolvedValue({ session: [row] });

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
			expect(client.query).toHaveBeenCalledWith(expect.any(String), { sessionId: 'hashed' });
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error('network'));

			const result = await repository.getSessionByTokenHash('x');

			expect(result).toBeNull();
			spy.mockRestore();
		});

		it('returns null when session list is empty', async () => {
			client.query.mockResolvedValue({ session: [] });

			await expect(repository.getSessionByTokenHash('unknown')).resolves.toBeNull();
		});
	});

	describe('updateSessionExpiry', () => {
		it('returns update payload from GraphQL', async () => {
			const expiresAt = new Date('2000-01-01');
			client.query.mockResolvedValue({ updateSessie: { id: '1' } });

			const result = await repository.updateSessionExpiry({
				sessionId: 'hash',
				expiresAt
			});

			expect(result).toEqual({ id: '1' });
			expect(client.query).toHaveBeenCalledWith(expect.any(String), {
				sessionId: 'hash',
				expiresAt
			});
		});

		it('returns null on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error('fail'));

			expect(
				await repository.updateSessionExpiry({ sessionId: 'sessionToken', expiresAt: new Date() })
			).toBeNull();
			spy.mockRestore();
		});

		it('returns null when mutation returns no row', async () => {
			client.query.mockResolvedValue({ updateSessie: null });

			await expect(
				repository.updateSessionExpiry({ sessionId: 'sessionToken', expiresAt: new Date() })
			).resolves.toBeNull();
		});
	});

	describe('deleteSessionById', () => {
		it('returns delete payload from GraphQL', async () => {
			client.query.mockResolvedValue({ deleteSessie: { id: '1' } });

			const result = await repository.deleteSessionById('sessionToken');

			expect(result).toEqual({ id: '1' });
		});

		it('returns null when mutation returns no row', async () => {
			client.query.mockResolvedValue({ deleteSessie: null });

			await expect(repository.deleteSessionById('x')).resolves.toBeNull();
		});

		it('returns null on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error('fail'));

			expect(await repository.deleteSessionById('x')).toBeNull();
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

		it('throws when Directus request fails', async () => {
			client.request.mockRejectedValue(new Error('offline'));

			await expect(
				repository.createSessionRecord({
					sessionId: 'sessionToken',
					userId: '1',
					expiresAt: new Date()
				})
			).rejects.toThrow('offline');
		});
	});
});
