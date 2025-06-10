import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// The mock must be before imports to ensure Vitest replaces the module before it's loaded.
vi.mock('../../src/lib/server/email-verification.js', () => ({
	createEmailVerificationRequest: vi.fn().mockResolvedValue({
		id: 'mock-verification-id',
		userId: 'mock-user-id',
		code: 'mock-code',
		email: 'mock@email.com',
		expiresAt: new Date(Date.now() + 600000)
	}),
	sendVerificationEmail: vi.fn(),
	setEmailVerificationRequestCookie: vi.fn()
}));

import { actions } from '../../src/routes/register/+page.server.js';
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
