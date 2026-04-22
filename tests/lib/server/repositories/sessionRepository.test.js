/**
 * Tests for the SessionRepository class.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$env/static/private', () => ({
	DIRECTUS_URL: 'https://directus.test',
	VITE_DIRECTUS_KEY: 'test-token'
}));

import { SessionRepository } from '$lib/server/repositories/sessionRepository.js';

describe('SessionRepository', () => {
	let client;
	let repository;

	beforeEach(() => {
		vi.clearAllMocks();
		client = { query: vi.fn() };
		repository = new SessionRepository({ client });
	});

	describe('getSessionByTokenHash', () => {
		it('returns mapped session and user from GraphQL response', async () => {
			const row = {
				id: 's1',
				session_id: 'opaque',
				expires_at: new Date().toISOString(),
				user_id: { id: 'u1', email: 'a@b.c', username: 'u', is_email_verified: true }
			};
			client.query.mockResolvedValue({ session: [row] });

			const result = await repository.getSessionByTokenHash('hashed');

			expect(result).toEqual({
				session: {
					id: 'opaque',
					userId: 'u1',
					expiresAt: new Date(row.expires_at)
				},
				user: {
					id: 'u1',
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
			const expiresAt = new Date('2026-01-15T12:00:00.000Z');
			client.query.mockResolvedValue({ updateSessie: { id: 'row-1' } });

			const result = await repository.updateSessionExpiry({
				sessionId: 'hash',
				expiresAt
			});

			expect(result).toEqual({ id: 'row-1' });
			expect(client.query).toHaveBeenCalledWith(expect.any(String), { sessionId: 'hash', expiresAt });
		});

		it('returns null on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error('fail'));

			expect(
				await repository.updateSessionExpiry({ sessionId: 'a', expiresAt: new Date() })
			).toBeNull();
			spy.mockRestore();
		});

		it('returns null when mutation returns no row', async () => {
			client.query.mockResolvedValue({ updateSessie: null });

			await expect(
				repository.updateSessionExpiry({ sessionId: 'x', expiresAt: new Date() })
			).resolves.toBeNull();
		});
	});

	describe('deleteSessionById', () => {
		it('returns delete payload from GraphQL', async () => {
			client.query.mockResolvedValue({ deleteSessie: { id: 'del-1' } });

			const result = await repository.deleteSessionById('hash');

			expect(result).toEqual({ id: 'del-1' });
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
		it('returns session shape when REST POST succeeds', async () => {
			const fetchMock = vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({ data: { id: '1' } })
			});
			vi.stubGlobal('fetch', fetchMock);

			const expiresAt = new Date('2026-06-01T00:00:00.000Z');
			const result = await repository.createSessionRecord({
				sessionId: 'opaque-token',
				userId: 'user-1',
				expiresAt
			});

			expect(result).toEqual({ id: 'opaque-token', userId: 'user-1', expiresAt });
			expect(fetchMock).toHaveBeenCalledWith(
				'https://directus.test/items/toolgankelijk_session',
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						Authorization: 'Bearer test-token',
						'Content-Type': 'application/json'
					}),
					body: JSON.stringify({
						session_id: 'opaque-token',
						expires_at: expiresAt.toISOString(),
						user_id: 'user-1'
					})
				})
			);

			vi.unstubAllGlobals();
		});

		it('throws when response is not ok', async () => {
			vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

			await expect(
				repository.createSessionRecord({
					sessionId: 'a',
					userId: 'b',
					expiresAt: new Date()
				})
			).rejects.toThrow();
			vi.unstubAllGlobals();
		});

		it('throws when fetch throws', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

			await expect(
				repository.createSessionRecord({
					sessionId: 'a',
					userId: 'b',
					expiresAt: new Date()
				})
			).rejects.toThrow('offline');
			spy.mockRestore();
			vi.unstubAllGlobals();
		});
	});
});
