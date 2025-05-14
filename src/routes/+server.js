import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryAddPartner from '$lib/queries/addPartner';
import getQueryAddUrl from '$lib/queries/addUrl';
import getQueryUrl from '$lib/queries/url';
import getQueryUpdatePartnerUrls from '$lib/queries/updateUrlsPartner';
import Sitemapper from 'sitemapper';
import axios from 'axios';
import { parseHTML } from 'linkedom';


export async function POST({ request }) {
    const formData = await request.formData();
    const name = formData.get('name');
    let url = formData.get('url');
    let toggleSitemap = formData.get('sitemap') === "on";
    const slug = name.toLowerCase();
    const id = formData.get('id') || null;
    let urlArray = [];
    const sitemapArray = [
        "sitemap.xml", "sitemap_index.xml", "sitemap.php", "sitemap.txt",
        "sitemap-index.xml", "sitemap.xml.gz", "sitemap/", "sitemap/sitemap.xml",
        "sitemapindex.xml", "sitemap/index.xml", "sitemap1.xml", "robots.txt"];
    
    function isValidUrl(url) {
        return !url.includes('/document') && !url.includes('/documents');
    }

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

    async function sendUpdate(message) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
    }

    (async () => {
        try {
            // 1) Show start message
            await sendUpdate({ status: 'Partner data verwerken' });

            // 2) Sitemap / URL-extractie
            if (toggleSitemap) {
                // check if url ends with a /
                url = url.endsWith('/') ? url : url + '/';
                await sendUpdate({ status: 'Url verwerken' });

                // Create an array of promises for the sitemap checks
                const sitemapPromises = sitemapArray.map((sitemapPath) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            await sendUpdate({ status: `Sitemap zoeken in ${sitemapArray.length} paden` });
                            
                            const siteMap = new Sitemapper({
                                url: url + sitemapPath,
                                timeout: 15000,
                            });

                            const { sites } = await siteMap.fetch();
                            if (sites && sites.length > 0) {
                                resolve(sites.filter(isValidUrl)); // Return the found sites if the sitemap is valid
                            } else {
                                resolve([]); // Return an empty array if no sites found
                            }
                        } catch (error) {
                            reject(`Error with sitemap path: ${sitemapPath}, ${error}`);
                        }
                    });
                });

                // Wait for all the sitemap checks to finish
                try {
                    const sitemapResults = await Promise.all(sitemapPromises);

                    // Loop over the results and check which sitemap returned sites
                    for (let i = 0; i < sitemapResults.length; i++) {
                        const result = sitemapResults[i];
                        if (result.length > 0) {
                            await sendUpdate({ status: 'Sitemap gevonden' });
                            urlArray = result; // Set the found sitemap URLs
                            break; // Exit the loop as we found a valid sitemap
                        }
                    }

                    if (urlArray.length === 0) {
                        await sendUpdate({ status: 'Sitemap niet gevonden, urls worden handmatig opgehaald' });
                        // If no sitemap found, try to extract URLs from the page
                        try {
                            const visited = new Set();
                            const toVisit = [url];

                            async function getLinksFromPage(pageUrl) {
                                const res = await axios.get(pageUrl);
                                const { document } = parseHTML(res.data);

                                const links = [...document.querySelectorAll('a')]
                                    .map(a => a.getAttribute('href'))
                                    .filter(href => href && !href.startsWith('#'))
                                    .map(href => new URL(href, pageUrl).href)
                                    .filter(href => href.startsWith(url))
                                    .filter(isValidUrl);

                                return [...new Set(links)];
                            }

                            while (toVisit.length > 0) {
                                // fetch the next URL to visit
                                const currentUrl = toVisit.shift();

                                // if the URL is already visited, skip it
                                if (visited.has(currentUrl)) continue;
                                visited.add(currentUrl);

                                await sendUpdate({ status: `Bezoek: ${currentUrl}` });

                                // fetch the page and extract links
                                try {
                                    const foundLinks = await getLinksFromPage(currentUrl);
                                    for (const link of foundLinks) {
                                        // add the link to the visited set
                                        if (!visited.has(link) && !toVisit.includes(link)) {
                                            toVisit.push(link);
                                        }
                                    }
                                } catch (error) {
                                    await sendUpdate({ status: `Error: ${currentUrl}: ${error.message}` });
                                }
                            }

                            // remove duplicates and filter out external links
                            urlArray = Array.from(visited);
                            await sendUpdate({ status: 'Gevonden urls', count: urlArray.length });
                        } catch (error) {
                            await sendUpdate({ status: `Error: ${error.message}` });
                        }
                    }
                } catch (error) {
                    await sendUpdate({ status: `Error: ${error.message}` });
                }
    }

        // 4) Add data to hygraph
        try {
            if (!id) {
                let queryAddPartner = getQueryAddPartner(gql, name, url, slug, urlArray.length);
                await hygraph.request(queryAddPartner);
                await sendUpdate({ status: 'Partner toegevoegd' });
            }else {
                await sendUpdate({ status: 'Partner bestaat al' });
            }

            if (toggleSitemap) {
                async function delay(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                let totalUrls = urlArray.length;
                let failedUrls = {};
                await sendUpdate({ status: `Urls worden toegevoegd aan de database` });

                async function processUrls() {
                    for (let i = 1; i < urlArray.length; i++) {
                        // console.log(`url: ${i}`);
                        await sendUpdate({ status: `Verwerk URL ${i + 1}/${urlArray.length}` });
                        // save each link from the sitemap array
                        let link = urlArray[i];
                        // create an url object for the link saved
                        const urlObject = new URL(link);
                        // fetch only the path name from the link
                        const path = urlObject.pathname;

                        // replace all / with a - to make the slug work
                        let urlSlug = slug + path;
                        urlSlug = urlSlug.replace(/\//g, "-");

                        let queryAddUrls = getQueryAddUrl(gql, urlSlug, link, slug, path);
                        
                        try {
                            // fetch urls from hygraph to check if the url already exists
                            let queryUrlCheck = getQueryUrl(gql, urlSlug)
                            await hygraph.request(queryUrlCheck);

                            // check if the url already exists in hygraph
                            if (queryUrlCheck.url) {
                                await sendUpdate({ status: `Url bestaat al: ${urlCheck.url.slug}` });
                                totalUrls--;
                                await sendUpdate({ status: `Totale urls: ${totalUrls.length}` });
                            } else {
                                await sendUpdate({ status: `Voeg toe: ${link}` });
                                // add the url to hygraph
                                await hygraph.request(queryAddUrls);
                            }
                        } catch (error) {
                            // console.error(`Error adding ${link}: ${error.message}`);
                            failedUrls[link] = error.message; // Store the failed URL and error message
                        }

                        // delay of 0.15 seconds
                        await delay(150);
                    }
                }

                await processUrls();
                // update url length again in case some urls failed to add
                try {
                    let queryUpdatePartnerUrls = getQueryUpdatePartnerUrls(gql, slug, totalUrls);
                    await hygraph.request(queryUpdatePartnerUrls);
                    await sendUpdate({ status: 'Partner bijgewerkt' });
                }
                catch (error) {
                    await sendUpdate({ status: `Error: ${error.message}` });
                }

                await sendUpdate({ status: 'Alle urls zijn toegevoegd' });
            }
        } catch (error) {
            await sendUpdate({ status: `Error: ${error.message}` });
        }
    } catch (err) {
        await sendUpdate({ error: err.message });
    } finally {
        controller.close();
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