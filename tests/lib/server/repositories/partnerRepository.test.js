/**
 * Tests for the PartnerRepository class.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gql } from 'graphql-request';
import { PartnerRepository } from '$lib/server/repositories/partnerRepository.js';

describe('PartnerRepository', () => {
	let client;
	let repository;

	beforeEach(() => {
		vi.clearAllMocks();
		client = { request: vi.fn() };
		repository = new PartnerRepository({ client, gql });
	});

	describe('listPartners', () => {
		it('returns websites, count, and normalized principles', async () => {
			const websites = [{ id: 'w1', title: 'Site' }];
			client.request.mockResolvedValue({
				toolgankelijk_website: websites,
				toolgankelijk_website_aggregated: [{ count: { id: 5 } }],
				toolgankelijk_principle: [
					{
						id: 'p1',
						title: 'P',
						guidelines: [
							{
								toolgankelijk_guideline_id: {
									id: 'g1',
									successcriteria: [{ toolgankelijk_success_criteria_id: { id: 'sc1' } }]
								}
							}
						]
					}
				]
			});

			const result = await repository.listPartners({ limit: 10, offset: 0 });

			expect(result.websites).toEqual(websites);
			expect(result.totalWebsites).toBe(5);
			expect(result.principles).toHaveLength(1);
			expect(result.principles[0].guidelines[0]).toEqual({
				id: 'g1',
				successCriteria: [{ id: 'sc1' }]
			});
		});

		it('returns empty structure on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.listPartners();

			expect(result).toEqual({ websites: [], totalWebsites: 0, principles: [] });
			spy.mockRestore();
		});
	});

	describe('getWebsiteBySlug', () => {
		it('returns website, urls, totalUrls, and principles', async () => {
			const website = {
				id: 'w1',
				urls: [{ id: 'url1' }]
			};
			client.request.mockResolvedValue({
				toolgankelijk_website: [website],
				toolgankelijk_url_aggregated: [{ count: { id: 3 } }],
				toolgankelijk_principle: []
			});

			const result = await repository.getWebsiteBySlug('my-slug');

			expect(result.website).toEqual(website);
			expect(result.urls).toEqual(website.urls);
			expect(result.totalUrls).toBe(3);
			expect(result.principles).toEqual([]);
		});

		it('returns empty defaults on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.getWebsiteBySlug('x');

			expect(result).toEqual({
				website: null,
				urls: [],
				totalUrls: 0,
				principles: []
			});
			spy.mockRestore();
		});
	});

	describe('getPartnerUrls', () => {
		it('maps toolgankelijk_url to id-only list', async () => {
			client.request.mockResolvedValue({
				toolgankelijk_url: [{ id: 'a' }, { id: 'b' }]
			});

			const result = await repository.getPartnerUrls('partner-1', { skip: 0, first: 50 });

			expect(result).toEqual([{ id: 'a' }, { id: 'b' }]);
		});

		it('returns [] on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.getPartnerUrls('p')).resolves.toEqual([]);
			spy.mockRestore();
		});
	});

	describe('createPartner', () => {
		it('maps create payload to PartnerWebsite', async () => {
			client.request.mockResolvedValue({
				create_toolgankelijk_website_item: {
					id: 'w1',
					title: 'T',
					homepage: 'https://h',
					slug: 's'
				}
			});

			const result = await repository.createPartner({
				name: 'T',
				url: 'https://h',
				slug: 's'
			});

			expect(result).toEqual({
				id: 'w1',
				title: 'T',
				homepage: 'https://h',
				slug: 's'
			});
		});

		it('returns null when mutation returns no row', async () => {
			client.request.mockResolvedValue({ create_toolgankelijk_website_item: null });

			const result = await repository.createPartner({
				name: 'T',
				url: 'https://h',
				slug: 's'
			});

			expect(result).toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.createPartner({
				name: 'T',
				url: 'https://h',
				slug: 's'
			});

			expect(result).toBeNull();
			spy.mockRestore();
		});
	});

	describe('updatePartnerById', () => {
		it('returns partner with title/homepage from arguments', async () => {
			client.request.mockResolvedValue({
				update_toolgankelijk_website_item: { id: 'w1' }
			});

			const result = await repository.updatePartnerById({
				id: 'w1',
				name: 'New',
				url: 'https://n',
				slug: 'ns'
			});

			expect(result).toEqual({
				id: 'w1',
				title: 'New',
				homepage: 'https://n',
				slug: 'ns'
			});
		});

		it('returns null when mutation returns no row', async () => {
			client.request.mockResolvedValue({ update_toolgankelijk_website_item: null });

			const result = await repository.updatePartnerById({
				id: 'w1',
				name: 'N',
				url: 'https://n',
				slug: 'ns'
			});

			expect(result).toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.updatePartnerById({
				id: 'w1',
				name: 'N',
				url: 'https://n',
				slug: 'ns'
			});

			expect(result).toBeNull();
			spy.mockRestore();
		});
	});

	describe('updatePartnerTotalUrls', () => {
		it('returns id and totalUrls', async () => {
			client.request.mockResolvedValue({
				update_toolgankelijk_website_item: { id: 'w1' }
			});

			const result = await repository.updatePartnerTotalUrls({ slug: 's', totalUrls: 42 });

			expect(result).toEqual({ id: 'w1', totalUrls: 42 });
		});

		it('returns null when mutation returns no row', async () => {
			client.request.mockResolvedValue({ update_toolgankelijk_website_item: null });

			await expect(
				repository.updatePartnerTotalUrls({ slug: 's', totalUrls: 1 })
			).resolves.toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(
				repository.updatePartnerTotalUrls({ slug: 's', totalUrls: 1 })
			).resolves.toBeNull();
			spy.mockRestore();
		});
	});

	describe('deletePartnerById', () => {
		it('returns deleted id', async () => {
			client.request.mockResolvedValue({
				delete_toolgankelijk_website_item: { id: 'w1' }
			});

			await expect(repository.deletePartnerById('w1')).resolves.toEqual({ id: 'w1' });
		});

		it('returns null when delete row missing', async () => {
			client.request.mockResolvedValue({
				delete_toolgankelijk_website_item: null
			});

			await expect(repository.deletePartnerById('w1')).resolves.toBeNull();
		});

		it('returns null when request fails', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.deletePartnerById('w1')).resolves.toBeNull();
			spy.mockRestore();
		});
	});
});
