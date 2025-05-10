export default function getQueryDeleteChecks(gql, urlId) {
    return gql`
        mutation {
            deleteManyChecksConnection(
                where: { url: { id: "${urlId}" } }
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