import { error } from '@sveltejs/kit';
import { contentRepository, urlRepository } from '$lib/server/index.js';
import { requireAuthenticatedVerifiedUser } from '$lib/server/auth.js';

/**
 * Derives the currently stored checklist selection for a specific WCAG level.
 *
 * @param {object} toolboardData Full toolboard payload for the current URL/principle.
 * @param {string[]} checkedSuccesscriteria IDs currently checked in the submitted form.
 * @param {FormDataEntryValue | null} level Selected WCAG level (`A`, `AA`, or `AAA`).
 * @returns {{ currentlyStoredForLevel: string[] }} IDs already persisted for the selected level.
 */
function getChecklistSelectionState(toolboardData, checkedSuccesscriteria, level) {
	const levelCriteriaIds = new Set(
		(toolboardData.principle?.guidelines ?? [])
			.flatMap((guideline) => guideline.successCriteria ?? [])
			.filter((successCriteria) => successCriteria.level === level)
			.map((successCriteria) => String(successCriteria.id))
	);
	const currentlyStoredCheckedIds = new Set(
		(toolboardData.url?.checks?.[0]?.successCriteria ?? []).map((successCriteria) =>
			String(successCriteria.id)
		)
	);
	const currentlyStoredForLevel = [...currentlyStoredCheckedIds].filter((id) =>
		levelCriteriaIds.has(id)
	);
	return { currentlyStoredForLevel };
}

/**
 * Synchronizes checklist relation rows for the active level by adding missing checks
 * and removing unchecked ones.
 *
 * @param {object} input
 * @param {string[]} input.checkedSuccesscriteria Checked success-criteria IDs from the form.
 * @param {string[]} input.currentlyStoredForLevel IDs currently stored for this level.
 * @param {(successcriteriumId: string) => Promise<unknown>} input.storeCheckedSuccesscriterium
 * Persists a newly checked success criterion.
 * @param {(successcriteriumId: string) => Promise<unknown>} input.deleteUncheckedSuccesscriterium
 * Removes an unchecked success criterion.
 * @returns {Promise<void>}
 */
async function syncChecklistForLevel({
	checkedSuccesscriteria,
	currentlyStoredForLevel,
	storeCheckedSuccesscriterium,
	deleteUncheckedSuccesscriterium
}) {
	// Add newly checked items for the current level
	for (const checkedSuccesscriteriumId of checkedSuccesscriteria) {
		if (!currentlyStoredForLevel.includes(checkedSuccesscriteriumId)) {
			await storeCheckedSuccesscriterium(checkedSuccesscriteriumId);
		}
	}

	// Remove unchecked items that belong to the current level
	for (const storedSuccesscriteriumId of currentlyStoredForLevel) {
		if (!checkedSuccesscriteria.includes(storedSuccesscriteriumId)) {
			await deleteUncheckedSuccesscriterium(storedSuccesscriteriumId);
		}
	}
}

/**
 * Server load function for the principle toolboard page.
 *
 * Ensures the user is authenticated, validates URL ownership by website slug,
 * and returns toolboard + level data for rendering.
 *
 * @type {import('./$types').PageServerLoad}
 */
export const load = async ({ params, locals }) => {
	const { websiteUID, urlUID, principleUID } = params;
	requireAuthenticatedVerifiedUser(locals);

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
	/**
	 * Persists checklist selections for the current level by diffing submitted checks
	 * against currently stored checks in the first available check record.
	 *
	 * @type {import('./$types').Actions['updateChecklist']}
	 */
	updateChecklist: async ({ request, params }) => {
		const { websiteUID, urlUID, principleUID } = params;
		const toolboardData = await contentRepository.getToolboard({
			urlSlug: urlUID,
			principleSlug: principleUID
		});
		const formData = await request.formData();
		const checkedSuccesscriteria = formData.getAll('check').map((value) => String(value)); // Array with Successcriteria ID's of the checked inputs of the form on the opened page
		const level = formData.get('niveau'); // Niveau (A, AA or AAA) of the form on the opened page
		const { currentlyStoredForLevel } = getChecklistSelectionState(
			toolboardData,
			checkedSuccesscriteria,
			level
		);
		await syncChecklistForLevel({
			checkedSuccesscriteria,
			currentlyStoredForLevel,
			storeCheckedSuccesscriterium,
			deleteUncheckedSuccesscriterium
		});

		/**
		 * Stores a checked success criterion on the current URL check.
		 *
		 * @param {string} succescriteriumId Success criterion ID to store.
		 * @returns {Promise<{ addCheckId?: string | null; success: boolean }>}
		 */
		async function storeCheckedSuccesscriterium(succescriteriumId) {
			try {
				const checkId = await getCheckId();
				if (!checkId) {
					return { success: false };
				}

				const result = await urlRepository.addSuccessCriteriaToCheck({
					websiteSlug: websiteUID,
					urlSlug: urlUID,
					checkId,
					successCriteriaId: succescriteriumId
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

		/**
		 * Removes an unchecked success criterion from the current URL check.
		 *
		 * @param {string} succescriteriumId Success criterion ID to remove.
		 * @returns {Promise<{ deletedCheckId?: string | null; success: boolean }>}
		 */
		async function deleteUncheckedSuccesscriterium(succescriteriumId) {
			try {
				const checkId = await getCheckId();
				if (!checkId) {
					return { success: false };
				}

				const result = await urlRepository.removeSuccessCriteriaFromCheck({
					websiteSlug: websiteUID,
					urlSlug: urlUID,
					checkId,
					successCriteriaId: succescriteriumId
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

		/**
		 * Retrieves the first check ID linked to the current URL.
		 *
		 * @returns {Promise<string | null>} The check ID when present, otherwise `null`.
		 */
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
