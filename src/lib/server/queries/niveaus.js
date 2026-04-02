export default function getQueryNiveaus(gql) {
	return gql`
		query Levels {
			toolgankelijk_level {
				id
				level
				slug
			}
		}
	`;
}
