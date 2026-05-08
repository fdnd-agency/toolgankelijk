import { redirect } from '@sveltejs/kit';

/**
 * Ensures the request has an authenticated and email-verified user.
 * Redirects to login or verification flow when requirements are not met.
 *
 * @param {import('@sveltejs/kit').Locals} locals
 */
export function requireAuthenticatedVerifiedUser(locals) {
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}

	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
}
