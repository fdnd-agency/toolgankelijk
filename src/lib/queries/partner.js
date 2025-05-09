export default function getQueryPartner(gql, first = 20, skip = 0) {
	return gql`
		query MyQuery {
			websites(first: ${first}, skip: ${skip}) {
				id
				titel
				slug
				homepage
				updatedAt
				urls {
					slug
					url
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
