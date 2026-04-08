/**
 * Tests for the ContentRepository class.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gql } from 'graphql-request';
import { ContentRepository } from '$lib/server/repositories/contentRepository.js';

describe('ContentRepository', () => {
	let client;
	let repository;

	beforeEach(() => {
		vi.clearAllMocks();
		client = { request: vi.fn() };
		repository = new ContentRepository({ client, gql });
	});

	describe('getAllPrinciples', () => {
		it('maps principles and guideline junction rows', async () => {
			client.request.mockResolvedValue({
				toolgankelijk_principle: [
					{
						id: 'p1',
						title: 'T',
						description: 'D',
						index: '1',
						slug: 'perceivable',
						guidelines: [
							{
								toolgankelijk_guideline_id: {
									id: 'g1',
									successcriteria: [
										{
											toolgankelijk_success_criteria_id: {
												id: 'sc1',
												index: '1.1.1',
												level: 'A',
												title: 'SC',
												easyCriteria: 'easy',
												criteria: 'hard'
											}
										}
									]
								}
							}
						]
					}
				]
			});

			const result = await repository.getAllPrinciples();

			expect(result).toHaveLength(1);
			expect(result[0].id).toBe('p1');
			expect(result[0].guidelines[0].id).toBe('g1');
			expect(result[0].guidelines[0].successCriteria[0]).toMatchObject({
				id: 'sc1',
				index: '1.1.1',
				level: 'A',
				title: 'SC'
			});
		});

		it('returns [] on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.getAllPrinciples()).resolves.toEqual([]);
			spy.mockRestore();
		});
	});

	describe('getLevels', () => {
		it('maps level nodes', async () => {
			client.request.mockResolvedValue({
				toolgankelijk_level: [
					{ id: 'l1', level: 'A', slug: 'a' },
					{ id: 'l2', level: 'AA', slug: 'aa' }
				]
			});

			const result = await repository.getLevels();

			expect(result).toEqual([
				{ id: 'l1', level: 'A', slug: 'a' },
				{ id: 'l2', level: 'AA', slug: 'aa' }
			]);
		});

		it('returns [] on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			await expect(repository.getLevels()).resolves.toEqual([]);
			spy.mockRestore();
		});
	});

	describe('getToolboard', () => {
		it('builds toolboard payload with url, principle, and principles list', async () => {
			client.request.mockResolvedValue({
				url: [
					{
						id: 'u1',
						slug: 'page',
						url: 'https://x/page',
						checks: [{ id: 'c1', successcriteria: [{ id: 's1' }] }]
					}
				],
				principle: [
					{
						id: 'p1',
						title: 'Principle',
						description: 'Desc',
						index: '1',
						slug: 'perceivable',
						guidelines: []
					}
				],
				principles: [
					{
						id: 'p1',
						title: 'Principle',
						description: 'Desc',
						index: '1',
						slug: 'perceivable',
						guidelines: []
					}
				]
			});

			const result = await repository.getToolboard({
				urlSlug: 'page',
				principleSlug: 'perceivable'
			});

			expect(result.url).toMatchObject({
				id: 'u1',
				slug: 'page',
				url: 'https://x/page'
			});
			expect(result.url?.checks[0].successCriteria).toEqual([{ id: 's1' }]);
			expect(result.principle?.slug).toBe('perceivable');
			expect(result.principles).toHaveLength(1);
		});

		it('uses placeholder check when url has no checks', async () => {
			client.request.mockResolvedValue({
				url: [
					{
						id: 'u1',
						slug: 'page',
						url: 'https://x/page',
						checks: []
					}
				],
				principle: [],
				principles: []
			});

			const result = await repository.getToolboard({
				urlSlug: 'page',
				principleSlug: 'p'
			});

			expect(result.url?.checks).toEqual([{ id: '', successCriteria: [] }]);
		});

		it('returns null url and principle when GraphQL returns empty collections', async () => {
			client.request.mockResolvedValue({
				url: [],
				principle: [],
				principles: []
			});

			const result = await repository.getToolboard({
				urlSlug: 'missing',
				principleSlug: 'missing'
			});

			expect(result.url).toBeNull();
			expect(result.principle).toBeNull();
			expect(result.principles).toEqual([]);
		});

		it('returns empty toolboard on error', async () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			client.request.mockRejectedValue(new Error('fail'));

			const result = await repository.getToolboard({
				urlSlug: 'a',
				principleSlug: 'b'
			});

			expect(result).toEqual({
				url: null,
				principle: null,
				principles: []
			});
			spy.mockRestore();
		});
	});
});
