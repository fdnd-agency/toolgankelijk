export default function getQueryDeleteSession(gql) {
	return gql`
		mutation DeleteSessie($sessionId: String!) {
			deleteSessie(where: { sessieId: $sessionId }) {
				id
			}
		}
	`;
}
