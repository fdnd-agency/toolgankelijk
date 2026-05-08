import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { deleteItem, readItems } from '@directus/sdk';

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
import { directusClient } from '../../src/lib/utils/directus.js';

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
		const users = await directusClient.request(
			readItems('toolgankelijk_user', {
				filter: { email: { _eq: uniqueEmail } },
				limit: 1,
				fields: ['id', { sessions: ['id'] }]
			})
		);
		const createdUser = users?.[0];
		const createdUserId = createdUser?.id;
		const createdSessionIds = createdUser?.sessions?.map((s) => s.id) ?? [];

		for (const sessieId of createdSessionIds) {
			await directusClient.request(deleteItem('toolgankelijk_session', sessieId));
		}

		if (createdUserId) {
			await directusClient.request(deleteItem('toolgankelijk_user', createdUserId));
		}
	});
});
