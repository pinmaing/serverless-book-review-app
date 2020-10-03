import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { deleteConnection } from '../../businessLogic/connections'

import { createLogger} from '../../utils/logger'
import {getProccessId} from '../utils'

const logger = createLogger('deleteConnection')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const procId = getProccessId()
  const connectionId = event.requestContext.connectionId
  logger.info(`ProcessId ${procId} : Websocket disconnect : ${connectionId}`)

  await deleteConnection(connectionId)
  logger.info(`ProcessId ${procId} : Websocket disconnected : ${connectionId}`)
  return {
    statusCode: 200,
    body: ''
  }
}
