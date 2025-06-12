export default function getQueryUrlsByPartnerId(gql, id, skip = 0, first = 100) {
	return gql`
		query {
			urls(
				where: { website: { id: "${id}" } }
				skip: ${skip}
				first: ${first}
			) {
				id
			}
		}
	`;
}
