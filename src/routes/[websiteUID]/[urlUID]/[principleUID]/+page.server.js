import { error, redirect } from '@sveltejs/kit';
import { contentRepository, urlRepository } from '$lib/server/index.js';

export const load = async ({ params, locals }) => {
	const { websiteUID, urlUID, principleUID } = params;
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}

	const url = await urlRepository.getUrl(urlUID);

	if (!url || url.website?.slug !== websiteUID) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const toolboardData = await contentRepository.getToolboard({
		urlSlug: urlUID,
		principleSlug: principleUID
	});
	const levels = await contentRepository.getLevels();
	const levelsData = { levels: levels };

	if (toolboardData.principle === null) {
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
		//FIXME: currently doesn't work
		const { websiteUID, urlUID, principleUID } = params;
		const toolboardData = await contentRepository.getToolboard({
			urlSlug: urlUID,
			principleSlug: principleUID
		});
		const formData = await request.formData();
		const checkedSuccesscriteria = formData.getAll('check'); // Array with Successcriteria ID's of the checked inputs of the form on the opened page
		const principleIndex = formData.get('principe'); // Principe index (1, 2, 3, 4) of the form on the opened page
		const level = formData.get('niveau'); // Niveau (A, AA or AAA) of the form on the opened page

		// Successcriteria with the principe index (1, 2, 3, 4) and niveau (A, AA, AAA) of the form on the opened page that where already checked and stored in the database
		const currentlyStoredCheckedSuccesscriteria = toolboardData.url.checks[0]
			? toolboardData.url.checks[0].successCriteria.filter((succescriterium) => {
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

				const result = await urlRepository.addSuccessCriterionToCheck({
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

				const result = await urlRepository.removeSuccessCriterionFromCheck({
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
				const checkId = await urlRepository.getFirstCheck({
					websiteSlug: websiteUID,
					urlSlug: urlUID
				});
				return checkId;
			} catch (error) {
				return null;
			}
		}

		return { success: true };
	}
};
