export default function getQueryUrl(gql, slug) {
	return gql`
		query Url {
			url(where: { slug: "${slug}" }) {
				id
				name
				url
				slug
				updatedAt
				website {
					slug
				}
				checks {
					succescriteria(first: 200) {
						id
						index
						niveau
					}
				}
			}
		}
	`;
}
