/**
 * Builds the page path from the breadcrumb choices (partner, url, principle).
 * An empty value means "overview" and stops the path at that level.
 * Used by the /navigate route (without JavaScript) and the breadcrumbs (with JavaScript).
 *
 * @param {URLSearchParams | FormData} values
 * @returns {string}
 */
export function breadcrumbPath(values) {
	const segments = [];

	for (const key of ['partner', 'url', 'principle']) {
		const value = values.get(key);
		if (!value) break;
		segments.push(encodeURIComponent(String(value)));
	}

	return '/' + segments.join('/');
}
