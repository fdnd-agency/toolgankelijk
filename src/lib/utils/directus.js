import { DIRECTUS_URL, VITE_DIRECTUS_KEY } from '$env/static/private';
import { GraphQLClient } from 'graphql-request';

export const directus = new GraphQLClient(DIRECTUS_URL, {
	headers: {
		Authorization: `Bearer ${VITE_DIRECTUS_KEY}`
	}
});
