import { GraphQLClient, gql } from 'graphql-request'
import { HYGRAPH_KEY, HYGRAPH_URL_HIGH_PERFORMANCE, HYGRAPH_URL } from '$env/static/private'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  let first = Number(url.searchParams.get('first') ?? 5)
  let skip = Number(url.searchParams.get('skip') ?? 0)
  let direction = url.searchParams.get('direction') === 'DESC' ? 'DESC' : 'ASC'
  let orderBy = (url.searchParams.get('orderBy') ?? 'createdAt') + '_' + direction

  const query = gql`
    query getChecks($first: Int, $skip: Int, $orderBy: CheckOrderByInput) {
      checks(first: $first, skip: $skip, orderBy: $orderBy) {
        id
        createdAt
        createdBy {
          id
          name
        }
        url {
          id
          url
          website {
            id
            titel
            homepage
          }
        }
        succescriteria {
          id
          index
          titel
          niveau
        }
      }
    }
  `
  const hygraph = new GraphQLClient(HYGRAPH_URL_HIGH_PERFORMANCE, {
    headers: {
      Authorization: `Bearer ${HYGRAPH_KEY}`,
    },
  })
  const data = await hygraph.request(query, { first, skip, orderBy })
  return new Response(JSON.stringify(data), responseInit)
}

export async function POST({ request }) {
  const requestData = await request.json()
  let errors = []

  if (!requestData.urlId || typeof requestData.urlId !== 'string') {
    errors.push({ field: 'urlId', message: 'urlId should exist and have a string value' })
  }
  if (!requestData.succescriteriaIds || typeof requestData.succescriteriaIds !== 'object') {
    errors.push({ field: 'succescriteriaIds', message: 'succescriteriaIds should exist and have an array value' })
  }

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({
        errors: errors,
      }), {status: 400}
    )
  }

  // LELIJK! Gelukkig is het maar backend code :-D
  let succescriteriaIds = ''
  requestData.succescriteriaIds.forEach(function(succesCriterium) {
    succescriteriaIds += '{id: "' + succesCriterium + '"},'
  });

  // Bereid de mutatie voor
  const mutation = gql`
    mutation createCheck($urlId: ID!) {
      createCheck(
        data: {
          url: {
            connect: {
              id: $urlId
            }
          },
          succescriteria: {
            connect: [
              ${succescriteriaIds}
            ]
          }
        }
      ) {
        id
      }
    }
  `

  // Bereid publiceren voor
  const publication = gql`
    mutation publishCheck($id: ID!) {
      publishCheck(where: { id: $id }, to: PUBLISHED) {
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
          .request(publication, { id: data.createCheck.id ?? null })
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