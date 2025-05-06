export default function getQueryUpdatePartner(gql, name, slug, url, totalUrls) {
	return gql`
		mutation {
			updateWebsite(
				data: {titel: "${name}", homepage: "${url}", slug: "${slug}", totalUrls: ${totalUrls}}
			) {
				id
			}
		}
	`;
}
