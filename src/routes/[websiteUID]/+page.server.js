import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { redirect } from '@sveltejs/kit';
import getQueryAddUrl from '$lib/queries/addUrl';
import getQueryWebsite from '$lib/queries/website';
import getQueryDeleteUrl from '$lib/queries/deleteUrl';
import getQueryUpdateUrl from '$lib/queries/updateUrl';
import createEmptyCheck from '$lib/queries/addEmptyCheck';
import getQueryDeleteChecks from '$lib/queries/deleteChecks';
import getQueryTestIdsByUrl from '$lib/queries/getTestIdsByUrl';
import getQueryTestNodeIdsByTest from '$lib/queries/getTestNodeIdsByTest';
import getQueryDeleteTestNode from '$lib/queries/deleteTestNode';
import getQueryDeleteTest from '$lib/queries/deleteTest';
import getQueryWebsite from '$lib/queries/website';

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function load(event) {
	const { params, url, locals } = event;
	const { websiteUID } = params;
	if (locals.sessie === null || locals.gebruiker === null) {
		throw redirect(302, '/login');
	}
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');
	const query = getQueryWebsite(gql, websiteUID, first, skip);
	const data = await hygraph.request(query);
	await delay(150);

	return {
		websites: data,
		first,
		skip
	};
}

export const actions = {
	deletePost: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		function delay(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}

		console.log(`Start deleting URL with id: ${id}`);

		// Delete associated TestNodes and Tests
		const testIds = await (async () => {
			const query = getQueryTestIdsByUrl(gql, id);
			const { url } = await hygraph.request(query);
			console.log(`Found test IDs for URL ${id}:`, url?.tests?.map((t) => t.id) || []);
			return url?.tests?.map((t) => t.id) || [];
		})();

		for (const testId of testIds) {
			console.log(`Deleting testNodes for testId: ${testId}`);
			const testNodeIds = await (async () => {
				const query = getQueryTestNodeIdsByTest(gql, testId);
				const { test } = await hygraph.request(query);
				console.log(
					`Found testNode IDs for test ${testId}:`,
					test?.testNodes?.map((n) => n.id) || []
				);
				return test?.testNodes?.map((n) => n.id) || [];
			})();

			for (const testNodeId of testNodeIds) {
				console.log(`Deleting testNode with id: ${testNodeId}`);
				const queryDeleteTestNode = getQueryDeleteTestNode(gql, testNodeId);
				await hygraph.request(queryDeleteTestNode);
				await delay(200); // Add delay
			}

			console.log(`Deleting test with id: ${testId}`);
			const queryDeleteTest = getQueryDeleteTest(gql, testId);
			await hygraph.request(queryDeleteTest);
			await delay(200); // Add delay
		}

		console.log(`Deleting checks for URL id: ${id}`);
		const queryDeleteChecks = getQueryDeleteChecks(gql, id);
		await hygraph.request(queryDeleteChecks);
		await delay(200); // Add delay

		console.log(`Deleting URL with id: ${id}`);
		let query = getQueryDeleteUrl(gql, id);
		const result = await hygraph.request(query);

		console.log(`Finished deleting URL with id: ${id}`);
		return result;
	},
	editPost: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const slug = formData.get('slug');
		const url = formData.get('url');
		let query = getQueryUpdateUrl(gql, slug, url, id);
		return await hygraph.request(query);
	},
	addUrl: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name').toLowerCase();
		const formUrl = formData.get('url');
		const formSlug = formData.get('slug');

		try {
			let query = getQueryAddUrl(gql, name, formUrl, formSlug);
			let hygraphCall = await hygraph.request(query);
			let createEmptyCheckEntry = createEmptyCheck(gql, formSlug, name);
			await hygraph.request(createEmptyCheckEntry);

			return {
				hygraphCall,
				success: true,
				message: name + ' is toegevoegd.'
			};
		} catch (error) {
			return {
				message: 'Er ging wat mis, probeer het opnieuw.',
				success: false
			};
		}
	}
};
