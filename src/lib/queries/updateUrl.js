export default function getQueryUpdateUrl(gql, slug, url, id, name) {
	return gql`
		mutation {
			updateUrl(
				data: {
					slug: "${slug}"
					url: "${url}"
					name: "${name}"
				}
				where: { id: "${id}" }
			) {
				id
			}
		}
	`;
}
