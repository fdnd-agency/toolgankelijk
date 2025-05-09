export default function getQueryDeleteUrls(gql, id) {
	return gql`
		mutation {
			deleteManyUrlsConnection(
				where: { website: { id: "${id}" } }
			) {
				edges {
					node {
						id
					}
				}
			}
		}
	`;
}
