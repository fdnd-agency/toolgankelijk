export default function getQueryUpdatePartnerUrls(gql, slug, totalUrls) {
	return gql`
		mutation {
			updateWebsite(
				data: {totalUrls: ${totalUrls}}
				where: { slug: "${slug}" }
			) {
				id
			}
		}
	`;
}
