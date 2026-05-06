import { DIRECTUS_URL, VITE_DIRECTUS_KEY } from '$env/static/private';
import { createDirectus, graphql, rest, staticToken } from '@directus/sdk';

const baseUrl = DIRECTUS_URL.replace(/\/+$/, '');
const token = VITE_DIRECTUS_KEY;

if (!baseUrl || !token) {
	throw new Error('DIRECTUS_URL and VITE_DIRECTUS_KEY must be set');
}

export const directusClient = createDirectus(baseUrl)
	.with(staticToken(token))
	.with(rest())
	.with(graphql());
