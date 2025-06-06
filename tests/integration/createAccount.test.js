import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { actions } from '../../src/routes/register/+page.server.js';
import { hygraph } from '../../src/lib/utils/hygraph.js';
import { requestWithRetry } from '../utils/requestWithRetry.js';

describe('src/routes/register/+page.server.js integration', () => {
	let event;
	let uniqueEmail;
	let uniqueUsername;

	beforeEach(() => {
		const unique = Date.now() + Math.floor(Math.random() * 10000);
		uniqueEmail = `test${unique}@vervoerregio.nl`;
		uniqueUsername = `John${unique}`;
		event = {
			request: {
				formData: async () => ({
					get: (key) =>
						({
							email: uniqueEmail,
							username: uniqueUsername,
							password: 'T3$tT3$t',
							'confirm-password': 'T3$tT3$t'
						}[key])
				})
			},
			locals: { sessie: null, gebruiker: null },
			cookies: {
				set: () => {}
			}
		};
	});

	it('creates user and session on valid input', async () => {
		try {
			await actions.register(event);
			throw new Error('Expected redirect to be thrown');
		} catch (e) {
			expect(e.status).toBe(302);
			expect(e.location).toBe('/verify-email');
		}
	});

	afterEach(async () => {
		// Find the user by email for cleanup
		const userQuery = `
        query ($email: String!) {
            gebruiker(where: { email: $email }) {
                id
                sessies {
                    id
                }
            }
        }
    `;
		const userData = await requestWithRetry(userQuery, { email: uniqueEmail });
		const createdUserId = userData.gebruiker?.id;
		const createdSessionIds = userData.gebruiker?.sessies?.map((s) => s.id) ?? [];

		// Find all email verification codes for this user
		let emailVerificationCodeIds = [];
		if (createdUserId) {
			const codesQuery = `
            query ($userId: ID!) {
                emailVerificatieCodes(where: { gebruiker: { id: $userId } }) {
                    id
                }
            }
        `;
			const codesData = await requestWithRetry(codesQuery, { userId: createdUserId });
			emailVerificationCodeIds = codesData.emailVerificatieCodes?.map((c) => c.id) ?? [];
		}

		// Delete email verification codes
		for (const codeId of emailVerificationCodeIds) {
			const deleteCodeMutation = `
            mutation ($id: ID!) {
                deleteEmailVerificatieCode(where: { id: $id }) { id }
            }
        `;
			await requestWithRetry(deleteCodeMutation, { id: codeId });
		}

		// Delete sessions
		for (const sessieId of createdSessionIds) {
			const deleteSessionMutation = `
            mutation ($id: ID!) {
                deleteSessie(where: { id: $id }) { id }
            }
        `;
			await requestWithRetry(deleteSessionMutation, { id: sessieId });
		}

		// Delete user
		if (createdUserId) {
			const deleteUserMutation = `
            mutation ($id: ID!) {
                deleteGebruiker(where: { id: $id }) { id }
            }
        `;
			await requestWithRetry(deleteUserMutation, { id: createdUserId });
		}
	});
});
