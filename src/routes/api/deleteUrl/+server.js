import { urlRepository } from '$lib/server/index.js';
import { SSEService } from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';

export async function POST({ request }) {
	const formData = await request.formData();
	const id = formData.get('id');

	return SSEService.createSseResponse(request, async (session) => {
		try {
			SSEService.push(session, { status: 'Verwijderen gestart', type: 'done' });
			await delay(500);

			const response = await urlRepository.deleteUrlWithChecks(id);

			SSEService.push(session, { status: 'Url succesvol verwijderd', type: 'done', response });
			await delay(500);
		} catch (error) {
			SSEService.pushError(session, error);
		}
	});
}
