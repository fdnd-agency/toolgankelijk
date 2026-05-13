import { partnerRepository, urlRepository } from '$lib/server/index.js';
import { createSSEJobResponse, pushSSEUpdate } from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';

export async function POST({ request }) {
	const formData = await request.formData();
	const id = formData.get('id');

	return createSSEJobResponse(request, async (session) => {
		try {
			pushSSEUpdate(session, { status: 'Partner verwijderen gestart', type: 'done' });

			let allUrls = [];
			let skip = 0;
			const batchSize = 100;
			while (true) {
				const urls = await partnerRepository.getPartnerUrls(id, { skip, first: batchSize });
				if (!urls || urls.length === 0) break;
				allUrls.push(...urls);
				skip += batchSize;
				await delay(150);
			}
			pushSSEUpdate(session, {
				status: `Aantal urls gevonden: ${allUrls.length}`,
				type: 'done'
			});

			for (let index = 0; index < allUrls.length; index++) {
				const link = allUrls[index];
				try {
					pushSSEUpdate(session, {
						status: `Verwijderen url ${index + 1}/${allUrls.length}`,
						type: 'done'
					});
					await urlRepository.deleteUrlWithChecks(link.id);
				} catch (error) {
					pushSSEUpdate(session, {
						status: `Fout bij verwijderen url ${link.id}: ${error instanceof Error ? error.message : String(error)}`,
						type: 'error'
					});
				}
				await delay(150);
			}
			pushSSEUpdate(session, { status: 'Alle urls verwijderd', type: 'done' });

			const deleteResponse = await partnerRepository.deletePartnerById(id);
			pushSSEUpdate(session, {
				status: 'Partner verwijderd',
				type: 'done',
				response: deleteResponse
			});
		} catch (error) {
			pushSSEUpdate(session, {
				status: error instanceof Error ? error.message : String(error),
				type: 'error'
			});
		}
	});
}
