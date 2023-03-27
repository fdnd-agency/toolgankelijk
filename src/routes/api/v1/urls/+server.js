import { GraphQLClient, gql } from 'graphql-request'
import { HYGRAPH_KEY, HYGRAPH_URL_HIGH_PERFORMANCE, HYGRAPH_URL } from '$env/static/private'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  let websiteId = url.searchParams.get('websiteId') ?? false
  let first = Number(url.searchParams.get('first') ?? 5)
  let skip = Number(url.searchParams.get('skip') ?? 0)
  let direction = url.searchParams.get('direction') === 'DESC' ? 'DESC' : 'ASC'
  let orderBy = (url.searchParams.get('orderBy') ?? 'createdAt') + '_' + direction
  const hygraph = new GraphQLClient(HYGRAPH_URL_HIGH_PERFORMANCE, {
    headers: {
      Authorization: `Bearer ${HYGRAPH_KEY}`,
    },
  })
  let data;
  if (websiteId) {
    const query = gql`
      query getUrls($websiteId: ID, $first: Int, $skip: Int, $orderBy: UrlOrderByInput) {
        urls(where: {website: {id: $websiteId}}, first: $first, skip: $skip, orderBy: $orderBy) {
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
        urlsConnection {
          pageInfo {
            hasNextPage
            hasPreviousPage
            pageSize
          }
        }
      }
    `
    data = await hygraph.request(query, { websiteId, first, skip, orderBy })
  } else {
    const query = gql`
      query getUrls($first: Int, $skip: Int, $orderBy: UrlOrderByInput) {
        urls(first: $first, skip: $skip, orderBy: $orderBy) {
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
        urlsConnection {
          pageInfo {
            hasNextPage
            hasPreviousPage
            pageSize
          }
        }
      }
    `
    data = await hygraph.request(query, { first, skip, orderBy })
  }
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