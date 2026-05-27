/**
 * Tests for the BaseRepository class.
 */
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { BaseDirectusRepository } from '$lib/server/repositories/baseRepository.js';
import { readItems } from '@directus/sdk';

vi.mock('@directus/sdk', async () => {
	const actual = await vi.importActual('@directus/sdk');
	return {
		...actual,
		readItems: vi.fn((collection, options) => ({ collection, options }))
	};
});

vi.mock('$lib/utils/sitemap', () => ({
	delay: vi.fn(() => Promise.resolve())
}));

/**
 * Creates a new repository instance with a mocked request method.
 */
function createBaseRepository(mockRequest = vi.fn()) {
	return new BaseDirectusRepository({
		client: {
			request: mockRequest
		}
	});
}

describe('BaseRepository', () => {
	let baseRepository;

	beforeEach(() => {
		vi.clearAllMocks();
		baseRepository = createBaseRepository();
	});

	describe('_fetchAllFromCollection', () => {
		it('fetches a single page and returns items', async () => {
			const mockItems = [{ id: 1 }, { id: 2 }];
			const mockRequest = vi.fn().mockResolvedValue(mockItems);
			baseRepository = createBaseRepository(mockRequest);

			const result = await baseRepository._fetchAllFromCollection({
				collection: 'test_collection'
			});

			expect(result).toEqual(mockItems);
			expect(mockRequest).toHaveBeenCalledTimes(1);
		});

		it('paginates correctly across multiple pages', async () => {
			const page1 = [{ id: 1 }, { id: 2 }];
			const page2 = [{ id: 3 }];
			const mockRequest = vi.fn().mockResolvedValueOnce(page1).mockResolvedValueOnce(page2);

			baseRepository = createBaseRepository(mockRequest);

			const result = await baseRepository._fetchAllFromCollection({
				collection: 'test_collection',
				batchSize: 2
			});

			expect(result).toEqual([...page1, ...page2]);
			expect(mockRequest).toHaveBeenCalledTimes(2);
			expect(readItems).toHaveBeenNthCalledWith(
				2,
				'test_collection',
				expect.objectContaining({ offset: 2 })
			);
		});

		it('applies mapFn to items if provided', async () => {
			const mockItems = [{ val: 1 }];
			const mockRequest = vi.fn().mockResolvedValue(mockItems);
			baseRepository = createBaseRepository(mockRequest);

			const result = await baseRepository._fetchAllFromCollection({
				collection: 'test_collection',
				mapFn: (item) => ({ ...item, mapped: true })
			});

			expect(result[0].mapped).toBe(true);
		});

		it('returns empty array when collection is empty', async () => {
			const mockRequest = vi.fn().mockResolvedValue([]);
			baseRepository = createBaseRepository(mockRequest);

			const result = await baseRepository._fetchAllFromCollection({
				collection: 'test_collection'
			});

			expect(result).toEqual([]);
		});
	});

	describe('normalizeToArray', () => {
		it('returns arrays unchanged', () => {
			const a = [{ x: 1 }];
			expect(baseRepository.normalizeToArray(a)).toBe(a);
		});

		it('unwraps { data: [...] }', () => {
			expect(baseRepository.normalizeToArray({ data: [1, 2] })).toEqual([1, 2]);
		});

		it('wraps a single object when allowSingleObject is true', () => {
			const o = { id: 'a' };
			expect(baseRepository.normalizeToArray(o)).toEqual([o]);
		});
	});

	describe('unwrapRelation', () => {
		it('returns nested object when present', () => {
			const nested = { id: 'n' };
			expect(baseRepository.unwrapRelation({ relation: nested }, 'relation')).toBe(nested);
		});
	});

	describe('firstOrNull', () => {
		it('returns first element of a non-empty array', () => {
			expect(baseRepository.firstOrNull([1, 2])).toEqual(1);
		});

		it('returns null for empty array', () => {
			expect(baseRepository.firstOrNull([])).toBeNull();
		});
	});
});
