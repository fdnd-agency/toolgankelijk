import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { actions } from '../../src/routes/account/+page.server.js';

// Helper: generate a random email or garbage string
const email = fc.oneof(fc.emailAddress(), fc.string({ minLength: 1, maxLength: 40 }));

// Helper: generate a username (sometimes valid, sometimes not)
const username = fc.string({ minLength: 0, maxLength: 40 });

// Helper: generate a password (sometimes valid, sometimes not)
const password = fc.string({ minLength: 0, maxLength: 40 });

// Compose confirm-password with password using .chain
const accountArb = fc
	.tuple(email, username, password)
	.chain(([email, username, password]) =>
		fc.boolean().map((match) => [email, username, password, match ? password : password + 'x'])
	);

describe('Monkey property test: create account with random input', () => {
	it('should never throw and always return a result object', async () => {
		await fc.assert(
			fc.asyncProperty(accountArb, async ([email, username, password, confirmPassword]) => {
				const event = {
					request: {
						formData: async () => ({
							get: (key) =>
								({
									email,
									username,
									password,
									'confirm-password': confirmPassword
								}[key])
						})
					},
					locals: { sessie: null, gebruiker: null },
					cookies: { set: () => {} }
				};

				let result;
				try {
					result = await actions.default(event);
				} catch (err) {
					expect(err).toBeUndefined();
				}
				expect(typeof result).toBe('object');
				expect(
					'status' in result ||
						'username' in result ||
						(result && result.data && 'message' in result.data)
				).toBe(true);
			}),
			{ numRuns: 200 }
		);
	}, 30_000); // Set the test timeout to 30 seconds to allow enough time for 200 property-based test runs
});
