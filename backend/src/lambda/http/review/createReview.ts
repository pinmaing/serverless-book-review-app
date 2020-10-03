import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateBookReviewRequest } from '../../../requests/CreateBookReviewRequest'
import { createReview } from '../../../businessLogic/reviews'
import { bookExists } from '../../../businessLogic/books'
import {getUserId, getProccessId} from '../../utils'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('createReview')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newBookReview: CreateBookReviewRequest = JSON.parse(event.body)

  // Implement creating a new TODO item
  const procId = getProccessId()
  const userId = getUserId(event);
  // const bookId = event.pathParameters.bookId

  logger.info(`ProcessId ${procId} : Start to create BookReview for Book : ${newBookReview.bookId}`)

  if (!newBookReview.bookId) {
    logger.info(`ProcessId ${procId} : BookId must not be empty to create Review for Book`)
  
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          error: 'Invalid request body : BookId must not be empty'
        })
      }
    }

  const validReviewId = await bookExists(newBookReview.bookId)

  if (!validReviewId) {
  logger.info(`ProcessId ${procId} : Invalid BookId : ${newBookReview.bookId} to give review`)

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

  if (!newBookReview.title || !newBookReview.comment) {
    logger.info(`ProcessId ${procId} : Title or Comment must not be empty to create BookReview for Book : ${newBookReview.bookId}`)
  
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
    } else if(!newBookReview.point || !(0< newBookReview.point  && newBookReview.point <= 5)){
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          error: 'Invalid request body : Point Must be Between (1~5)'
        })
      }
    }

  const item = await createReview(newBookReview, userId)

  logger.info(`ProcessId ${procId} : Finish to create BookReview for Book : ${newBookReview.bookId}`)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}
