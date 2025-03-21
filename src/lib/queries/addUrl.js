export default function getQueryAddUrl(gql, urlSlug, urlLink, websiteSlug, urlName) {
	return gql`
    mutation {
        createUrl(
          data: {name: "${urlName}", url: "${urlLink}", slug: "${urlSlug}", website: {connect: {slug: "${websiteSlug}"}}}
        ) {
          id
        }
        publishUrl(where: {slug: "${urlSlug}"}) {
          id
        }
      }
  `;
}
