import { urlRepository } from '$lib/server/index.js';
import { SSEService } from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';

export async function POST({ request }) {
	const formData = await request.formData();
	const name = formData.get('name');
	const slug = name.toLowerCase();
	const urlLink = formData.get('url');
	const websiteSlug = formData.get('slug');

	return SSEService.createSseResponse(request, async (session) => {
		try {
			SSEService.push(session, { status: 'Toevoegen gestart', type: 'done' });
			await delay(500);

			const directusCall = await urlRepository.addUrl({
				urlSlug: slug,
				urlLink,
				websiteSlug,
				urlName: name
			});
			if (!directusCall) {
				SSEService.pushError(session, undefined, 'Url kon niet worden opgeslagen.');
				await delay(500);
				return;
			}
			await urlRepository.createEmptyCheckForUrl({ websiteSlug, urlSlug: slug });

			SSEService.push(session, {
				status: `${name} is toegevoegd.`,
				type: 'done',
				response: directusCall
			});
			await delay(500);
		} catch (error) {
			SSEService.pushError(session, error, 'Er is een fout opgetreden bij het toevoegen van de URL.');
		}
	});
}
