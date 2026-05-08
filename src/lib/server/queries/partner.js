// Partner & website related queries

export default function getQueryPartner(limit = 20, offset = 0) {
	return `
		query GetPartners {
			toolgankelijk_website(limit: ${limit}, offset: ${offset}) {
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

			toolgankelijk_website_aggregated {
				count {
					id
				}
			}

			toolgankelijk_principle {
				id
				slug
				title
				guidelines: Guidelines {
					id
					toolgankelijk_guideline_id {
						id
						successcriteria: success_criteria {
							id
							toolgankelijk_success_criteria_id {
								id
							}
						}
					}
				}
			}
		}
	`;
}

export function getQueryWebsite(slug, limit = 20, offset = 0) {
	return `
		query Website {
			toolgankelijk_website(filter: { slug: { _eq: "${slug}" } }, limit: 1) {
				title
				homepage
				urls(limit: ${limit}, offset: ${offset}) {
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

			toolgankelijk_principle {
				id
				slug
				title
				guidelines: Guidelines {
					id
					toolgankelijk_guideline_id {
						id
						successcriteria: success_criteria {
							id
							toolgankelijk_success_criteria_id {
								id
							}
						}
					}
				}
			}

			toolgankelijk_url_aggregated(filter: { website_id: { slug: { _eq: "${slug}" } } }) {
				count {
					id
				}
			}
		}
	`;
}

export function getQueryUrlsByPartnerId(id, skip = 0, first = 100) {
	return `
		query {
			toolgankelijk_url(
				filter: { website_id: { _eq: "${id}" } }
				limit: ${first}
				offset: ${skip}
			) {
				id
			}
		}
	`;
}

export function getQueryAddPartner(name, url, slug, totalUrls) {
	return `
		mutation {
			create_toolgankelijk_website_item(
				data: {
					title: "${name}"
					homepage: "${url}"
					slug: "${slug}"
					totalUrls: ${totalUrls}
				}
			) {
				id
				title
				homepage
				slug
			}
		}
	`;
}

export function getQueryUpdatePartner(name, slug, url, id) {
	return `
		mutation {
			update_toolgankelijk_website_item(
				id: "${id}"
				data: { title: "${name}", homepage: "${url}", slug: "${slug}" }
			) {
				id
			}
		}
	`;
}

export function getQueryUpdatePartnerUrls(slug, totalUrls) {
	return `
		mutation {
			update_toolgankelijk_website_item(
				id: "${slug}"
				data: { totalUrls: ${totalUrls} }
			) {
				id
			}
		}
	`;
}

export function getQueryDeletePartner(id) {
	return `
		mutation {
			delete_toolgankelijk_website_item(id: "${id}") {
				id
			}
		}
	`;
}
