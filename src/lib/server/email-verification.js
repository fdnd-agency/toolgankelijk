import { hygraph } from '$lib/utils/hygraph.js';
import { gql } from 'graphql-request';
import { generateEmailVerificationCode } from '../utils/generateEmailVerificationCode.js';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from '$env/static/private';
import nodemailer from 'nodemailer';

// Deze functie haalt het e-mailverificatieverzoek op voor een gebruiker via het request ID
export async function getUserEmailVerificationRequest(userId, id) {
	const query = gql`
		query GetEmailVerificatieCode($id: ID!) {
			emailVerificatieCode(where: { id: $id }) {
				id
				code
				houdbaarTot
				gebruiker {
					id
					email
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
		email: row.gebruiker.email,
		expiresAt: new Date(row.houdbaarTot)
	};
	return request;
}

// Deze functie maakt een nieuw e-mailverificatieverzoek aan voor een gebruiker
export async function createEmailVerificationRequest(userId) {
	await deleteUserEmailVerificationRequest(userId);

	const code = generateEmailVerificationCode();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

	const mutation = gql`
		mutation CreateEmailVerificatieCode($code: String!, $houdbaarTot: DateTime!, $userId: ID!) {
			createEmailVerificatieCode(
				data: { code: $code, houdbaarTot: $houdbaarTot, gebruiker: { connect: { id: $userId } } }
			) {
				id
				code
				houdbaarTot
				gebruiker {
					id
					email
				}
			}
		}
	`;

	const variables = {
		code,
		houdbaarTot: expiresAt.toISOString(),
		userId
	};

	const data = await hygraph.request(mutation, variables);
	const row = data.createEmailVerificatieCode;

	const request = {
		id: row.id,
		userId: row.gebruiker.id,
		code: row.code,
		email: row.gebruiker.email,
		expiresAt: new Date(row.houdbaarTot)
	};
	return request;
}

// Deze functie verwijdert alle e-mailverificatieverzoeken voor een gebruiker
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

// Deze functie stuurt een verificatie-e-mail naar het e-mailadres van de gebruiker
export async function sendVerificationEmail(email, code) {
	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: parseInt(SMTP_PORT),
		secure: true,
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS
		}
	});

	await transporter.sendMail({
		from: `"Vervoerregio Amsterdam" <${SMTP_USER}>`,
		to: email,
		subject: 'Your verification code',
		text: `Your verification code is: ${code}`
	});
}

// Deze functie zet een cookie voor het e-mailverificatieverzoek
export function setEmailVerificationRequestCookie(event, request) {
	event.cookies.set('email_verification', request.id, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: request.expiresAt
	});
}

// Deze functie verwijdert de cookie van het e-mailverificatieverzoek
export function deleteEmailVerificationRequestCookie(event) {
	event.cookies.set('email_verification', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}

// Deze functie haalt het huidige e-mailverificatieverzoek van de gebruiker op via het ID uit de cookie
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
