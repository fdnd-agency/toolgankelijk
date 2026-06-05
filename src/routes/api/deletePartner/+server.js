import { partnerRepository, urlRepository } from '$lib/server/index.js';
import { SSEService } from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';

export async function POST({ request }) {
	const formData = await request.formData();
	const id = formData.get('id');

	return SSEService.createSseResponse(request, async (session) => {
		try {
			SSEService.push(session, { status: 'Partner verwijderen gestart', type: 'done' });

			// 1. Verzamel alle urls van de partner
			const allUrls = await urlRepository.getAllPartnerUrls(id);
			SSEService.push(session, {
				status: `Aantal urls gevonden: ${allUrls.length}`,
				type: 'done'
			});

			for (let index = 0; index < allUrls.length; index++) {
				const link = allUrls[index];
				try {
					SSEService.push(session, {
						status: `Verwijderen url ${index + 1}/${allUrls.length}`,
						type: 'done'
					});
					await urlRepository.deleteUrl(link.id);
				} catch (error) {
					SSEService.pushError(session, error, `Fout bij verwijderen url ${link.id}`);
				}
				await delay(150);
			}
			SSEService.push(session, { status: 'Alle urls verwijderd.', type: 'done' });

			const deleteResponse = await partnerRepository.deletePartnerById(id);
			SSEService.push(session, {
				status: 'Partner verwijderd',
				type: 'done',
				response: deleteResponse
			});
		} catch (error) {
			SSEService.pushError(session, error);
		}
	});
}
