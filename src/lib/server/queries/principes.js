export default function getQueryPrincipes() {
	return `
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
				guidelines: Guidelines {
					id
					toolgankelijk_guideline_id {
						id
						successcriteria: success_criteria {
							id
							toolgankelijk_success_criteria_id {
								id
								index
								level
								title
								criteria
								easyCriteria: easy_criteria
							}
						}
					}
				}
			}
		}
	`;
}
