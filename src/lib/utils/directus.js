import { DIRECTUS_URL, VITE_DIRECTUS_KEY } from '$env/static/private';
import { GraphQLClient } from 'graphql-request';

const DIRECTUS_GRAPHQL_URL = `${DIRECTUS_URL.replace(/\/+$/, '')}/graphql`;

export const directus = new GraphQLClient(DIRECTUS_GRAPHQL_URL, {
	headers: {
		Authorization: `Bearer ${VITE_DIRECTUS_KEY}`
	}
});
