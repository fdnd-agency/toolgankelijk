export default function getQuerySession() {
	return `
		query GetSession($sessionId: String!) {
			session: toolgankelijk_session(filter: { session_id: { _eq: $sessionId } }, limit: 1) {
				id
				session_id
				expires_at
				user_id {
					id
					email
					username
					is_email_verified
				}
			}
		}
	`;
}

export function getQueryAddSession() {
	return `
		mutation CreateSession($session_id: String!, $expires_at: Date!, $user_id: ID!) {
			create_toolgankelijk_session_item(
				data: { session_id: $session_id, expires_at: $expires_at, user_id: $user_id }
			) {
				id
				session_id
				expires_at
				user_id {
					id
					email
					username
				}
			}
		}
	`;
}

export function getQueryUpdateSession() {
	return `
		mutation UpdateSessie($sessionId: String!, $expiresAt: DateTime!) {
			updateSessie: update_toolgankelijk_session_item(
				id: $sessionId
				data: { expires_at: $expiresAt }
			) {
				id
			}
		}
	`;
}

export function getQueryDeleteSession() {
	return `
		mutation DeleteSessie($sessionId: String!) {
			deleteSessie: delete_toolgankelijk_session_item(id: $sessionId) {
				id
			}
		}
	`;
}
