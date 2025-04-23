export default function getQueryAddPartner(gql, name, url, slug, total) {
	return gql`
  mutation {
    createWebsite(data: {titel: "${name}", homepage: "${url}", slug: "${slug}", totalUrls: ${total}}) {
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
