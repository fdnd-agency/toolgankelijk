import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import { actions } from '../../src/routes/[websiteUID]/addUrl/+page.server.js';
import { urlRepository } from '$lib/server/index.js';

vi.mock('$lib/server/index.js', async (importOriginal) => {
	const original = await importOriginal();
	return {
		...original,
		urlRepository: {
			addUrl: vi.fn(),
			createEmptyCheckForUrl: vi.fn()
		}
	};
});

const urlSubmission = fc.record({
	name: fc.oneof(fc.string(), fc.constant(null)),
	url: fc.oneof(fc.string(), fc.constant(null)),
	slug: fc.oneof(fc.string(), fc.constant(null))
});

describe('Monkey test: addUrl action with random input', () => {
	it('handles all inputs gracefully and returns a result object', { timeout: 10000 }, async () => {
		await fc.assert(
			fc.asyncProperty(urlSubmission, async (input) => {
				const event = {
					request: {
						formData: async () => ({
							get: (key) => input[key]
						})
					},
					params: { websiteUID: 'test-website' },
					locals: { session: {}, user: { isEmailVerified: true } }
				};

				vi.mocked(urlRepository.addUrl).mockResolvedValue({ id: '123' });
				vi.mocked(urlRepository.createEmptyCheckForUrl).mockResolvedValue({ id: '456' });

				let result;
				try {
					result = await actions.addUrl(event);
				} catch (err) {
					expect(err).toBeUndefined();
				}

				expect(typeof result).toBe('object');
				expect(result).toHaveProperty('success');
				expect(result).toHaveProperty('message');
			}),
			{ numRuns: 100 }
		);
	});
});
