export default function getQueryAddPartner(gql, name, url, slug, totalUrls) {
	return gql`
  mutation {
    createWebsite(data: {titel: "${name}", homepage: "${url}", slug: "${slug}", totalUrls: ${totalUrls}}) {
      id
      titel
      homepage
      slug
    }
    publishWebsite(where: {slug: "${slug}"}) {
      id
      titel
    }
  }
  `;
}
