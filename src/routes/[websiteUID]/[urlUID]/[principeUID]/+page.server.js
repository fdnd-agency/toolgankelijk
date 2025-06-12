import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { error, redirect } from '@sveltejs/kit';
import getQueryUrl from '$lib/queries/url';
import getQueryToolboard from '$lib/queries/toolboard';
import firstCheck from '$lib/queries/firstCheck';
import addCheck from '$lib/queries/addCheck';
import deleteCheck from '$lib/queries/deleteCheck';
import getQueryNiveaus from '$lib/queries/niveaus.js';

export const load = async ({ params, locals }) => {
	const { websiteUID, urlUID, principeUID } = params;
	if (!locals?.sessie || !locals?.gebruiker) {
		throw redirect(302, '/login');
	}
	if (!locals.gebruiker.isEmailGeverifieerd) {
		throw redirect(302, '/verify-email');
	}
	const queryUrl = getQueryUrl(gql, urlUID);
	const queryToolboard = getQueryToolboard(gql, urlUID, principeUID);
	const urlData = await hygraph.request(queryUrl);
	const toolboardData = await hygraph.request(queryToolboard);
	const queryNiveaus = getQueryNiveaus(gql);
	const niveausData = await hygraph.request(queryNiveaus);

	if (urlData.url?.website.slug === websiteUID) {
		if (toolboardData.principe === null) {
			throw error(404, {
				message: 'Principe bestaat niet'
			});
		}
		return {
			toolboardData,
			urlData,
			niveausData
		};
	}
	throw error(404, {
		message: 'Not found'
	});
};

export const actions = {
	updateChecklist: async ({ request, params }) => {
		const { websiteUID, urlUID, principeUID } = params;
		const queryToolboard = getQueryToolboard(gql, urlUID, principeUID);
		const toolboardData = await hygraph.request(queryToolboard);
		const formData = await request.formData();
		const checkedSuccesscriteria = formData.getAll('check'); // Array with Succescriteria ID's of the checked inputs of the form on the opened page
		const principeIndex = formData.get('principe'); // Principe index (1, 2, 3, 4) of the form on the opened page
		const niveau = formData.get('niveau'); // Niveau (A, AA or AAA) of the form on the opened page

		// Successcriteria with the principe index (1, 2, 3, 4) and niveau (A, AA, AAA) of the form on the opened page that where already checked and stored in the database
		const currentlyStoredCheckedSuccesscriteria = toolboardData.url.checks[0]
			? toolboardData.url.checks[0].succescriteria.filter((succescriterium) => {
					return succescriterium.niveau == niveau && succescriterium.index[0] == principeIndex;
			  })
			: [];

		if (checkedSuccesscriteria.length) {
			// Add the checked successcriteria that are not already in the database to the database
			for (const checkedSuccesscriterium of checkedSuccesscriteria) {
				if (
					!currentlyStoredCheckedSuccesscriteria.find(
						(succescriterium) => succescriterium.id === checkedSuccesscriterium
					)
				) {
					await storeCheckedSuccesscriterium(checkedSuccesscriterium);
				}
			}

			// Delete the successcriteria form the database that are not checked anymore
			for (const successcriterium of currentlyStoredCheckedSuccesscriteria) {
				if (
					!checkedSuccesscriteria.find((succescriterium) => succescriterium === successcriterium.id)
				) {
					await deleteUncheckedSuccesscriterium(successcriterium.id);
				}
			}
		} else {
			if (!currentlyStoredCheckedSuccesscriteria == 0) {
				// Delete all successcriteria from the database that are not checked anymore
				for (const successcriterium of currentlyStoredCheckedSuccesscriteria) {
					await deleteUncheckedSuccesscriterium(successcriterium.id);
				}
			}
		}

		async function storeCheckedSuccesscriterium(succescriteriumId) {
			try {
				let checkId = (await getCheckId()).checkId;
				let addCheckQuery = addCheck(gql, websiteUID, urlUID, checkId, succescriteriumId);
				let addCheckId = await hygraph.request(addCheckQuery);

				return {
					addCheckId,
					success: true
				};
			} catch (error) {
				console.log(error);
				return {
					success: false
				};
			}
		}

		async function deleteUncheckedSuccesscriterium(succescriteriumId) {
			try {
				let checkId = (await getCheckId()).checkId;
				let deleteCheckQuery = deleteCheck(gql, websiteUID, urlUID, checkId, succescriteriumId);
				let deletedCheckId = await hygraph.request(deleteCheckQuery);

				return {
					deletedCheckId,
					success: true
				};
			} catch (error) {
				console.log(error);
				return {
					success: false
				};
			}
		}

		async function getCheckId() {
			try {
				let getCheckIdQuery = firstCheck(gql, websiteUID, urlUID);
				let getCheckIdResponse = await hygraph.request(getCheckIdQuery);
				let checkId = getCheckIdResponse.website.urls[0].checks[0].id;

				return {
					checkId,
					success: true
				};
			} catch (error) {
				return {
					success: false
				};
			}
		}

		return { success: true };
	}
};
