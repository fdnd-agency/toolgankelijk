export default function getQueryUrl(gql, url) {
	return gql`
		query Url {
			url(where: { url: "${url}" }) {
				id
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
					}
				}
			}
		}
	`;
}
