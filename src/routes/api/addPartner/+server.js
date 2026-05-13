import { partnerRepository, urlRepository } from '$lib/server/index.js';
import {
	createSSEJobResponse,
	pushSSEUpdate
} from '$lib/server/SSE.js';
import { delay } from '$lib/utils/delay.js';
import {
	formatUrl,
	getSitemapPromises,
	pickFirstSitemap,
	crawlUrls,
	processUrls
} from '$lib/utils/sitemap.js';

export async function POST({ request }) {
	const form = await request.formData();
	const name = form.get('name');
	const rawUrl = form.get('url');
	const toggle = form.get('sitemap') === 'on';
	const slug = name.toLowerCase().replace(/\s+/g, '-');
	const id = form.get('id') || null;
	const sitemapPaths = [
		'sitemap.xml',
		'sitemap_index.xml',
		'sitemap.php',
		'sitemap.txt',
		'sitemap-index.xml',
		'sitemap.xml.gz',
		'sitemap/',
		'sitemap/sitemap.xml',
		'sitemapindex.xml',
		'sitemap/index.xml',
		'sitemap1.xml',
		'robots.txt'
	];

	return createSSEJobResponse(request, async (session) => {
		const pushProgressUpdateToClient = async (clientUpdatePayload) => {
			try {
				if (session.isConnected) pushSSEUpdate(session, clientUpdatePayload);
			} catch {}
		};

		try {
			await pushProgressUpdateToClient({ status: 'Partner data verwerken', type: 'done' });

			let url = rawUrl;
			let urls = [];
			if (toggle) {
				url = await formatUrl(rawUrl, pushProgressUpdateToClient);
				const promises = getSitemapPromises(url, sitemapPaths, pushProgressUpdateToClient);
				const sitemapUrls = await pickFirstSitemap(promises, pushProgressUpdateToClient);

				urls =
					sitemapUrls.length > 0
						? sitemapUrls
						: await crawlUrls(url, pushProgressUpdateToClient);
			}

			if (!id) {
				await partnerRepository.createPartner({ name, url, slug, totalUrls: urls.length });
				await pushProgressUpdateToClient({ status: 'Partner toegevoegd', type: 'done' });
				await delay(1000);
			} else {
				await pushProgressUpdateToClient({ status: 'Partner bestaat al', type: 'warning' });
				await delay(1000);
			}

			if (toggle && urls.length) {
				const { total } = await processUrls(urls, slug, pushProgressUpdateToClient);
				await partnerRepository.updatePartnerTotalUrls({ slug, totalUrls: total });
				await delay(1000);
				for (const urlEntry of urls) {
					const path = new URL(urlEntry).pathname;
					const urlSlug = (slug + path).replace(/\//g, '-');
					await urlRepository.createEmptyCheckForUrl({ websiteSlug: slug, urlSlug });
				}

				await pushProgressUpdateToClient({ status: 'Partner bijgewerkt', type: 'done' });
				await delay(1000);
				await pushProgressUpdateToClient({ status: 'Alle urls zijn toegevoegd', type: 'done' });
			}
		} catch (error) {
			await pushProgressUpdateToClient({
				status: error instanceof Error ? error.message : String(error),
				type: 'error'
			});
		}
	});
}
