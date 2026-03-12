// URL, check, and toolboard related queries

export default function getQueryUrl(gql, slug) {
	return gql`
		query Url {
			toolgankelijk_url(filter: { slug: { _eq: "${slug}" } }, limit: 1) {
				id
				name
				url
				slug
				website_id {
					slug
				}
				checks {
					id
					success_criteria {
						id
					}
				}
			}
		}
	`;
}

export function getQueryAddUrl(gql, urlSlug, urlLink, websiteSlug, urlName) {
	return gql`
		mutation {
			create_toolgankelijk_url_item(
				data: {
					name: "${urlName}"
					url: "${urlLink}"
					slug: "${urlSlug}"
					website: "${websiteSlug}"
				}
			) {
				id
			}
		}
	`;
}

export function getQueryUpdateUrl(gql, slug, url, id, name) {
	return gql`
		mutation {
			update_toolgankelijk_url_item(
				id: "${id}"
				data: {
					slug: "${slug}"
					url: "${url}"
					name: "${name}"
				}
			) {
				id
			}
		}
	`;
}

export function getQueryDeleteUrl(gql, id) {
	return gql`
		mutation {
			delete_toolgankelijk_url_item(id: "${id}") {
				id
			}
		}
	`;
}

export function getQueryDeleteUrls(gql, id) {
	return gql`
		mutation {
			# Note: Directus GraphQL does not support delete-by-filter for items out of the box.
			# This mutation assumes a custom operation or will need to be adjusted to delete
			# individual URLs by id in the calling code.
			delete_toolgankelijk_url_item(id: "${id}") {
				id
			}
		}
	`;
}

export function createEmptyCheck(gql, websiteSlug, urlSlug) {
	return gql`
		mutation addCheck {
			updateWebsite: update_toolgankelijk_website_item(
				id: "${websiteSlug}"
				data: {
					urls: {
						update: {
							where: { slug: "${urlSlug}" }
							data: {
								checks: {
									create: {}
								}
							}
						}
					}
				}
			) {
				id
			}
		}
	`;
}

export function getQueryFirstCheck(gql, websiteSlug, urlSlug) {
	return gql`
		query checkedChecksOfUrl {
			website: toolgankelijk_website(filter: { slug: { _eq: "${websiteSlug}" } }, limit: 1) {
				urls(filter: { slug: { _eq: "${urlSlug}" } }, limit: 1) {
					checks(limit: 1) {
						id
					}
				}
			}
		}
	`;
}

export function getMutationAddCheck(gql, websiteSlug, urlSlug, firstCheckId, succescriteriumId) {
	return gql`
		mutation addCheck {
			updateWebsite: update_toolgankelijk_website_item(
				id: "${websiteSlug}"
				data: {
					urls: {
						update: {
							where: { slug: "${urlSlug}" }
							data: {
								checks: {
									upsert: {
										where: { id: "${firstCheckId}" }
										data: {
											create: {
												succescriteria: { connect: { id: "${succescriteriumId}" } }
											}
											update: {
												succescriteria: {
													connect: { where: { id: "${succescriteriumId}" } }
												}
											}
										}
									}
								}
							}
						}
					}
				}
			) {
				id
			}
		}
	`;
}

export function getMutationDeleteCheck(gql, websiteSlug, urlSlug, firstCheckId, succescriteriumId) {
	return gql`
		mutation addCheck {
			updateWebsite: update_toolgankelijk_website_item(
				id: "${websiteSlug}"
				data: {
					urls: {
						update: {
							where: { slug: "${urlSlug}" }
							data: {
								checks: {
									upsert: {
										where: { id: "${firstCheckId}" }
										data: {
											create: {
												succescriteria: { connect: { id: "${succescriteriumId}" } }
											}
											update: {
												succescriteria: {
													disconnect: { id: "${succescriteriumId}" }
												}
											}
										}
									}
								}
							}
						}
					}
				}
			) {
				id
			}
		}
	`;
}

export function getQueryDeleteChecks(gql, urlId) {
	return gql`
		mutation {
			deleteManyChecksConnection: delete_toolgankelijk_check_items(
				filter: { url: { _eq: "${urlId}" } }
			) {
				ids
			}
		}
	`;
}

export default function getQueryUrl(gql, slug) {
	return gql`
		query Url {
			toolgankelijk_url(filter: { slug: { _eq: "${slug}" } }, limit: 1) {
				id
				name
				url
				slug
				website_id {
					slug
				}
				checks {
					id
					success_criteria {
						id
					}
				}
			}
		}
	`;
}
