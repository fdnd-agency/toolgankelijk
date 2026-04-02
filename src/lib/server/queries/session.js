export default function getQuerySession(gql) {
	return gql`
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

export function getQueryAddSession(gql) {
	return gql`
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

export function getQueryUpdateSession(gql) {
	return gql`
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

export function getQueryDeleteSession(gql) {
	return gql`
		mutation DeleteSessie($sessionId: String!) {
			deleteSessie: delete_toolgankelijk_session_item(id: $sessionId) {
				id
			}
		}
	`;
}
