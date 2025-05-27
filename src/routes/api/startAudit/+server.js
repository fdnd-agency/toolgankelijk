// Delay helper
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST({ request }) {
	const formData = await request.formData();
	const urls = JSON.parse(formData.get('urls'));
	const slug = formData.get('slug');

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
					await sendUpdate({ status: 'Audit gestart', type: 'done' });
					await delay(500);
					await sendUpdate({ status: 'Urls worden gecheckt, dit duurt even', type: 'done' });
					await delay(500);

                    if (urls.length === 0) {
                        await sendUpdate({ status: 'Geen URL\'s om te auditen', type: 'error' });
                        await delay(2000);
                        safeClose();
                        return;
                    }

                    const response = await fetch('http://localhost:5174/api/specifiedUrls', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ urls: urls, slug })
                    });

                    if (!response.ok) {
                        await sendUpdate({ status: 'Fout bij het ophalen van de response', type: 'error' });
                        await delay(2000);
                        safeClose();
                        return;
                    }

					await sendUpdate({ status: 'Urls succesvol bijgewerkt', type: 'done', response });
					await delay(500);
                    await sendUpdate({ status: 'Audit afgerond', type: 'done' });
                    await delay(2000);
				} catch (err) {
					await sendUpdate({ status: `Fout bij verbinden met audit server: ${err.message}`, type: 'error' });
                    await delay(2000);
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
