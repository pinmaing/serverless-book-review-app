import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { increaseReviewLike, getReviewById } from '../../../businessLogic/reviews'
import {getUserId, getProccessId } from '../../utils'
import { createLogger} from '../../../utils/logger'

const logger = createLogger('increaseReviewLike')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const reviewId = event.pathParameters.reviewId

  // Update a BOOK REVIEW item with the provided id using values in the "updatedReview" object
  const procId = getProccessId()
  const userId = getUserId(event);
  logger.info(`ProcessId ${procId} : Start to increase Review Like Count of Review : ${reviewId} for User : ${userId}`)

  const validReview = await getReviewById(reviewId)

  if (!validReview) {
    logger.info(`ProcessId ${procId} : Invalid to increase Review Like Count of Review : ${reviewId} for User : ${userId}`)

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

  await increaseReviewLike(validReview.userId,reviewId)
  logger.info(`ProcessId ${procId} : Finish to increase Review Like Count of Review : ${reviewId} for User : ${userId}`)
  
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