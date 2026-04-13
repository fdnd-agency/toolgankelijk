import { sessionService } from '$lib/server/session.js';

export async function POST({ cookies }) {
	await sessionService.DeleteSession({ cookies });
	return new Response(null, { status: 204 });
}
