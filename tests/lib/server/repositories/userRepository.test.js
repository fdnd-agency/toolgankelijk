/**
 * Tests for the UserRepository class.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gql } from 'graphql-request';
import { UserRepository } from '$lib/server/repositories/userRepository.js';

describe('UserRepository', () => {
	let client;
	let repository;

	beforeEach(() => {
		vi.clearAllMocks();
		client = { request: vi.fn() };
		repository = new UserRepository({ client, gql });
	});

	describe('checkUsernameAvailability', () => {
		it('returns true when no users match', async () => {
			client.request.mockResolvedValue({ users: [] });

			await expect(repository.checkUsernameAvailability('free')).resolves.toBe(true);
		});

		it('returns false when users exist', async () => {
			client.request.mockResolvedValue({ users: [{ id: '1' }] });

			await expect(repository.checkUsernameAvailability('taken')).resolves.toBe(false);
		});

		it('returns false on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.checkUsernameAvailability('x')).resolves.toBe(false);
			spy.mockRestore();
		});
	});

	describe('createUser', () => {
		it('maps createUser row to User', async () => {
			client.request.mockResolvedValue({
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
			client.request.mockResolvedValue({
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
			client.request.mockResolvedValue({ createUser: null });

			const result = await repository.createUser({
				email: 'e@x.com',
				username: 'name',
				passwordHash: 'h'
			});

			expect(result).toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('graphql'));

			const result = await repository.createUser({
				email: 'e@x.com',
				username: 'name',
				passwordHash: 'h'
			});

			expect(result).toBeNull();
			spy.mockRestore();
		});
	});

	describe('getUserPasswordHash', () => {
		it('returns password from first user row', async () => {
			client.request.mockResolvedValue({
				user: [{ password: 'stored-hash' }]
			});

			await expect(repository.getUserPasswordHash('uid')).resolves.toBe('stored-hash');
		});

		it('returns null when no row', async () => {
			client.request.mockResolvedValue({ user: [] });

			await expect(repository.getUserPasswordHash('uid')).resolves.toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.getUserPasswordHash('uid')).resolves.toBeNull();
			spy.mockRestore();
		});
	});

	describe('getUserByEmail', () => {
		it('maps row using is_email_verified', async () => {
			client.request.mockResolvedValue({
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
			client.request.mockResolvedValue({ user: [] });

			await expect(repository.getUserByEmail('none@x.com')).resolves.toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.getUserByEmail('a@b.c')).resolves.toBeNull();
			spy.mockRestore();
		});
	});

	describe('markUserEmailVerified', () => {
		it('returns updateUser payload', async () => {
			const updated = { id: '1', isEmailVerified: true };
			client.request.mockResolvedValue({ updateUser: updated });

			await expect(repository.markUserEmailVerified('1')).resolves.toEqual(updated);
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.markUserEmailVerified('1')).resolves.toBeNull();
			spy.mockRestore();
		});
	});

	describe('checkEmailAvailability', () => {
		it('returns true when toolgankelijk_user is empty', async () => {
			client.request.mockResolvedValue({ toolgankelijk_user: [] });

			await expect(repository.checkEmailAvailability('new@x.com')).resolves.toBe(true);
		});

		it('returns false when email exists', async () => {
			client.request.mockResolvedValue({ toolgankelijk_user: [{ id: '1' }] });

			await expect(repository.checkEmailAvailability('taken@x.com')).resolves.toBe(false);
		});

		it('returns false when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.checkEmailAvailability('x@y.z')).resolves.toBe(false);
			spy.mockRestore();
		});
	});

	describe('getValidEmailDomains', () => {
		it('returns domain list from API', async () => {
			const domains = [{ domain: 'school.nl' }];
			client.request.mockResolvedValue({ toolgankelijk_email_domain: domains });
			await expect(repository.getValidEmailDomains()).resolves.toEqual(domains);
		});

		it('returns [] on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));
			await expect(repository.getValidEmailDomains()).resolves.toEqual([]);
			spy.mockRestore();
		});
	});

	describe('getEmailVerificationRequestById', () => {
		it('maps emailVerificationCode to EmailVerificationRequest', async () => {
			const expires = '2026-12-31T23:59:59.000Z';
			client.request.mockResolvedValue({
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
			client.request.mockResolvedValue({ emailVerificationCode: null });
			await expect(repository.getEmailVerificationRequestById('missing')).resolves.toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));
			await expect(repository.getEmailVerificationRequestById('ev1')).resolves.toBeNull();
			spy.mockRestore();
		});
	});

	describe('createEmailVerificationRequestRecord', () => {
		it('maps mutation result', async () => {
			const expiresAt = new Date('2026-01-01T00:00:00.000Z');
			client.request.mockResolvedValue({
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
			client.request.mockResolvedValue({ createEmailVerificationCode: null });
			const result = await repository.createEmailVerificationRequestRecord({
				code: 'c',
				expiresAt: new Date(),
				userId: 'u1'
			});
			expect(result).toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));
			const result = await repository.createEmailVerificationRequestRecord({
				code: 'c',
				expiresAt: new Date(),
				userId: 'u1'
			});
			expect(result).toBeNull();
			spy.mockRestore();
		});
	});

	describe('deleteEmailVerificationsForUser', () => {
		it('returns delete payload', async () => {
			client.request.mockResolvedValue({ deleteEmailVerificationCodes: { ids: ['a', 'b'] } });
			await expect(repository.deleteEmailVerificationsForUser('u1')).resolves.toEqual({
				ids: ['a', 'b']
			});
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));
			await expect(repository.deleteEmailVerificationsForUser('u1')).resolves.toBeNull();
			spy.mockRestore();
		});
	});
});
