import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { actions } from '../../src/routes/register/+page.server.js';

const account = fc
	.record({
		email: fc.oneof(fc.emailAddress(), fc.string({ minLength: 1, maxLength: 40 })),
		username: fc.string({ minLength: 0, maxLength: 40 }),
		password: fc.string({ minLength: 0, maxLength: 40 })
	})
	.chain(({ email, username, password }) =>
		fc.boolean().map((match) => ({
			email,
			username,
			password,
			confirmPassword: match ? password : password + 'x'
		}))
	);

describe('Monkey test: create account with random input', () => {
	it('handles all inputs gracefully and returns a result object', { timeout: 10000 }, async () => {
		await fc.assert(
			fc.asyncProperty(account, async (acc) => {
				const event = {
					request: {
						formData: async () => ({
							get: (key) =>
								({
									email: acc.email,
									username: acc.username,
									password: acc.password,
									'confirm-password': acc.confirmPassword
								})[key]
						})
					},
					locals: { sessie: null, gebruiker: null },
					cookies: { set: () => {} }
				};

				let result;
				try {
					result = await actions.register(event);
				} catch (err) {
					expect(err).toBeUndefined();
				}
				expect(typeof result).toBe('object');
				expect('status' in result || (result && result.data && 'message' in result.data)).toBe(
					true
				);
			}),
			{ numRuns: 200 }
		);
	});
});
