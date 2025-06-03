// src/lib/utils/sitemap.js
import Sitemapper from 'sitemapper';
import axios from 'axios';
import { parseHTML } from 'linkedom';
import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryUrl from '$lib/queries/url';
import getQueryAddUrl from '$lib/queries/addUrl';

export function isValidUrl(url) {
	return !url.includes('/document') && !url.includes('/documents');
}

export function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function formatUrl(rawUrl, sendUpdate) {
	const url = rawUrl.endsWith('/') ? rawUrl : rawUrl + '/';
	await sendUpdate({ status: 'Url verwerken', type: 'done' });
	await delay(250);
	return url;
}

export function getSitemapPromises(baseUrl, sitemapPaths, sendUpdate) {
	return sitemapPaths.map((path) =>
		(async () => {
			try {
				await sendUpdate({ status: `Sitemap checken in pad ${path}`, type: 'done' });
				await delay(250);
				const siteMap = new Sitemapper({ url: baseUrl + path, timeout: 15000 });
				const { sites } = await siteMap.fetch();
				return (sites || []).filter(isValidUrl);
			} catch (err) {
				await sendUpdate({ status: `Sitemap niet gevonden: ${path}`, type: 'error' });
				await delay(250);
				return [];
			}
		})()
	);
}

export async function pickFirstSitemap(promises, sendUpdate) {
	const results = await Promise.all(promises);
	for (const group of results) {
		if (group.length > 0) {
			await sendUpdate({ status: 'Sitemap gevonden', type: 'done' });
			await delay(250);
			return group;
		}
	}
	return [];
}

export async function crawlUrls(startUrl, sendUpdate) {
	await sendUpdate({
		status: 'Sitemap niet gevonden, urls worden handmatig opgehaald',
		type: 'warning'
	});
	await delay(250);
	const visited = new Set();
	const toVisit = [startUrl];

	async function getLinksFromPage(pageUrl) {
		const res = await axios.get(pageUrl);
		const { document } = parseHTML(res.data);
		const links = Array.from(document.querySelectorAll('a'))
			.map((a) => a.getAttribute('href'))
			.filter((href) => href && !href.startsWith('#'))
			.map((href) => new URL(href, pageUrl).href)
			.filter((h) => h.startsWith(startUrl))
			.filter(isValidUrl);
		return [...new Set(links)];
	}

	while (toVisit.length) {
		const current = toVisit.shift();
		if (visited.has(current)) continue;
		visited.add(current);
		await sendUpdate({ status: `Bezoek: ${current}`, type: 'done' });
		await delay(250);
		try {
			const found = await getLinksFromPage(current);
			for (const link of found) {
				if (!visited.has(link) && !toVisit.includes(link)) {
					toVisit.push(link);
				}
			}
		} catch (err) {
			await sendUpdate({ status: `Error: ${current}: ${err.message}`, type: 'error' });
			await delay(250);
		}
	}

	await sendUpdate({ status: 'Gevonden urls', count: visited.size, type: 'done' });
	await delay(250);
	return Array.from(visited);
}

export async function processUrls(urls, slug, sendUpdate) {
	let total = urls.length;
	const failed = {};
	await sendUpdate({ status: 'Urls worden toegevoegd aan de database', type: 'done' });
	await delay(250);

	for (let i = 1; i < urls.length; i++) {
		const link = urls[i];
		const path = new URL(link).pathname;
		let urlSlug = (slug + path).replace(/\//g, '-');
		await sendUpdate({ status: `Verwerk URL ${i + 1}/${urls.length}`, type: 'done', count: i + 1, total: urls.length });
		await delay(250);

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

		await delay(250);
	}

	return { total, failed };
}
