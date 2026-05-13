import { urlRepository } from '$lib/server/index.js';
import { createSSEJobResponse, pushSSEUpdate } from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';

export async function POST({ request }) {
	const formData = await request.formData();
	const id = formData.get('id');
	const name = formData.get('name');
	const slug = formData.get('slug');
	const url = formData.get('url');

	return createSSEJobResponse(request, async (session) => {
		try {
			pushSSEUpdate(session, { status: 'Bewerken gestart', type: 'done' });
			await delay(500);

			const response = await urlRepository.updateUrl({ id, slug, url, name });
			if (!response) {
				pushSSEUpdate(session, { status: 'Url kon niet worden bijgewerkt', type: 'error' });
				await delay(500);
				return;
			}

			pushSSEUpdate(session, { status: 'Url succesvol bijgewerkt', type: 'done', response });
			await delay(500);
		} catch (error) {
			pushSSEUpdate(session, {
				status: error instanceof Error ? error.message : String(error),
				type: 'error'
			});
		}
	});
}
