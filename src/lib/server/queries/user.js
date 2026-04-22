export function getQueryCheckUsernameAvailability() {
	return `
		query CheckUsernameAvailability($username: String!) {
			users: toolgankelijk_user(filter: { username: { _eq: $username } }, limit: 1) {
				id
			}
		}
	`;
}

export function getMutationCreateUser() {
	return `
		mutation CreateUser(
			$email: String!
			$username: String!
			$password: String!
			$isEmailVerified: Boolean!
		) {
			createUser: create_toolgankelijk_user_item(
				data: {
					email: $email
					username: $username
					password: $password
					is_email_verified: $isEmailVerified
				}
			) {
				id
				email
				username
				isEmailVerified: is_email_verified
			}
		}
	`;
}

export function getQueryUserPasswordHash(id) {
	return `
		query GetUserPassword {
			user: toolgankelijk_user(filter: { id: { _eq: "${id}" } }, limit: 1) {
				password: password
			}
		}
	`;
}

export function getQueryUserFromEmail() {
	return `
		query GetUserFromEmail($email: String!) {
			user: toolgankelijk_user(filter: { email: { _eq: $email } }, limit: 1) {
				id
				email
				username
				is_email_verified
			}
		}
	`;
}

export function getMutationSetUserEmailAsVerified(id) {
	return `
		mutation SetUserEmailAsVerified {
			updateUser: update_toolgankelijk_user_item(id: "${id}", data: { is_email_verified: true }) {
				id
			}
		}
	`;
}

export function getQueryCheckEmail() {
	return `
		query CheckEmail($email: String!) {
			toolgankelijk_user(filter: { email: { _eq: $email } }, limit: 1) {
				id
			}
		}
	`;
}

export function getQueryValidEmailDomains() {
	return `
		query GetValidEmailDomains {
			toolgankelijk_email_domain {
				domain
			}
		}
	`;
}

export function getQueryEmailVerificationById(id) {
	return `
		query GetEmailVerificationCode {
			emailVerificationCode: toolgankelijk_email_verification_code(
				filter: { id: { _eq: "${id}" } }
				limit: 1
			) {
				id
				code
				expiresAt: expires_at
				user: user_id {
					id
					email
				}
			}
		}
	`;
}

export function getMutationCreateEmailVerification() {
	return `
		mutation CreateEmailVerificationCode($code: String!, $expiresAt: DateTime!, $userId: ID!) {
			createEmailVerificationCode: create_toolgankelijk_email_verification_code_item(
				data: { code: $code, expires_at: $expiresAt, user_id: $userId }
			) {
				id
				code
				expiresAt: expires_at
				user: user_id {
					id
					email
				}
			}
		}
	`;
}

export function getMutationDeleteEmailVerificationsForUser() {
	return `
		mutation DeleteEmailVerificationCodes($userId: ID!) {
			deleteEmailVerificationCodes: delete_toolgankelijk_email_verification_code_items(
				filter: { user_id: { _eq: $userId } }
			) {
				ids
			}
		}
	`;
}
