export default function getQueryTestNodeIdsByTest(gql, testId) {
	return gql`
        query {
            test(where: { id: "${testId}" }) {
                testNodes(first: 1000) {
                    id
                }
            }
        }
    `;
}
