import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteReview ,reviewExists} from '../../../businessLogic/reviews'
import {getUserId, getProccessId } from '../../utils'
import { createLogger} from '../../../utils/logger'

const logger = createLogger('deleteReview')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const reviewId = event.pathParameters.reviewId

  // Remove a TODO item by id
  const procId = getProccessId()
  const userId = getUserId(event);
  logger.info(`ProcessId ${procId} : Start to delete a ReviewId : ${reviewId} for User : ${userId}`)

  const validReviewId = await reviewExists(userId, reviewId)

  if (!validReviewId) {
  logger.info(`ProcessId ${procId} : Invalid ReviewId : ${reviewId} to delete for User : ${userId}`)

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Review does not exist'
      })
    }
  }

  await deleteReview(userId, reviewId)

  logger.info(`ProcessId ${procId} : Finish to delete a Review : ${reviewId} for User : ${userId}`)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
    })
  }
}
