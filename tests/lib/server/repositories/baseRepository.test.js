/**
 * Tests for the BaseRepository class.
 */
import { beforeEach, describe, it, expect } from 'vitest';
import { gql } from 'graphql-request';
import { BaseRepository } from '$lib/server/repositories/baseRepository.js';

/**
 * Creates a new BaseRepository instance.
 */
function createBaseRepository() {
	return new BaseRepository({
		client: { request: () => {} },
		gql
	});
}

describe('BaseRepository', () => {
	let baseRepository;

	beforeEach(() => {
		baseRepository = createBaseRepository();
	});

	describe('normalizeToArray', () => {
		it('returns arrays unchanged', () => {
			const a = [{ x: 1 }, { x: 2 }];
			expect(baseRepository.normalizeToArray(a)).toBe(a);
		});

		it('unwraps { data: [...] }', () => {
			expect(baseRepository.normalizeToArray({ data: [1, 2] })).toEqual([1, 2]);
		});

		it('returns [] when { data: [] } is empty', () => {
			expect(baseRepository.normalizeToArray({ data: [] })).toEqual([]);
		});

		it('wraps a single object when allowSingleObject is true', () => {
			const o = { id: 'a' };
			expect(baseRepository.normalizeToArray(o)).toEqual([o]);
		});

		it('returns [] for a plain object when allowSingleObject is false', () => {
			expect(baseRepository.normalizeToArray({ id: 'a' }, { allowSingleObject: false })).toEqual(
				[]
			);
		});

		it.each([null, undefined, 'x'])('returns [] for %p', (value) => {
			expect(baseRepository.normalizeToArray(value)).toEqual([]);
		});
	});

	describe('unwrapRelation', () => {
		it('returns nested object when present', () => {
			const nested = { id: 'n' };
			expect(baseRepository.unwrapRelation({ relation: nested }, 'relation')).toBe(nested);
		});

		it.each([
			{ source: null, key: 'k' },
			{ source: { a: 1 }, key: 'missing' }
		])('returns null when source/key is invalid: %p', ({ source, key }) => {
			expect(baseRepository.unwrapRelation(source, key)).toBeNull();
		});

		it('returns null when relation value is not an object', () => {
			expect(baseRepository.unwrapRelation({ relation: 'string' }, 'relation')).toBeNull();
		});
	});

	describe('firstOrNull', () => {
		it('returns first element of a non-empty array', () => {
			expect(baseRepository.firstOrNull([{ id: '1' }, { id: '2' }])).toEqual({ id: '1' });
		});

		it('returns null for empty array', () => {
			expect(baseRepository.firstOrNull([])).toBeNull();
		});

		it('returns object when value is a non-array object', () => {
			const o = { id: 'x' };
			expect(baseRepository.firstOrNull(o)).toBe(o);
		});

		it.each([null, undefined, 's'])('returns null for %p', (value) => {
			expect(baseRepository.firstOrNull(value)).toBeNull();
		});
	});
});
