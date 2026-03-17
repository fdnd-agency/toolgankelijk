export default function getQueryToolboard(gql, slugUrl, principeSlug) {
	return gql`
		query Toolboard {
			url: toolgankelijk_url(filter: { slug: { _eq: "${slugUrl}" } }, limit: 1) {
				id
				url
				slug
				checks {
					id
					successcriteria: success_criteria {
						id
					}
				}
			}

			principe: toolgankelijk_principle(filter: { slug: { _eq: "${principeSlug}" } }, limit: 1) {
				id
				title
				description
				index
				slug
				checklist_items {
					id
					check
					question
					explanation
					tip
				}
				guidelines: Guidelines {
					id
					toolgankelijk_guideline_id {
						id
					}
				}
			}

			principes: toolgankelijk_principle {
				id
				title
				index
				slug
				checklist_items {
					id
					check
					question
					explanation
					tip
				}
				guidelines: Guidelines {
					id
					toolgankelijk_guideline_id {
						id
					}
				}
			}
		}
	`;
}
