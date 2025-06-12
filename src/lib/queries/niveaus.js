export default function getQueryNiveaus(gql) {
	return gql`
		query Niveaus {
			niveaus {
				id
				niveau
				slug
			}
		}
	`;
}
