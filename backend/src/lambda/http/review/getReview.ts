import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllReviews } from '../../../businessLogic/reviews'
import {getUserId, getProccessId,parseNextKeyParameter, parseLimitParameter, encodeNextKey } from '../../utils'
import { createLogger} from '../../../utils/logger'

const logger = createLogger('getBookReview')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all TODO items for a current user
  const procId = getProccessId()
  const userId = getUserId(event);

  logger.info(`ProcessId ${procId} : Start to get Review list for User : ${userId}`)

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

  const itemsListObj = await getAllReviews(userId,limit,nextKey)

  logger.info(`ProcessId ${procId} : Finish to get Review list for User : ${userId}`)
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
