import { describe, it, expect } from 'vitest';
import { customEndpoint } from '@directus/sdk';
import { directusClient } from '$lib/utils/directus.js';

describe('$lib/utils/directus', () => {
	/** This test checks if the directus client is able to connect to the Directus API. */
	it('directus client is able to connect to the Directus API', async () => {
		const response = await directusClient.request(
			customEndpoint({
				path: '/users/me',
				method: 'GET'
			})
		);

		// `response.status` is the user account status, which is `active` if the token is valid.
		expect(response.status).toBe('active');
	});
});
