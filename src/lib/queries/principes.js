export default function getQueryPrincipes(gql) {
	return gql`
		query Principes {
			principes {
				beschrijving {
					text
				}
				titel
				slug
				index
				checklistItems {
					check
				}
				richtlijnen {
					id
					titel
					succescriteria {
						id
						niveau
					}
				}
			}
		}
	`;
}
