import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import { indexReview } from '../../businessLogic/dataStream'
import { createLogger} from '../../utils/logger'
import {getProccessId} from '../utils'

const logger = createLogger('indexReview')
export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  const procId = getProccessId()
  logger.info(`ProcessId ${procId} : Processing events batch from DynamoDB : ${JSON.stringify(event)}`)

  await indexReview(event.Records)
  logger.info(`ProcessId ${procId} : Finished Processing events batch from DynamoDB : ${JSON.stringify(event)}`)
}