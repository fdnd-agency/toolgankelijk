export default function getQueryTotalUrls(gql, slug) {
	return gql`
		query Website {
			website(where: { slug: "${slug}" }) {
				titel
				homepage
				urls {
					id
					url
					name
					updatedAt
					slug
				}
			}
		}
	`;
}
