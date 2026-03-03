export default function getQueryUpdateSession(gql) {
	return gql`
		mutation UpdateSessie($sessionId: String!, $expiresAt: Date!) {
			updateSessie(where: { sessieId: $sessionId }, data: { houdbaarTot: $expiresAt }) {
				id
			}
		}
	`;
}
