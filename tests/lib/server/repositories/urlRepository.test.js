/**
 * Tests for the UrlRepository class (Directus REST SDK).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UrlRepository } from '$lib/server/repositories/urlRepository.js';
import { RepositoryError } from '$lib/server/repositories/baseRepository.js';

describe('UrlRepository', () => {
	let client;
	let repository;

	beforeEach(() => {
		vi.clearAllMocks();
		client = { request: vi.fn() };
		repository = new UrlRepository({ client });
	});

	describe('getUrl', () => {
		it('maps URL node with checks and success criteria', async () => {
			client.request.mockResolvedValue([
				{
					id: 'url-1',
					name: 'Home',
					url: 'https://x/',
					slug: 'home',
					website_id: { id: 'w1' },
					checks: [
						{
							id: 'c1',
							success_criteria: [
								{
									toolgankelijk_success_criteria_id: {
										id: 'sc1',
										index: '1.1.1',
										level: 'A'
									}
								}
							]
						}
					]
				}
			]);

			const result = await repository.getUrl('home');

			expect(result).toEqual({
				id: 'url-1',
				name: 'Home',
				url: 'https://x/',
				slug: 'home',
				website: { id: 'w1' },
				checks: [
					{
						id: 'c1',
						successCriteria: [
							{
								id: 'sc1',
								index: '1.1.1',
								level: 'A'
							}
						]
					}
				]
			});
		});

		it('returns null when no URL', async () => {
			client.request.mockResolvedValue([]);

			await expect(repository.getUrl('missing')).resolves.toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(repository.getUrl('x')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('addUrl', () => {
		it('returns id from create item', async () => {
			client.request.mockResolvedValue({ id: 'new-id' });

			const result = await repository.addUrl({
				urlSlug: 'p',
				urlLink: 'https://x/p',
				websiteSlug: 'site',
				urlName: 'Page'
			});

			expect(result).toEqual({ id: 'new-id' });
		});

		it('returns null when create returns no id', async () => {
			client.request.mockResolvedValue({});

			const result = await repository.addUrl({
				urlSlug: 'p',
				urlLink: 'https://x/p',
				websiteSlug: 'site',
				urlName: 'Page'
			});

			expect(result).toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(
				repository.addUrl({
					urlSlug: 'p',
					urlLink: 'https://x/p',
					websiteSlug: 'site',
					urlName: 'Page'
				})
			).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('updateUrl', () => {
		it('returns id and fields when row exists', async () => {
			client.request.mockResolvedValue({ id: 'u1' });

			const result = await repository.updateUrl({
				id: 'u1',
				slug: 's',
				url: 'https://z/',
				name: 'N'
			});

			expect(result).toEqual({ id: 'u1', slug: 's', url: 'https://z/', name: 'N' });
		});

		it('returns null when update returns no id', async () => {
			client.request.mockResolvedValue({});

			const result = await repository.updateUrl({
				id: 'u1',
				slug: 's',
				url: 'https://z/',
				name: 'N'
			});

			expect(result).toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(
				repository.updateUrl({
					id: 'u1',
					slug: 's',
					url: 'https://z/',
					name: 'N'
				})
			).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('deleteUrl', () => {
		it('returns deleted id on success', async () => {
			client.request.mockResolvedValue(undefined);

			await expect(repository.deleteUrl('d1')).resolves.toEqual({ id: 'd1' });
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(repository.deleteUrl('d1')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('deleteUrlWithChecks', () => {
		it('requests checks delete then URL delete', async () => {
			client.request.mockResolvedValue(undefined);

			const result = await repository.deleteUrlWithChecks('u1');

			expect(client.request).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ id: 'u1' });
		});

		it('throws RepositoryError when deleting checks fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValueOnce(new Error());

			await expect(repository.deleteUrlWithChecks('u1')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});

		it('throws RepositoryError when URL delete fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error());

			await expect(repository.deleteUrlWithChecks('u1')).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('createEmptyCheckForUrl', () => {
		it('returns new check id after resolving URL', async () => {
			client.request
				.mockResolvedValueOnce([{ id: 'url-1', website_id: { slug: 'ws' } }])
				.mockResolvedValueOnce({ id: 'chk-1' });

			const result = await repository.createEmptyCheckForUrl({
				websiteSlug: 'ws',
				urlSlug: 'us'
			});

			expect(result).toEqual({ id: 'chk-1' });
			expect(client.request).toHaveBeenCalledTimes(2);
		});

		it('returns null when no URL row', async () => {
			client.request.mockResolvedValueOnce([]);

			const result = await repository.createEmptyCheckForUrl({
				websiteSlug: 'ws',
				urlSlug: 'us'
			});

			expect(result).toBeNull();
			expect(client.request).toHaveBeenCalledTimes(1);
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(
				repository.createEmptyCheckForUrl({
					websiteSlug: 'ws',
					urlSlug: 'us'
				})
			).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('getFirstCheck', () => {
		it('returns first check id from nested shape', async () => {
			client.request.mockResolvedValue([{ website_id: { slug: 'w' }, checks: [{ id: 'chk-1' }] }]);

			await expect(repository.getFirstCheck({ websiteSlug: 'w', urlSlug: 'u' })).resolves.toBe(
				'chk-1'
			);
		});

		it('returns null when no URL', async () => {
			client.request.mockResolvedValue([]);

			await expect(
				repository.getFirstCheck({ websiteSlug: 'w', urlSlug: 'u' })
			).resolves.toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(repository.getFirstCheck({ websiteSlug: 'w', urlSlug: 'u' })).rejects.toThrow(
				RepositoryError
			);
			spy.mockRestore();
		});
	});

	describe('addSuccessCriteriaToCheck', () => {
		it('loads links then returns check id from update', async () => {
			client.request
				.mockResolvedValueOnce({
					success_criteria: [{ toolgankelijk_success_criteria_id: { id: 'existing' } }]
				})
				.mockResolvedValueOnce({ id: 'c' });

			const result = await repository.addSuccessCriteriaToCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriteriaId: 'sc'
			});

			expect(result).toEqual({ id: 'c' });
			expect(client.request).toHaveBeenCalledTimes(2);
		});

		it('returns check id without update when criterion already linked', async () => {
			client.request.mockResolvedValueOnce({
				success_criteria: [{ toolgankelijk_success_criteria_id: { id: 'sc' } }]
			});

			const result = await repository.addSuccessCriteriaToCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriteriaId: 'sc'
			});

			expect(result).toEqual({ id: 'c' });
			expect(client.request).toHaveBeenCalledTimes(1);
		});

		it('returns null when update returns no id', async () => {
			client.request.mockResolvedValueOnce({ success_criteria: [] }).mockResolvedValueOnce({});

			const result = await repository.addSuccessCriteriaToCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriteriaId: 'sc'
			});

			expect(result).toBeNull();
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(
				repository.addSuccessCriteriaToCheck({
					websiteSlug: 'w',
					urlSlug: 'u',
					checkId: 'c',
					successCriteriaId: 'sc'
				})
			).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});

	describe('removeSuccessCriteriaFromCheck', () => {
		it('loads links then returns check id from update', async () => {
			client.request
				.mockResolvedValueOnce({
					success_criteria: [
						{ id: 'j1', toolgankelijk_success_criteria_id: { id: 'sc' } },
						{ id: 'j2', toolgankelijk_success_criteria_id: { id: 'keep' } }
					]
				})
				.mockResolvedValueOnce({ id: 'c' });

			const result = await repository.removeSuccessCriteriaFromCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriteriaId: 'sc'
			});

			expect(result).toEqual({ id: 'c' });
			expect(client.request).toHaveBeenCalledTimes(2);
		});

		it('returns check id when junction delete succeeds', async () => {
			client.request
				.mockResolvedValueOnce({
					success_criteria: [{ id: 'j1', toolgankelijk_success_criteria_id: { id: 'sc' } }]
				})
				.mockResolvedValueOnce({});

			const result = await repository.removeSuccessCriteriaFromCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriteriaId: 'sc'
			});

			expect(result).toEqual({ id: 'c' });
		});

		it('throws RepositoryError on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error());

			await expect(
				repository.removeSuccessCriteriaFromCheck({
					websiteSlug: 'w',
					urlSlug: 'u',
					checkId: 'c',
					successCriteriaId: 'sc'
				})
			).rejects.toThrow(RepositoryError);
			spy.mockRestore();
		});
	});
});
