import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryUpdatePartner from '$lib/queries/updatePartner';
import getQueryUpdatePartnerUrls from '$lib/queries/updateUrlsPartner';
import {
  formatUrl,
  getSitemapPromises,
  pickFirstSitemap,
  crawlUrls,
  processUrls,
  delay
} from '$lib/utils/sitemap.js';

export async function POST({ request }) {
  const form = await request.formData();
  const id = form.get('id');
  const name = form.get('name');
  const slug = name.toLowerCase();
  const rawUrl = form.get('url');
  const toggle = form.get('sitemap') === 'on';
  const sitemapPaths = [
    'sitemap.xml', 'sitemap_index.xml', 'sitemap.php', 'sitemap.txt',
    'sitemap-index.xml', 'sitemap.xml.gz', 'sitemap/', 'sitemap/sitemap.xml',
    'sitemapindex.xml', 'sitemap/index.xml', 'sitemap1.xml', 'robots.txt'
  ];

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
      const sendUpdate = async msg =>
        controller.enqueue(enc.encode(`data: ${JSON.stringify(msg)}\n\n`));

      (async () => {
        try {
          await sendUpdate({ status: 'Partner bijwerken gestart', type: 'done' });
          await delay(500);

          let url = rawUrl;
          let urls = [];
          if (toggle) {
            url = await formatUrl(rawUrl, sendUpdate);
            const promises = getSitemapPromises(url, sitemapPaths, sendUpdate);
            const sitemapUrls = await pickFirstSitemap(promises, sendUpdate);

            urls = sitemapUrls.length > 0
              ? sitemapUrls
              : await crawlUrls(url, sendUpdate);
          }

          await sendUpdate({ status: 'Partner data verwerken', type: 'done' });

          // Process URLs if toggle is on
          if (toggle && urls.length) {
            const { total } = await processUrls(urls, slug, sendUpdate);
            const updateQuery = getQueryUpdatePartnerUrls(gql, slug, total);
            await hygraph.request(updateQuery);
            await sendUpdate({ status: 'Alle urls zijn toegevoegd', type: 'done' });
          }
          const updateQuery = getQueryUpdatePartner(gql, name, slug, url, id);
          await hygraph.request(updateQuery);
          await sendUpdate({ status: 'Partner bijgewerkt', type: 'done' });
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
