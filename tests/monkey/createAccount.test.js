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
	it('handles all inputs gracefully and returns a result object', async () => {
		await fc.assert(
			fc.asyncProperty(account, async (acc) => {
				// Simulate the event object as expected by the action
				const event = {
					request: {
						// Simulate the form data as expected by the action
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
					// Call the register action with the simulated event
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
