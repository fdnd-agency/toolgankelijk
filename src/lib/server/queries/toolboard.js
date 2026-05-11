export default function getQueryToolboard(slugUrl, principleSlug) {
	return `
		query Toolboard {
			url: toolgankelijk_url(filter: { slug: { _eq: "${slugUrl}" } }, limit: 1) {
				id
				url
				slug
				checks {
					id
					successcriteria: success_criteria {
						id
						toolgankelijk_success_criteria_id {
							id
						}
					}
				}
			}

			principle: toolgankelijk_principle(filter: { slug: { _eq: "${principleSlug}" } }, limit: 1) {
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
						index
						title
						explanation
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

			principles: toolgankelijk_principle {
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
						index
						title
						explanation
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
