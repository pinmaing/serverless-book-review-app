import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateBookReviewRequest } from '../../../requests/UpdateBookReviewRequest'
import { updateReview,reviewExists } from '../../../businessLogic/reviews'
import {getUserId, getProccessId } from '../../utils'
import { createLogger} from '../../../utils/logger'

const logger = createLogger('updateReview')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const reviewId = event.pathParameters.reviewId
  const updatedReview: UpdateBookReviewRequest = JSON.parse(event.body)

  // Update a TODO item with the provided id using values in the "updatedReview" object
  const procId = getProccessId()
  const userId = getUserId(event);
  logger.info(`ProcessId ${procId} : Start to update Review : ${reviewId} for User : ${userId}`)

  const validReviewId = await reviewExists(userId,reviewId)

  if (!validReviewId) {
    logger.info(`ProcessId ${procId} : Invalid to update Review : ${reviewId} for User : ${userId}`)

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

  if (!updatedReview.title || !updatedReview.comment) {
    logger.info(`ProcessId ${procId} : Title or Comment must not be empty to update BookReview : ${reviewId}`)
  
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          error: 'Invalid request body : Title or Comment must not be empty'
        })
      }
    }

  await updateReview(updatedReview, userId, reviewId)
  logger.info(`ProcessId ${procId} : Finish to update Review : ${reviewId} for User : ${userId}`)
  
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
