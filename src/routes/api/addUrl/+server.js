import { urlRepository } from '$lib/server/index.js';
import { createSSEJobResponse, pushSSEUpdate } from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';

export async function POST({ request }) {
	const formData = await request.formData();
	const name = formData.get('name');
	const slug = name.toLowerCase();
	const urlLink = formData.get('url');
	const websiteSlug = formData.get('slug');

	return createSSEJobResponse(request, async (session) => {
		try {
			pushSSEUpdate(session, { status: 'Toevoegen gestart', type: 'done' });
			await delay(500);

			const directusCall = await urlRepository.addUrl({
				urlSlug: slug,
				urlLink,
				websiteSlug,
				urlName: name
			});
			if (!directusCall) {
				pushSSEUpdate(session, { status: 'Url kon niet worden opgeslagen.', type: 'error' });
				await delay(500);
				return;
			}
			await urlRepository.createEmptyCheckForUrl({ websiteSlug, urlSlug: slug });

			pushSSEUpdate(session, {
				status: `${name} is toegevoegd.`,
				type: 'done',
				response: directusCall
			});
			await delay(500);
		} catch (error) {
			pushSSEUpdate(session, {
				status: error instanceof Error ? error.message : String(error),
				type: 'error'
			});
		}
	});
}
