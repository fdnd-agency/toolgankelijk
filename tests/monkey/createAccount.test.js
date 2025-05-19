import { describe, it, expect, afterEach } from 'vitest';
import { actions } from '../../src/routes/account/+page.server.js';
import { hygraph } from '../../src/lib/utils/hygraph.js';

// Helper to generate random strings
function randomString(length) {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

// Helper to generate a random email
function randomEmail() {
	return `${randomString(8)}@${randomString(5)}.com`;
}

let createdUsers = [];

describe('Monkey test: create account with random input', () => {
	for (let i = 0; i < 20; i++) {
		it(`random input attempt #${i + 1}`, async () => {
			const email = Math.random() > 0.5 ? randomEmail() : randomString(10); // sometimes not a valid email
			const username = randomString(Math.floor(Math.random() * 40)); // random length
			const password = randomString(Math.floor(Math.random() * 20) + 1);
			const confirmPassword = Math.random() > 0.2 ? password : randomString(password.length); // sometimes mismatch

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
				cookies: {
					set: () => {}
				}
			};

			const result = await actions.default(event);

			// The result should either be a success object with username, or an ActionFailure with status/data
			if (result && result.username) {
				expect(result.username).toBe(username);
				// Store for cleanup
				createdUsers.push({ email });
			} else if (result && result.status && result.data && result.data.message) {
				expect(typeof result.data.message).toBe('string');
			} else {
				throw new Error('Unexpected result format: ' + JSON.stringify(result));
			}
		});
	}

	afterEach(async () => {
		if (createdUsers.length === 0) return;

		// Remove all created users and their sessions
		for (const { email } of createdUsers) {
			const userQuery = `
                query ($email: String!) {
                    gebruiker(where: { email: $email }) {
                        id
                        sessies { id }
                    }
                }
            `;
			const userData = await hygraph.request(userQuery, { email });
			const userId = userData.gebruiker?.id;
			const sessionIds = userData.gebruiker?.sessies?.map((s) => s.id) ?? [];
			for (const sessieId of sessionIds) {
				const deleteSessionMutation = `
                    mutation ($id: ID!) {
                        deleteSessie(where: { id: $id }) { id }
                    }
                `;
				await hygraph.request(deleteSessionMutation, { id: sessieId });
			}
			if (userId) {
				const deleteUserMutation = `
                    mutation ($id: ID!) {
                        deleteGebruiker(where: { id: $id }) { id }
                    }
                `;
				await hygraph.request(deleteUserMutation, { id: userId });
			}
		}
		createdUsers = [];
	});
});
