import { GraphQLClient, gql } from 'graphql-request'
import { HYGRAPH_KEY, HYGRAPH_URL_HIGH_PERFORMANCE, HYGRAPH_URL } from '$env/static/private'
import { responseInit } from '$lib/server/responseInit'

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
  const hygraph = new GraphQLClient(HYGRAPH_URL_HIGH_PERFORMANCE, {
    headers: {
      Authorization: `Bearer ${HYGRAPH_KEY}`,
    },
  })
  const data = await hygraph.request(query, { id })
  return new Response(JSON.stringify(data), responseInit)
}

export async function POST({ request }) {
  const requestData = await request.json()
  let errors = []

  if (!requestData.url || typeof requestData.url !== 'string') {
    errors.push({ field: 'url', message: 'url should exist and have a string value' })
  }
  if (!requestData.websiteId || typeof requestData.websiteId !== 'string') {
    errors.push({ field: 'websiteId', message: 'websiteId should exist and have a string value' })
  }

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({
        errors: errors,
      }),
      {status: 400}
    )
  }

  // Bereid de mutatie voor
  const mutation = gql`
    mutation createUrl($url: String!, $websiteId: ID!) {
      createUrl(data: { url: $url, website: { connect: { id: $websiteId } } }) {
        id
      }
    }
  `

  // Bereid publiceren voor
  const publication = gql`
    mutation publishUrl($id: ID!) {
      publishUrl(where: { id: $id }, to: PUBLISHED) {
        id
      }
    }
  `

  const hygraph = new GraphQLClient(HYGRAPH_URL, {
    headers: {
      Authorization: `Bearer ${HYGRAPH_KEY}`,
    },
  })

  // Voer de mutatie uit
  const data = await hygraph
    .request(mutation, { ...requestData })
    // Stuur de response met created id door
    .then((data) => {
      return (
        hygraph
          // Voer de publicatie uit met created id
          .request(publication, { id: data.createUrl.id ?? null })
          // Vang fouten af bij het publiceren
          .catch((error) => {
            errors.push({ field: 'HyGraph', message: error })
          })
      )
    })
    // Vang fouten af bij de mutatie
    .catch((error) => {
      errors.push({ field: 'HyGraph', message: error })
    })

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({
        errors: errors,
      }),
      {status: 400}
    )
  }

  return new Response(
    JSON.stringify({
      data: data && data.publishUrl
    }),
    responseInit
  )
}