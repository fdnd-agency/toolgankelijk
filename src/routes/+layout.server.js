import { gql } from 'graphql-request'
import { hygraph } from '$lib/utils/hygraph.js'
import getQueryPartner from '$lib/queries/partner';
import getQueryWebsite from '$lib/queries/website';

/**
 * Asynchronously loads partner and website information using GraphQL queries.
 *
 * This function constructs two GraphQL queries using helper functions: one for fetching partner data and another for website data based on the provided website unique identifier. It then sends these queries via the hygraph GraphQL client and returns both results in an object.
 *
 * Note: The function does not include explicit error handling; any errors during the fetch operations will result in rejected promises.
 *
 * @param {Object} context - The context object.
 * @param {Object} context.params - The parameters object.
 * @param {string} context.params.websiteUID - The unique identifier for the website.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   - partnersData: The fetched partner data.
 *   - websitesData: The fetched website data.
 *
 * @example
 * load({ params: { websiteUID: 'abc123' } })
 *   .then(({ partnersData, websitesData }) => {
 *     console.log('Partner Data:', partnersData);
 *     console.log('Website Data:', websitesData);
 *   })
 *   .catch(error => {
 *     console.error('Error loading data:', error);
 *   });
 */
export async function load({ params }) {
	let { websiteUID } = params
	const queryPartner = getQueryPartner(gql);
	const queryWebsite = getQueryWebsite(gql, websiteUID);
	const partnersData = await hygraph.request(queryPartner);
	const websitesData = await hygraph.request(queryWebsite);

	return {
		partnersData,
		websitesData
	};
}
