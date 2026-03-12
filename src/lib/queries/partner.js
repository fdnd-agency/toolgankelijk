export default function getQueryPartner(gql, limit = 20, offset = 0) {
	return gql`
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
 			  	  success_criteria {       
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
				title
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
