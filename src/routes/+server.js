import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryAddPartner from '$lib/queries/addPartner';
import getQueryAddUrl from '$lib/queries/addUrl';
import getQueryUrl from '$lib/queries/url';
import getQueryUpdatePartnerUrls from '$lib/queries/updateUrlsPartner';
import Sitemapper from 'sitemapper';
import axios from 'axios';
import { parseHTML } from 'linkedom';

// Utility function to validate URLs
function isValidUrl(url) {
  return !url.includes('/document') && !url.includes('/documents');
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Ensure URL ends with '/'
async function formatUrl(rawUrl, sendUpdate) {
  const url = rawUrl.endsWith('/') ? rawUrl : rawUrl + '/';
  await sendUpdate({ status: 'Url verwerken', type: 'done' });
  await delay(1000);
  return url;
}

// Attempt to fetch sitemap URLs
function getSitemapPromises(baseUrl, sitemapPaths, sendUpdate) {
  return sitemapPaths.map(path =>
    (async () => {
      try {
        await sendUpdate({ status: `Sitemap checken in pad ${path}`, type: 'done'  });
        await delay(1000);
        const siteMap = new Sitemapper({ url: baseUrl + path, timeout: 15000 });
        const { sites } = await siteMap.fetch();
        return (sites || []).filter(isValidUrl);
      } catch (err) {
        await sendUpdate({ status: `Sitemap niet gevonden: ${path}`, type: 'error' });
        await delay(1000);
        return [];
      }
    })()
  );
}

// Pick the first non-empty sitemap result
async function pickFirstSitemap(promises, sendUpdate) {
  const results = await Promise.all(promises);
  for (const group of results) {
    if (group.length > 0) {
      await sendUpdate({ status: 'Sitemap gevonden', type: 'done' });
      await delay(1000);
      return group;
    }
  }
  return [];
}

// Crawl pages to extract links
async function crawlUrls(startUrl, sendUpdate) {
  await sendUpdate({ status: 'Sitemap niet gevonden, urls worden handmatig opgehaald', type: 'warning'  });
  await delay(1000);
  const visited = new Set();
  const toVisit = [startUrl];

  async function getLinksFromPage(pageUrl) {
    const res = await axios.get(pageUrl);
    const { document } = parseHTML(res.data);
    const links = Array.from(document.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter(href => href && !href.startsWith('#'))
      .map(href => new URL(href, pageUrl).href)
      .filter(h => h.startsWith(startUrl))
      .filter(isValidUrl);
    return [...new Set(links)];
  }

  while (toVisit.length) {
    const current = toVisit.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    await sendUpdate({ status: `Bezoek: ${current}`, type: 'done'  });
    await delay(1000);
    try {
      const found = await getLinksFromPage(current);
      for (const link of found) {
        if (!visited.has(link) && !toVisit.includes(link)) {
          toVisit.push(link);
        }
      }
    } catch (err) {
      await sendUpdate({ status: `Error: ${current}: ${err.message}`, type: 'error' });
      await delay(1000);
    }
  }

  await sendUpdate({ status: 'Gevonden urls', count: visited.size, type: 'done' });
  await delay(1000);
  return Array.from(visited);
}

// Add or skip partner
async function addPartner({ id, name, url, slug, count }, sendUpdate) {
  if (!id) {
    const query = getQueryAddPartner(gql, name, url, slug, count);
    await hygraph.request(query);
    await sendUpdate({ status: 'Partner toegevoegd', type: 'done' });
    await delay(1000);
  } else {
    await sendUpdate({ status: 'Partner bestaat al', type: 'warning' });
    await delay(1000);
  }
}

// Process individual URLs
async function processUrls(urls, slug, sendUpdate) {
  let total = urls.length;
  const failed = {};
  await sendUpdate({ status: 'Urls worden toegevoegd aan de database', type: 'done' });
  await delay(1000);

  for (let i = 1; i < urls.length; i++) {
    const link = urls[i];
    const path = new URL(link).pathname;
    let urlSlug = (slug + path).replace(/\//g, '-');
    await sendUpdate({ status: `Verwerk URL ${i + 1}/${urls.length}`, type: 'done' });
    await delay(1000);

    try {
      const checkQuery = getQueryUrl(gql, urlSlug);
      const checkRes = await hygraph.request(checkQuery);
      if (checkRes.url) {
        await sendUpdate({ status: `Url bestaat al: ${checkRes.url.slug}`, type: 'warning' });
        total--;
      } else {
        await sendUpdate({ status: `Voeg toe: ${link}`, type: 'done' });
        const addQuery = getQueryAddUrl(gql, urlSlug, link, slug, path);
        await hygraph.request(addQuery);
      }
    } catch (err) {
      failed[link] = err.message;
    }

    await delay(150);
  }

  return { total, failed };
}

// Update partner with final URL count
async function updatePartnerUrls(slug, count, sendUpdate) {
  const query = getQueryUpdatePartnerUrls(gql, slug, count);
  await hygraph.request(query);
  await sendUpdate({ status: 'Partner bijgewerkt', type: 'done' });
  await delay(1000);
}

// Main handler
export async function POST({ request }) {
  const form = await request.formData();
  const name = form.get('name');
  const rawUrl = form.get('url');
  const toggle = form.get('sitemap') === 'on';
  const slug = name.toLowerCase();
  const id = form.get('id') || null;
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
      const sendUpdate = async msg => controller.enqueue(enc.encode(`data: ${JSON.stringify(msg)}\n\n`));

      (async () => {
        try {
          await sendUpdate({ status: 'Partner data verwerken', type: 'done' });

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

          await addPartner({ id, name, url, slug, count: urls.length }, sendUpdate);

          if (toggle && urls.length) {
            const { total } = await processUrls(urls, slug, sendUpdate);
            await updatePartnerUrls(slug, total, sendUpdate);
            await sendUpdate({ status: 'Alle urls zijn toegevoegd', type: 'done' });
            await delay(1000);
          }
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
