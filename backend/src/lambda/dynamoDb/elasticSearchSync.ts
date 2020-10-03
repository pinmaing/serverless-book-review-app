import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
// import * as elasticsearch from 'elasticsearch'
// import * as httpAwsEs from 'http-aws-es'
// import * as AWS  from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { indexReview } from '../../businessLogic/dataStream'
import { createLogger} from '../../utils/logger'
import {getProccessId} from '../utils'
// const XAWS = AWSXRay.captureAWS(AWS)

// const docClient = new XAWS.DynamoDB.DocumentClient()

// const connectionsTable = process.env.CONNECTIONS_TABLE
// const stage = process.env.STAGE
// const apiId = process.env.API_ID

// const connectionParams = {
//   apiVersion: "2018-11-29",
//   endpoint: `${apiId}.execute-api.ap-northeast-1.amazonaws.com/${stage}`
// }

// const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams)

// const esHost = process.env.ES_ENDPOINT

// const es = new elasticsearch.Client({
//   hosts: [ esHost ],
//   connectionClass: httpAwsEs
// })
const logger = createLogger('indexReview')
export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  const procId = getProccessId()
  logger.info(`ProcessId ${procId} : Processing events batch from DynamoDB : ${JSON.stringify(event)}`)

  await indexReview(event.Records)
  logger.info(`ProcessId ${procId} : Finished Processing events batch from DynamoDB : ${JSON.stringify(event)}`)

  // for (const record of event.Records) {
  //   console.log('Processing record', JSON.stringify(record))
  //   if (record.eventName !== 'INSERT') {
  //     continue
  //   }

  //   const newItem = record.dynamodb.NewImage

  //   const reviewId = newItem.reviewId.S
  //   const bookId = newItem.bookId.S
  //   const body = {
  //     reviewId: reviewId,
  //     bookId: bookId,
  //     userId: newItem.userId.S,
  //     title: newItem.title.S,
  //     comment: newItem.comment.S,
  //     createDate: newItem.createDate.S,
  //     point: newItem.point.N
  //   }

  //   await es.index({
  //     index: 'reviews-index',
  //     type: 'reviews',
  //     id: reviewId,
  //     body
  //   })

  //   const connections = await docClient.scan({
  //     TableName: connectionsTable
  //   }).promise()

  //   const payload = {
  //     reviewId: reviewId,
  //     bookId: bookId
  //   }

  //   for (const connection of connections.Items) {
  //       const connectionId = connection.id
  //       await sendMessageToClient(connectionId, payload)
  //   }

  // }
}

// async function sendMessageToClient(connectionId, payload) {
//   try {
//     console.log('Sending message to a connection', connectionId)

//     await apiGateway.postToConnection({
//       ConnectionId: connectionId,
//       Data: JSON.stringify(payload),
//     }).promise()

//   } catch (e) {
//     console.log('Failed to send message', JSON.stringify(e))
//     if (e.statusCode === 410) {
//       console.log('Stale connection')

//       await docClient.delete({
//         TableName: connectionsTable,
//         Key: {
//           id: connectionId
//         }
//       }).promise()

//     }
//   }
// }
