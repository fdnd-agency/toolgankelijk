import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// The mocks must be before imports that use these modules to ensure Vitest replaces them first.
vi.mock('$lib/server/email-verification', () => ({
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
						})[key]
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
            gebruiker: toolgankelijk_user(filter: { email: { _eq: $email } }, limit: 1) {
                id
                sessions {
                    id
                }
            }
        }
    `;
		const userData = await requestWithRetry(userQuery, { email: uniqueEmail });
		const createdUser = userData.gebruiker?.[0];
		const createdUserId = createdUser?.id;
		const createdSessionIds = createdUser?.sessions?.map((s) => s.id) ?? [];

		// Delete sessions
		for (const sessieId of createdSessionIds) {
			const deleteSessionMutation = `
				mutation ($id: ID!) {
					deleteSession: delete_toolgankelijk_session_item(id: $id) { id }
				}
			`;
			await requestWithRetry(deleteSessionMutation, { id: sessieId });
		}

		// Delete user
		if (createdUserId) {
			const deleteUserMutation = `
				mutation ($id: ID!) {
					deleteUser: delete_toolgankelijk_user_item(id: $id) { id }
				}
			`;
			await requestWithRetry(deleteUserMutation, { id: createdUserId });
		}
	});
});
