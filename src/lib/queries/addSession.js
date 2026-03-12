export default function getQueryAddSession(gql) {
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
