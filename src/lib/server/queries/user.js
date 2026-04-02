export function getQueryCheckUsernameAvailability(gql) {
	return gql`
		query CheckUsernameAvailability($username: String!) {
			users: toolgankelijk_user(filter: { username: { _eq: $username } }, limit: 1) {
				id
			}
		}
	`;
}

export function getMutationCreateUser(gql) {
	return gql`
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

export function getQueryUserPasswordHash(gql, id) {
	return gql`
		query GetUserPassword {
			user: toolgankelijk_user(filter: { id: { _eq: "${id}" } }, limit: 1) {
				password: password
			}
		}
	`;
}

export function getQueryUserFromEmail(gql) {
	return gql`
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

export function getMutationSetUserEmailAsVerified(gql, id) {
	return gql`
		mutation SetUserEmailAsVerified {
			updateUser: update_toolgankelijk_user_item(id: "${id}", data: { is_email_verified: true }) {
				id
			}
		}
	`;
}

export function getQueryCheckEmail(gql) {
	return gql`
		query CheckEmail($email: String!) {
			toolgankelijk_user(filter: { email: { _eq: $email } }, limit: 1) {
				id
			}
		}
	`;
}

export function getQueryValidEmailDomains(gql) {
	return gql`
		query GetValidEmailDomains {
			toolgankelijk_email_domain {
				domain
			}
		}
	`;
}

export function getQueryEmailVerificationById(gql, id) {
	return gql`
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

export function getMutationCreateEmailVerification(gql) {
	return gql`
		mutation CreateEmailVerificationCode($code: String!, $expiresAt: DateTime!, $userId: ID!) {
			createEmailVerificationCode: create_toolgankelijk_email_verification_code_item(
				data: {
					code: $code
					expires_at: $expiresAt
					user_id: $userId
				}
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

export function getMutationDeleteEmailVerificationsForUser(gql) {
	return gql`
		mutation DeleteEmailVerificationCodes($userId: ID!) {
			deleteEmailVerificationCodes: delete_toolgankelijk_email_verification_code_items(
				filter: { user_id: { _eq: $userId } }
			) {
				ids
			}
		}
	`;
}
