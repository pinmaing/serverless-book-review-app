import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getBookAllReviews } from '../../businessLogic/reviews'
import {bookExists} from '../../businessLogic/books'
import {getProccessId,parseNextKeyParameter, parseLimitParameter, encodeNextKey } from '../utils'
import { createLogger} from '../../utils/logger'

const logger = createLogger('getBookReview')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all TODO items for a current user
  const procId = getProccessId()
  const bookId = event.pathParameters.bookId

  logger.info(`ProcessId ${procId} : Start to get Review list for bookId : ${bookId}`)

  const validBookId = await bookExists(bookId)

  if (!validBookId) {
  logger.info(`ProcessId ${procId} : Invalid BookId : ${bookId} to give review`)

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Book does not exist'
      })
    }
  }

  let nextKey // Next key to continue scan operation if necessary
  let limit // Maximum number of elements to return
  try {
    // Parse query parameters
    nextKey = parseNextKeyParameter(event)
    limit = parseLimitParameter(event) || 20
  } catch (err) {
    logger.info('Failed to parse query parameters: ', err.message)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Invalid parameters'
      })
    }
  }

  const itemsListObj = await getBookAllReviews(bookId,limit,nextKey)

  logger.info(`ProcessId ${procId} : Finish to get Review list for User : ${bookId}`)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: itemsListObj.reviewItems,
      lastEvaluatedKey: encodeNextKey(itemsListObj.lastEvaluatedKey)
    })
  }
}
