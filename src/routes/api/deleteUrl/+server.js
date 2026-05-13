import { urlRepository } from '$lib/server/index.js';
import { createSSEJobResponse, pushSSEUpdate } from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';

export async function POST({ request }) {
	const formData = await request.formData();
	const id = formData.get('id');

	return createSSEJobResponse(request, async (session) => {
		try {
			pushSSEUpdate(session, { status: 'Verwijderen gestart', type: 'done' });
			await delay(500);

			const response = await urlRepository.deleteUrlWithChecks(id);

			pushSSEUpdate(session, { status: 'Url succesvol verwijderd', type: 'done', response });
			await delay(500);
		} catch (error) {
			pushSSEUpdate(session, {
				status: error instanceof Error ? error.message : String(error),
				type: 'error'
			});
		}
	});
}
