/**
 * Tests for the UrlRepository class.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gql } from 'graphql-request';
import { UrlRepository } from '$lib/server/repositories/urlRepository.js';

describe('UrlRepository', () => {
	let client;
	let repository;

	beforeEach(() => {
		vi.clearAllMocks();
		client = { request: vi.fn() };
		repository = new UrlRepository({ client, gql });
	});

	describe('getUrl', () => {
		it('maps URL node with checks and success criteria', async () => {
			client.request.mockResolvedValue({
				toolgankelijk_url: [
					{
						id: 'url-1',
						name: 'Home',
						url: 'https://x/',
						slug: 'home',
						website_id: { id: 'w1' },
						checks: [
							{
								id: 'c1',
								successcriteria: [
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
				]
			});

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
			client.request.mockResolvedValue({ toolgankelijk_url: [] });

			await expect(repository.getUrl('missing')).resolves.toBeNull();
		});

		it('returns null on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.getUrl('x')).resolves.toBeNull();
			spy.mockRestore();
		});
	});

	describe('addUrl', () => {
		it('returns id from create mutation', async () => {
			client.request.mockResolvedValue({
				create_toolgankelijk_url_item: { id: 'new-id' }
			});

			const result = await repository.addUrl({
				urlSlug: 'p',
				urlLink: 'https://x/p',
				websiteSlug: 'site',
				urlName: 'Page'
			});

			expect(result).toEqual({ id: 'new-id' });
		});

		it('returns null when mutation returns no row', async () => {
			client.request.mockResolvedValue({ create_toolgankelijk_url_item: null });

			const result = await repository.addUrl({
				urlSlug: 'p',
				urlLink: 'https://x/p',
				websiteSlug: 'site',
				urlName: 'Page'
			});

			expect(result).toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.addUrl({
				urlSlug: 'p',
				urlLink: 'https://x/p',
				websiteSlug: 'site',
				urlName: 'Page'
			});

			expect(result).toBeNull();
			spy.mockRestore();
		});
	});

	describe('updateUrl', () => {
		it('returns id and fields when row exists', async () => {
			client.request.mockResolvedValue({
				update_toolgankelijk_url_item: { id: 'u1' }
			});

			const result = await repository.updateUrl({
				id: 'u1',
				slug: 's',
				url: 'https://z',
				name: 'N'
			});

			expect(result).toEqual({ id: 'u1', slug: 's', url: 'https://z', name: 'N' });
		});

		it('returns null when mutation returns no row', async () => {
			client.request.mockResolvedValue({ update_toolgankelijk_url_item: null });

			const result = await repository.updateUrl({
				id: 'u1',
				slug: 's',
				url: 'https://z',
				name: 'N'
			});

			expect(result).toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.updateUrl({
				id: 'u1',
				slug: 's',
				url: 'https://z',
				name: 'N'
			});

			expect(result).toBeNull();
			spy.mockRestore();
		});
	});

	describe('deleteUrl', () => {
		it('returns deleted id', async () => {
			client.request.mockResolvedValue({
				delete_toolgankelijk_url_item: { id: 'd1' }
			});

			await expect(repository.deleteUrl('d1')).resolves.toEqual({ id: 'd1' });
		});

		it('returns null when mutation returns no row', async () => {
			client.request.mockResolvedValue({ delete_toolgankelijk_url_item: null });

			await expect(repository.deleteUrl('missing')).resolves.toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.deleteUrl('d1')).resolves.toBeNull();
			spy.mockRestore();
		});
	});

	describe('deleteUrlWithChecks', () => {
		it('requests checks delete then URL delete', async () => {
			client.request
				.mockResolvedValueOnce({}) // delete checks query
				.mockResolvedValueOnce({
					delete_toolgankelijk_url_item: { id: 'u1' }
				});

			const result = await repository.deleteUrlWithChecks('u1');

			expect(client.request).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ id: 'u1' });
		});

		it('returns null when deleting checks fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValueOnce(new Error('checks delete failed'));

			const result = await repository.deleteUrlWithChecks('u1');

			expect(result).toBeNull();
			expect(client.request).toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});

		it('returns null when URL delete returns no row', async () => {
			client.request
				.mockResolvedValueOnce({})
				.mockResolvedValueOnce({ delete_toolgankelijk_url_item: null });

			const result = await repository.deleteUrlWithChecks('u1');

			expect(result).toBeNull();
		});
	});

	describe('createEmptyCheckForUrl', () => {
		it('returns updateWebsite id', async () => {
			client.request.mockResolvedValue({ updateWebsite: { id: 'w1' } });

			const result = await repository.createEmptyCheckForUrl({
				websiteSlug: 'ws',
				urlSlug: 'us'
			});

			expect(result).toEqual({ id: 'w1' });
		});

		it('returns null when mutation returns no website row', async () => {
			client.request.mockResolvedValue({ updateWebsite: null });

			const result = await repository.createEmptyCheckForUrl({
				websiteSlug: 'ws',
				urlSlug: 'us'
			});

			expect(result).toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.createEmptyCheckForUrl({
				websiteSlug: 'ws',
				urlSlug: 'us'
			});

			expect(result).toBeNull();
			spy.mockRestore();
		});
	});

	describe('getFirstCheck', () => {
		it('returns first check id from nested shape', async () => {
			client.request.mockResolvedValue({
				website: {
					urls: [{ checks: [{ id: 'chk-1' }] }]
				}
			});

			await expect(repository.getFirstCheck({ websiteSlug: 'w', urlSlug: 'u' })).resolves.toBe(
				'chk-1'
			);
		});

		it('returns null when path missing', async () => {
			client.request.mockResolvedValue({ website: { urls: [] } });

			await expect(
				repository.getFirstCheck({ websiteSlug: 'w', urlSlug: 'u' })
			).resolves.toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(
				repository.getFirstCheck({ websiteSlug: 'w', urlSlug: 'u' })
			).resolves.toBeNull();
			spy.mockRestore();
		});
	});

	describe('addSuccessCriterionToCheck', () => {
		it('returns website id from mutation', async () => {
			client.request.mockResolvedValue({ updateWebsite: { id: 'wid' } });

			const result = await repository.addSuccessCriterionToCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriterionId: 'sc'
			});

			expect(result).toEqual({ id: 'wid' });
		});

		it('returns null when mutation returns no website row', async () => {
			client.request.mockResolvedValue({ updateWebsite: null });

			const result = await repository.addSuccessCriterionToCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriterionId: 'sc'
			});

			expect(result).toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.addSuccessCriterionToCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriterionId: 'sc'
			});

			expect(result).toBeNull();
			spy.mockRestore();
		});
	});

	describe('removeSuccessCriterionFromCheck', () => {
		it('returns website id from mutation', async () => {
			client.request.mockResolvedValue({ updateWebsite: { id: 'wid' } });

			const result = await repository.removeSuccessCriterionFromCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriterionId: 'sc'
			});

			expect(result).toEqual({ id: 'wid' });
		});

		it('returns null when mutation returns no website row', async () => {
			client.request.mockResolvedValue({ updateWebsite: null });

			const result = await repository.removeSuccessCriterionFromCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriterionId: 'sc'
			});

			expect(result).toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.removeSuccessCriterionFromCheck({
				websiteSlug: 'w',
				urlSlug: 'u',
				checkId: 'c',
				successCriterionId: 'sc'
			});

			expect(result).toBeNull();
			spy.mockRestore();
		});
	});
});
