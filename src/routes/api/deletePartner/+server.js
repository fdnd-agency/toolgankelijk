import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryDeletePartner from '$lib/queries/deletePartner';
import getQueryDeleteUrl from '$lib/queries/deleteUrl';
import getQueryPartnerUrls from '$lib/queries/partnerUrls';

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST({ request }) {
  console.log("deletePartner gestart");
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
      const sendUpdate = async msg => controller.enqueue(enc.encode(`data: ${JSON.stringify(msg)}\n\n`));

      (async () => {
        try {
          await sendUpdate({ status: 'Partner verwijderen gestart', type: 'info' });

          // 1. Verzamel alle urls van de partner
          let allUrls = [];
          let skip = 0;
          const batchSize = 100;
          while (true) {
            let queryPartnerUrls = getQueryPartnerUrls(gql, id, skip, batchSize);
            const { urls } = await hygraph.request(queryPartnerUrls);
            if (!urls || urls.length === 0) break;
            allUrls.push(...urls);
            skip += batchSize;
            await delay(150);
          }
          await sendUpdate({ status: `Aantal urls gevonden: ${allUrls.length}`, type: 'info' });

          // 2. Verwijder alle urls
          for (let i = 0; i < allUrls.length; i++) {
            const link = allUrls[i];
            let queryDeleteUrls = getQueryDeleteUrl(gql, link.id);
            try {
              await sendUpdate({ status: `Verwijderen url ${i + 1}/${allUrls.length}`, type: 'info' });
              await hygraph.request(queryDeleteUrls);
            } catch (error) {
              await sendUpdate({ status: `Fout bij verwijderen url ${link.id}: ${error.message}`, type: 'error' });
            }
            await delay(150);
          }
          await sendUpdate({ status: 'Alle urls verwijderd', type: 'done' });

          // 3. Verwijder de partner
          let queryDelete = getQueryDeletePartner(gql, id);
          const deleteResponse = await hygraph.request(queryDelete);
          await sendUpdate({ status: 'Partner verwijderd', type: 'done', response: deleteResponse });

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