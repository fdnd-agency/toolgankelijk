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
    query getPrincipe($id: ID) {
      principe(where: {id: $id}) {
        id
        index
        titel
        slug
        checklistItems {
          check
          vraag
          uitleg
          tip
          succescriteria {
            id
            index
            titel
            niveau
          }
        }
        beschrijving {
          html
        }
        richtlijnen {
          id
          index
          titel
          uitleg {
            html
          }
          tip {
            html
          }
          succescriteria {
            id
            index
            titel
            niveau
          }
        }
      }
      principesConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
          pageSize
        }
      }
    }
  `
  const data = await hygraph.request(query, { id })
  return new Response(JSON.stringify(data), responseInit)
}
