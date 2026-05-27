/**
 * Tests for the UserRepository class.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRepository } from '$lib/server/repositories/userRepository.js';
import { RepositoryError } from '$lib/server/repositories/baseRepository.js';

describe('UserRepository', () => {
	let client;
	let repository;

	beforeEach(() => {
		vi.clearAllMocks();
		client = { query: vi.fn() };
		repository = new UserRepository({ client });
	});

	describe('checkUsernameAvailability', () => {
		it('returns true when no users match', async () => {
			client.query.mockResolvedValue({ users: [] });

			await expect(repository.checkUsernameAvailability('free')).resolves.toBe(true);
		});

		it('returns false when users exist', async () => {
			client.query.mockResolvedValue({ users: [{ id: '1' }] });

			await expect(repository.checkUsernameAvailability('taken')).resolves.toBe(false);
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());

			await expect(repository.checkUsernameAvailability('x')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('createUser', () => {
		it('maps createUser row to User', async () => {
			client.query.mockResolvedValue({
				createUser: {
					id: 'u1',
					email: 'e@x.com',
					username: 'name',
					isEmailVerified: true
				}
			});

			const result = await repository.createUser({
				email: 'e@x.com',
				username: 'name',
				passwordHash: 'hash'
			});

			expect(result).toEqual({
				id: 'u1',
				email: 'e@x.com',
				username: 'name',
				isEmailVerified: true
			});
		});

		it('defaults isEmailVerified to false when omitted', async () => {
			client.query.mockResolvedValue({
				createUser: {
					id: 'u1',
					email: 'e@x.com',
					username: 'name'
				}
			});

			const result = await repository.createUser({
				email: 'e@x.com',
				username: 'name',
				passwordHash: 'hash'
			});

			expect(result?.isEmailVerified).toBe(false);
		});

		it('returns null when createUser is missing', async () => {
			client.query.mockResolvedValue({ createUser: null });

			const result = await repository.createUser({
				email: 'e@x.com',
				username: 'name',
				passwordHash: 'h'
			});

			expect(result).toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());

			await expect(
				repository.createUser({
					email: 'e@x.com',
					username: 'name',
					passwordHash: 'h'
				})
			).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('getUserPasswordHash', () => {
		it('returns password from first user row', async () => {
			client.query.mockResolvedValue({
				user: [{ password: 'stored-hash' }]
			});

			await expect(repository.getUserPasswordHash('uid')).resolves.toBe('stored-hash');
		});

		it('returns null when no row', async () => {
			client.query.mockResolvedValue({ user: [] });

			await expect(repository.getUserPasswordHash('uid')).resolves.toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());

			await expect(repository.getUserPasswordHash('uid')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('getUserByEmail', () => {
		it('maps row using is_email_verified', async () => {
			client.query.mockResolvedValue({
				user: [
					{
						id: '1',
						email: 'a@b.c',
						username: 'u',
						is_email_verified: true
					}
				]
			});

			const result = await repository.getUserByEmail('a@b.c');

			expect(result).toEqual({
				id: '1',
				email: 'a@b.c',
				username: 'u',
				isEmailVerified: true
			});
		});

		it('returns null when no user row', async () => {
			client.query.mockResolvedValue({ user: [] });

			await expect(repository.getUserByEmail('none@x.com')).resolves.toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());

			await expect(repository.getUserByEmail('a@b.c')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('markUserEmailVerified', () => {
		it('returns updateUser payload', async () => {
			const updated = { id: '1', isEmailVerified: true };
			client.query.mockResolvedValue({ updateUser: updated });

			await expect(repository.markUserEmailVerified('1')).resolves.toEqual(updated);
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());

			await expect(repository.markUserEmailVerified('1')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('checkEmailAvailability', () => {
		it('returns true when toolgankelijk_user is empty', async () => {
			client.query.mockResolvedValue({ toolgankelijk_user: [] });

			await expect(repository.checkEmailAvailability('new@x.com')).resolves.toBe(true);
		});

		it('returns false when email exists', async () => {
			client.query.mockResolvedValue({ toolgankelijk_user: [{ id: '1' }] });

			await expect(repository.checkEmailAvailability('taken@x.com')).resolves.toBe(false);
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());

			await expect(repository.checkEmailAvailability('x@y.z')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('getValidEmailDomains', () => {
		it('returns domain list from API', async () => {
			const domains = [{ domain: 'school.nl' }];
			client.query.mockResolvedValue({ toolgankelijk_email_domain: domains });
			await expect(repository.getValidEmailDomains()).resolves.toEqual(domains);
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());
			await expect(repository.getValidEmailDomains()).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('getEmailVerificationRequestById', () => {
		it('maps emailVerificationCode to EmailVerificationRequest', async () => {
			const expires = '2026-12-31T23:59:59.000Z';
			client.query.mockResolvedValue({
				emailVerificationCode: {
					id: 'ev1',
					code: '123456',
					expiresAt: expires,
					user: { id: 'u1', email: 'e@x.com' }
				}
			});

			const result = await repository.getEmailVerificationRequestById('ev1');

			expect(result).toEqual({
				id: 'ev1',
				userId: 'u1',
				email: 'e@x.com',
				code: '123456',
				expiresAt: new Date(expires)
			});
		});

		it('returns null when verification row is missing', async () => {
			client.query.mockResolvedValue({ emailVerificationCode: null });
			await expect(repository.getEmailVerificationRequestById('missing')).resolves.toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());
			await expect(repository.getEmailVerificationRequestById('ev1')).rejects.toThrow(
				RepositoryError
			);
			spy.mockRestore();
		});
	});

	describe('createEmailVerificationRequestRecord', () => {
		it('maps mutation result', async () => {
			const expiresAt = new Date('2026-01-01T00:00:00.000Z');
			client.query.mockResolvedValue({
				createEmailVerificationCode: {
					id: 'ev1',
					code: 'abc',
					expiresAt: expiresAt.toISOString(),
					user: { id: 'u1', email: 'e@x.com' }
				}
			});

			const result = await repository.createEmailVerificationRequestRecord({
				code: 'abc',
				expiresAt,
				userId: 'u1'
			});

			expect(result).toMatchObject({
				id: 'ev1',
				userId: 'u1',
				email: 'e@x.com',
				code: 'abc'
			});
			expect(result?.expiresAt).toEqual(expiresAt);
		});

		it('returns null when mutation returns no row', async () => {
			client.query.mockResolvedValue({ createEmailVerificationCode: null });
			const result = await repository.createEmailVerificationRequestRecord({
				code: 'c',
				expiresAt: new Date(),
				userId: 'u1'
			});
			expect(result).toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());
			await expect(
				repository.createEmailVerificationRequestRecord({
					code: 'c',
					expiresAt: new Date(),
					userId: 'u1'
				})
			).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('deleteEmailVerificationsForUser', () => {
		it('returns delete payload', async () => {
			client.query.mockResolvedValue({ deleteEmailVerificationCodes: { ids: ['a', 'b'] } });
			await expect(repository.deleteEmailVerificationsForUser('u1')).resolves.toEqual({
				ids: ['a', 'b']
			});
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.query.mockRejectedValue(new Error());
			await expect(repository.deleteEmailVerificationsForUser('u1')).rejects.toThrow(
				RepositoryError
			);
			spy.mockRestore();
		});
	});
});
