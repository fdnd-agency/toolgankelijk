import { partnerRepository, urlRepository } from '$lib/server/index.js';
import { SSEService } from '$lib/server/SSE.js';
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
	const id = form.get('id');
	const name = form.get('name');
	const slug = name.toLowerCase();
	const rawUrl = form.get('url');
	const toggle = form.get('sitemap') === 'on';
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

	return SSEService.createSseResponse(request, async (session) => {
		const pushProgressUpdateToClient = async (clientUpdatePayload) => {
			try {
				if (session.isConnected) SSEService.push(session, clientUpdatePayload);
			} catch {}
		};

		try {
			await pushProgressUpdateToClient({ status: 'Partner bijwerken gestart', type: 'done' });
			await delay(500);

			let url = rawUrl;
			let urls = [];
			if (toggle) {
				url = await formatUrl(rawUrl, pushProgressUpdateToClient);
				const promises = getSitemapPromises(url, sitemapPaths, pushProgressUpdateToClient);
				const sitemapUrls = await pickFirstSitemap(promises, pushProgressUpdateToClient);

				urls =
					sitemapUrls.length > 0 ? sitemapUrls : await crawlUrls(url, pushProgressUpdateToClient);
			}

			await pushProgressUpdateToClient({ status: 'Partner data verwerkt.', type: 'done' });

			if (toggle && urls.length) {
				const { total } = await processUrls(urls, slug, pushProgressUpdateToClient);
				await partnerRepository.updatePartnerTotalUrls({ slug, totalUrls: total });
				await delay(500);
				for (const urlEntry of urls) {
					const path = new URL(urlEntry).pathname;
					const urlSlug = (slug + path).replace(/\//g, '-');
					const checkId = await urlRepository.getFirstCheck({ websiteSlug: slug, urlSlug });
					if (!checkId) {
						await urlRepository.createEmptyCheckForUrl({ websiteSlug: slug, urlSlug });
						await pushProgressUpdateToClient({
							status: `Check aangemaakt voor ${urlEntry}`,
							type: 'done'
						});
					} else {
						await pushProgressUpdateToClient({
							status: `Check bestaat al voor ${urlEntry}`,
							type: 'warning'
						});
					}
					await delay(1000);
				}
				await pushProgressUpdateToClient({ status: 'Alle urls zijn toegevoegd.', type: 'done' });
			}
			await partnerRepository.updatePartnerById({ id, name, url, slug });
			await pushProgressUpdateToClient({ status: 'Partner bijgewerkt', type: 'done' });
		} catch (error) {
			SSEService.pushError(session, error);
		}
	});
}
