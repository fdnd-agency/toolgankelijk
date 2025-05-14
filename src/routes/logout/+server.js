import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { deleteSessionTokenCookie } from '$lib/server/session.js';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

export async function POST({ cookies }) {
    const sessionToken = cookies.get('session');
    if (sessionToken) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
        const deleteMutation = gql`
            mutation DeleteSessie($id: String!) {
                deleteSessie(where: { sessieId: $id }) {
                    id
                }
            }
        `;
        await hygraph.request(deleteMutation, { id: sessionId });
        deleteSessionTokenCookie({ cookies });
    }
    return new Response(null, { status: 204 });
}