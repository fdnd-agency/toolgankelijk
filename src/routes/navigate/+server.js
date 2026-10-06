import { redirect } from '@sveltejs/kit';
import { breadcrumbPath } from '$lib/utils/breadcrumbPath.js';

// breadcrumb forms (GET) land here and get redirected to the chosen page, so navigating works without JavaScript
export function GET({ url }) {
	throw redirect(303, breadcrumbPath(url.searchParams));
}
