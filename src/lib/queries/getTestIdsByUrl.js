export default function getQueryTestIdsByUrl(gql, urlId) {
	return gql`
        query {
            url(where: { id: "${urlId}" }) {
                tests(first: 1000) {
                    id
                }
            }
        }
    `;
}
