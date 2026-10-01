import { redirect } from '@sveltejs/kit';

// breadcrumb forms (GET) land here and get redirected to the chosen page, so navigating works without JavaScript
// an empty value means "overview" and stops the path at that level
export function GET({ url }) {
	const segments = [];

	for (const key of ['partner', 'url', 'principle']) {
		const value = url.searchParams.get(key);
		if (!value) break;
		segments.push(encodeURIComponent(value));
	}

	throw redirect(303, '/' + segments.join('/'));
}
