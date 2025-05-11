export default function getQueryDeleteTestNode(gql, testNodeId) {
	return gql`
        mutation {
            deleteTestNode(where: { id: "${testNodeId}" }) {
                id
            }
        }
    `;
}
