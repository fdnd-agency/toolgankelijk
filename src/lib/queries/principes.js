export default function getQueryPrincipes(gql) {
	return gql`
		query Principles {
			toolgankelijk_principle {
				id
				description
				title
				slug
				index
				checklist_items {
					id
					check
					question
					explanation
					tip
				}
				Guidelines {
					id
					toolgankelijk_guideline_id {
						id
					}
				}
			}
		}
	`;
}
