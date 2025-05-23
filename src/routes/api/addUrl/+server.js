import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryAddUrl from '$lib/queries/addUrl';

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST({ request }) {
  const formData = await request.formData();
  const name = formData.get('name');
  const slug = name.toLowerCase();
  const urlLink = formData.get('url');
  const websiteSlug = formData.get('slug');

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
          await sendUpdate({ status: 'Toevoegen gestart', type: 'done' });
          await delay(500);

          let query = getQueryAddUrl(gql, slug, urlLink, websiteSlug, name);
          let hygraphCall = await hygraph.request(query);

          await sendUpdate({ status: `${name} is toegevoegd.`, type: 'done', response: hygraphCall });
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