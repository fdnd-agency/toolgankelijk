export default function getQueryWebsite(gql, slug, first = 20, skip = 0) {
	return gql`
		query Website {
			website(where: { slug: "${slug}" }) {
				titel
				homepage
				urls(first: ${first}, skip: ${skip}) {
					id
					url
					name
					updatedAt
					slug
					checks {
						succescriteria {
							id
						}
					}
				}
			}
			principes {
				titel
				richtlijnen {
					titel
					succescriteria(first: 200) {
						id
					}
				}
			}
		}
	`;
}
