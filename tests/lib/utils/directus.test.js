import { describe, it, expect } from 'vitest';
import { customEndpoint } from '@directus/sdk';
import { directusClient } from '$lib/utils/directus.js';

describe('$lib/utils/directus', () => {
	it('Test Directus client connection', async () => {
		const response = await directusClient.request(
			customEndpoint({
				path: '/users/me',
				method: 'GET'
			})
		);

		// We only need to check if the response is 200, invalid tokens return 401.
		expect(response.status).toBe(200);
	});
});
