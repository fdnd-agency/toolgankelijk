import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryDeleteUrl from '$lib/queries/deleteUrl';
import getQueryDeleteChecks from '$lib/queries/deleteChecks';

// Delay helper
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST({ request }) {
	const formData = await request.formData();
	const id = formData.get('id');

	const stream = new ReadableStream({
		start(controller) {
			const enc = new TextEncoder();
			let closed = false;
			const safeClose = () => {
				if (!closed) {
					try {
						controller.close();
					} catch (error) {
						console.error('Error closing stream:', error);
					}
					closed = true;
				}
			};
			const sendUpdate = async (msg) =>
				controller.enqueue(enc.encode(`data: ${JSON.stringify(msg)}\n\n`));

			(async () => {
				try {
					await sendUpdate({ status: 'Verwijderen gestart', type: 'done' });
					await delay(500);

					const queryDeleteChecks = getQueryDeleteChecks(gql, id);
					await hygraph.request(queryDeleteChecks);
					await delay(200); // Add delay
					await sendUpdate({ status: 'Checks succesvol verwijderd', type: 'done' });

					let query = getQueryDeleteUrl(gql, id);
					const response = await hygraph.request(query);

					await sendUpdate({ status: 'Url succesvol verwijderd', type: 'done', response });
					await delay(500);
				} catch (err) {
					await sendUpdate({ status: err.message, type: 'error' });
				} finally {
					safeClose();
				}
			})();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
			'Transfer-Encoding': 'chunked'
		}
	});
}
