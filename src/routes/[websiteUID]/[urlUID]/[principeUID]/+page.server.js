import { error, redirect } from '@sveltejs/kit';
import {
	getUrl,
	getFirstCheck,
	addSuccessCriterionToCheck,
	removeSuccessCriterionFromCheck
} from '$lib/repositories/urlRepository.js';
import { getLevels, getToolboard } from '$lib/repositories/contentRepository.js';

export const load = async ({ params, locals }) => {
	const { websiteUID, urlUID, principeUID } = params;
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}

	const url = await getUrl(urlUID);

	if (!url || url.website?.slug !== websiteUID) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const toolboardData = await getToolboard({ urlSlug: urlUID, principeSlug: principeUID });
	const levels = await getLevels();
	const levelsData = { niveaus: levels };

	if (toolboardData.principe === null) {
		throw error(404, {
			message: 'Principe bestaat niet'
		});
	}

	return {
		toolboardData,
		urlData: { url },
		levelsData: levelsData
	};
};

export const actions = {
	updateChecklist: async ({ request, params }) => {
		const { websiteUID, urlUID, principeUID } = params;
		const toolboardData = await getToolboard({ urlSlug: urlUID, principeSlug: principeUID });
		const formData = await request.formData();
		const checkedSuccesscriteria = formData.getAll('check'); // Array with Successcriteria ID's of the checked inputs of the form on the opened page
		const principleIndex = formData.get('principe'); // Principe index (1, 2, 3, 4) of the form on the opened page
		const level = formData.get('niveau'); // Niveau (A, AA or AAA) of the form on the opened page

		// Successcriteria with the principe index (1, 2, 3, 4) and niveau (A, AA, AAA) of the form on the opened page that where already checked and stored in the database
		const currentlyStoredCheckedSuccesscriteria = toolboardData.url.checks[0]
			? toolboardData.url.checks[0].successcriteria.filter((succescriterium) => {
					return succescriterium.level == level && succescriterium.index[0] == principleIndex;
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
				const checkId = await getCheckId();
				if (!checkId) {
					return { success: false };
				}

				const result = await addSuccessCriterionToCheck({
					websiteSlug: websiteUID,
					urlSlug: urlUID,
					checkId,
					successCriterionId: succescriteriumId
				});

				return {
					addCheckId: result?.id ?? null,
					success: Boolean(result)
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
				const checkId = await getCheckId();
				if (!checkId) {
					return { success: false };
				}

				const result = await removeSuccessCriterionFromCheck({
					websiteSlug: websiteUID,
					urlSlug: urlUID,
					checkId,
					successCriterionId: succescriteriumId
				});

				return {
					deletedCheckId: result?.id ?? null,
					success: Boolean(result)
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
				const checkId = await getFirstCheck({ websiteSlug: websiteUID, urlSlug: urlUID });
				return checkId;
			} catch (error) {
				return null;
			}
		}

		return { success: true };
	}
};
