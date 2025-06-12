import { hygraph } from '$lib/utils/hygraph.js';
import { gql } from 'graphql-request';

export function verifyUsernameInput(username) {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function checkUsernameAvailability(username) {
	const query = gql`
		query CheckGebruikersnaamAvailability($username: String!) {
			gebruiker(where: { gebruikersnaam: $username }) {
				id
			}
		}
	`;
	const data = await hygraph.request(query, { username });
	return !data.gebruiker;
}

export async function createUser(email, username, passwordHash) {
	const mutation = gql`
		mutation CreateGebruiker(
			$email: String!
			$username: String!
			$passwordHash: String!
			$isEmailGeverifieerd: Boolean!
		) {
			createGebruiker(
				data: {
					email: $email
					gebruikersnaam: $username
					wachtwoord: $passwordHash
					isEmailGeverifieerd: $isEmailGeverifieerd
				}
			) {
				id
				email
				gebruikersnaam
				isEmailGeverifieerd
			}
		}
	`;
	const variables = { email, username, passwordHash, isEmailGeverifieerd: false };
	const data = await hygraph.request(mutation, variables);
	if (!data.createGebruiker) {
		throw new Error('Unexpected error');
	}
	const user = {
		id: data.createGebruiker.id,
		gebruikersnaam: data.createGebruiker.gebruikersnaam,
		email: data.createGebruiker.email,
		isEmailGeverifieerd: data.createGebruiker.isEmailGeverifieerd
	};
	return user;
}

export async function getUserPasswordHash(userId) {
	const query = gql`
		query GetGebruikerWachtwoord($id: ID!) {
			gebruiker(where: { id: $id }) {
				wachtwoord
			}
		}
	`;
	const data = await hygraph.request(query, { id: userId });
	if (!data.gebruiker) {
		throw new Error('Invalid user ID');
	}
	return data.gebruiker.wachtwoord;
}

export async function getUserFromEmail(email) {
	const query = gql`
		query GetGebruikerFromEmail($email: String!) {
			gebruiker(where: { email: $email }) {
				id
				email
				gebruikersnaam
			}
		}
	`;
	const data = await hygraph.request(query, { email });
	if (!data.gebruiker) {
		return null;
	}
	const user = {
		id: data.gebruiker.id,
		email: data.gebruiker.email,
		gebruikersnaam: data.gebruiker.gebruikersnaam
	};
	return user;
}

export async function setUserEmailAsVerified(userId, email) {
	const mutation = gql`
		mutation SetUserEmailAsVerified($id: ID!, $email: String!) {
			updateGebruiker(where: { id: $id, email: $email }, data: { isEmailGeverifieerd: true }) {
				id
			}
		}
	`;
	await hygraph.request(mutation, { id: userId, email });
}
