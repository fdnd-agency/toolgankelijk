export default function createEmptyCheck(gql, websiteSlug, urlSlug) {
	return gql`
    mutation addCheck {
        updateWebsite(
          where: {slug: "${websiteSlug}"}
          data: {
            urls: {
              update: {
                where: {slug: "${urlSlug}"},
                data: {
                  checks: {
                    create: {} # Creates a new empty check
                  }
                }
              }
            }
          }
        ) {
          urls {
            checks(last: 1) { # Fetch the last created check
              id
            }
          }
        }
      }
    `;
}
