import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createConnection } from '../../businessLogic/connections'

import { createLogger} from '../../utils/logger'
import {getProccessId} from '../utils'

const logger = createLogger('createConnection')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const procId = getProccessId()
  const connectionId = event.requestContext.connectionId
  logger.info(`ProcessId ${procId} : Websocket connect : ${connectionId}`)

  await createConnection(connectionId)
  logger.info(`ProcessId ${procId} : Websocket connected : ${connectionId}`)
  return {
    statusCode: 200,
    body: ''
  }
}
