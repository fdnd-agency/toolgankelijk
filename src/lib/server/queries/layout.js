export default function getQueryLayout(gql) {
	return gql`
		query Layout(
			$slug: String
			$partnerLimit: Int!
			$partnerOffset: Int!
			$urlLimit: Int!
			$urlOffset: Int!
		) {
			partnerOverview: toolgankelijk_website(limit: $partnerLimit, offset: $partnerOffset) {
				id
				title
				slug
				homepage
				urls {
					id
					slug
					url
					checks {
						id
						successCriteria: success_criteria {
							id
						}
					}
				}
			}

			partnerOverview_agg: toolgankelijk_website_aggregated {
				count {
					id
				}
			}

			website: toolgankelijk_website(filter: { slug: { _eq: $slug } }, limit: 1) {
				id
				title
				slug
				homepage
				urls(limit: $urlLimit, offset: $urlOffset) {
					id
					url
					name
					slug
					checks {
						id
						successCriteria: success_criteria {
							id
						}
					}
				}
			}

			websiteUrlAgg: toolgankelijk_url_aggregated(
				filter: { website_id: { slug: { _eq: $slug } } }
			) {
				count {
					id
				}
			}

			principles: toolgankelijk_principle {
				id
				title
				guidelines: Guidelines {
					id
					success_criteria
				}
			}
		}
	`;
}
