import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryUpdatePartner from '$lib/queries/updatePartner';

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST({ request }) {
  console.log("editPartner gestart");
  const formData = await request.formData();
  const id = formData.get('id');
  const name = formData.get('name');
  const slug = formData.get('slug');
  const url = formData.get('url');

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
          await sendUpdate({ status: 'Partner bijwerken gestart', type: 'info' });
          await delay(500);

          let query = getQueryUpdatePartner(gql, name, slug, url, id);
          const response = await hygraph.request(query);

          await sendUpdate({ status: 'Partner succesvol bijgewerkt', type: 'done', response });
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