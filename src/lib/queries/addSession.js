export default function getQueryAddSession(gql) {
	return gql`
		mutation CreateSessie($userId: ID!, $expiresAt: Date!, $sessionId: String!) {
			createSessie(
				data: {
					sessieId: $sessionId
					gebruikerId: { connect: { id: $userId } }
					houdbaarTot: $expiresAt
				}
			) {
				id
			}
		}
	`;
}
