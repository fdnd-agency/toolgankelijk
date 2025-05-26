export default function getQueryNiveaus(gql) {
	return gql`
		query Niveaus {
			niveaus {
                niveau
				slug
			}
		}
	`;
}
