import { GraphQLClient, gql } from 'graphql-request'
import { HYGRAPH_KEY, HYGRAPH_URL_HIGH_PERFORMANCE } from '$env/static/private'

import { responseInit } from '$lib/server/responseInit'

const hygraph = new GraphQLClient(HYGRAPH_URL_HIGH_PERFORMANCE, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_KEY}`,
  },
})

export async function GET({ url }) {
  let id = url.searchParams.get('id') ?? false
  const query = gql`
    query getUrls {
      urls {
        id
        url
        createdAt
        website {
          id
          titel
          homepage
        }
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
  `
  const data = await hygraph.request(query, { id })
  return new Response(JSON.stringify(data), responseInit)
}
