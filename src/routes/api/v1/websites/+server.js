import { GraphQLClient, gql } from 'graphql-request'
import { HYGRAPH_KEY, HYGRAPH_URL_HIGH_PERFORMANCE } from '$env/static/private'

import { responseInit } from '$lib/server/responseInit'

const hygraph = new GraphQLClient(HYGRAPH_URL_HIGH_PERFORMANCE, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_KEY}`,
  },
})

export async function GET({ url }) {
  const query = gql`
    query getWebsites {
      websites {
        id
        titel
        homepage
        urls {
          id
          url
          checks {
            id
            createdAt
            createdBy {
              id
              name
            }
            succescriteria {
              id
              index
              titel
              niveau
            }
          }
        }
      }
      websitesConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
          pageSize
        }
      }
    }
  `
  const data = await hygraph.request(query, {})
  return new Response(JSON.stringify(data), responseInit)
}
