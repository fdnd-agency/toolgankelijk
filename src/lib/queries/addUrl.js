export default function getQueryAddUrl(gql, urlSlug, urlLink, websiteSlug) {
	return gql`
    mutation {
        createUrl(
          data: {url: "${urlLink}", slug: "${urlSlug}", website: {connect: {slug: "${websiteSlug}"}}}
        ) {
          id
        }
        publishUrl(where: {slug: "${urlSlug}"}) {
          id
        }
      }
  `;
}
