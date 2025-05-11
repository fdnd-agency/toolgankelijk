export default function getQueryDeleteTest(gql, testId) {
	return gql`
        mutation {
            deleteTest(where: { id: "${testId}" }) {
                id
            }
        }
    `;
}
