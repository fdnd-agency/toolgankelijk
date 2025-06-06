import { hygraph } from '$lib/utils/hygraph.js';
import { gql } from 'graphql-request';
import { generateEmailVerificationCode } from '../utils/generateEmailVerificationCode.js';
import { encodeBase32 } from '@oslojs/encoding';

export async function getUserEmailVerificationRequest(userId, id) {
    const query = gql`
        query GetEmailVerificatieCode($id: ID!) {
            emailVerificatieCode(where: { id: $id }) {
                id
                code
                email
                houdbaarTot
                gebruiker {
                    id
                }
            }
        }
    `;
    const variables = { id };
    const data = await hygraph.request(query, variables);
    const row = data.emailVerificatieCode;
    if (!row || row.gebruiker.id !== userId) {
        return null;
    }
    const request = {
        id: row.id,
        userId: row.gebruiker.id,
        code: row.code,
        email: row.email,
        expiresAt: new Date(row.houdbaarTot)
    };
    return request;
}

export async function createEmailVerificationRequest(userId, email) {
	await deleteUserEmailVerificationRequest(userId);

	const idBytes = new Uint8Array(20);
	crypto.getRandomValues(idBytes);
	const id = encodeBase32(idBytes).toLowerCase();

	const code = generateEmailVerificationCode();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

	const mutation = gql`
        mutation CreateEmailVerificatieCode(
            $code: String!
            $email: String!
            $houdbaarTot: DateTime!
            $userId: ID!
        ) {
            createEmailVerificatieCode(
                data: {
                    code: $code
                    email: $email
                    houdbaarTot: $houdbaarTot
                    gebruiker: { connect: { id: $userId } }
                }
            ) {
                id
                code
                email
                houdbaarTot
                gebruiker {
                    id
                }
            }
        }
    `;

    const variables = {
        code,
        email,
        houdbaarTot: expiresAt.toISOString(),
        userId
    };

	const data = await hygraph.request(mutation, variables);
	const row = data.createEmailVerificatieCode;

	const request = {
		id: row.id,
		userId: row.gebruiker.id,
		code: row.code,
		email: row.email,
		expiresAt: new Date(row.houdbaarTot)
	};
	return request;
}

export async function deleteUserEmailVerificationRequest(userId) {
	const mutation = gql`
		mutation DeleteEmailVerificatieCode($userId: ID!) {
			deleteManyEmailVerificatieCodes(where: { gebruiker: { id: $userId } }) {
				count
			}
		}
	`;
	await hygraph.request(mutation, { userId });
}

export function sendVerificationEmail(email, code) {
	console.log(`To ${email}: Your verification code is ${code}`);
}

export function setEmailVerificationRequestCookie(event, request) {
	event.cookies.set('email_verification', request.id, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: request.expiresAt
	});
}

export function deleteEmailVerificationRequestCookie(event) {
	event.cookies.set('email_verification', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}

export async function getUserEmailVerificationRequestFromRequest(event) {
	if (event.locals.gebruiker === null) {
		return null;
	}
	const id = event.cookies.get('email_verification') ?? null;
	if (id === null) {
		return null;
	}
	const request = getUserEmailVerificationRequest(event.locals.gebruiker.id, id);
	if (request === null) {
		deleteEmailVerificationRequestCookie(event);
	}
	return request;
}
