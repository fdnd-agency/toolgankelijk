/**
 * Builds the page path from the breadcrumb choices (partner, url, principle).
 * An empty value means "overview" and stops the path at that level.
 * "level" is the choice that changed: deeper choices still belong to the old page, so the path stops there too.
 * Used by the /navigate route (without JavaScript) and the breadcrumbs (with JavaScript).
 *
 * @param {URLSearchParams | FormData} values
 * @returns {string}
 */
export function breadcrumbPath(values) {
	const segments = [];
	const level = values.get('level');

	for (const key of ['partner', 'url', 'principle']) {
		const value = values.get(key);
		if (!value) break;
		segments.push(encodeURIComponent(String(value)));
		if (key === level) break;
	}

	return '/' + segments.join('/');
}
