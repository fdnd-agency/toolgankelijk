export default function getQuerySession(gql) {
	return gql`
		query GetSession($sessionId: String!) {
			sessie: toolgankelijk_session(filter: { session_id: { _eq: $sessionId } }, limit: 1) {
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
