import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllBooks } from '../../businessLogic/books'
import {getUserId, getProccessId,parseNextKeyParameter, parseLimitParameter, encodeNextKey, getQueryParameter } from '../utils'
import { createLogger} from '../../utils/logger'

const logger = createLogger('getBook')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all Book items for a current user
  const procId = getProccessId()
  const userId = getUserId(event);

  logger.info(`ProcessId ${procId} : Start to get Book list for User : ${userId}`)

  let nextKey // Next key to continue scan operation if necessary
  let limit // Maximum number of elements to return
  let orderBy
  try {
    // Parse query parameters
    nextKey = parseNextKeyParameter(event)
    limit = parseLimitParameter(event) || 20
    orderBy = getQueryParameter(event,'orderBy') || ''
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

  const itemsListObj = await getAllBooks(limit,nextKey,orderBy)

  logger.info(`ProcessId ${procId} : Finish to get Book list for User : ${userId}`)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: itemsListObj.bookItems,
      lastEvaluatedKey: encodeNextKey(itemsListObj.lastEvaluatedKey)
    })
  }
}
