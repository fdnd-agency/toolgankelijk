//@ts-check
import { DIRECTUS_URL, DIRECTUS_STATIC_TOKEN } from '$env/static/private';
import { createDirectus, graphql, rest, staticToken } from '@directus/sdk';

const baseUrl = DIRECTUS_URL.replace(/\/+$/, '');
const token = DIRECTUS_STATIC_TOKEN;

if (!baseUrl || !token) {
	throw new Error('DIRECTUS_URL and DIRECTUS_STATIC_TOKEN must be set');
}

export const directusClient = createDirectus(baseUrl)
	.with(staticToken(token))
	.with(rest())
	.with(graphql());
