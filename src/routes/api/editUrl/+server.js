import { urlRepository } from '$lib/server/index.js';
import { SSEService } from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';

export async function POST({ request }) {
	const formData = await request.formData();
	const id = formData.get('id');
	const name = formData.get('name');
	const slug = formData.get('slug');
	const url = formData.get('url');

	return SSEService.createSseResponse(request, async (session) => {
		try {
			SSEService.push(session, { status: 'Bewerken gestart', type: 'done' });
			await delay(500);

			const response = await urlRepository.updateUrl({ id, slug, url, name });
			if (!response) {
				SSEService.push(session, { status: 'Url kon niet worden bijgewerkt', type: 'error' });
				await delay(500);
				return;
			}

			SSEService.push(session, { status: 'Url succesvol bijgewerkt', type: 'done', response });
			await delay(500);
		} catch (error) {
			SSEService.push(session, {
				status: error instanceof Error ? error.message : String(error),
				type: 'error'
			});
		}
	});
}
