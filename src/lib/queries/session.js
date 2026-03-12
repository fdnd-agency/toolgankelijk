export default function getQuerySession(gql) {
	return gql`
		query GetSessie($sessionId: String!) {
			sessie(where: { sessieId: $sessionId }) {
				id
				sessieId
				houdbaarTot
				gebruikerId {
					id
					email
					gebruikersnaam
					isEmailGeverifieerd
				}
			}
		}
	`;
}
