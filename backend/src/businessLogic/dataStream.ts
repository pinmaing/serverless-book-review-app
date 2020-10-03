import { DynamoDBRecord } from 'aws-lambda'
import { ConnectionAccess } from '../dataLayer/connectionsAccess'
import { ESAccess } from '../dataLayer/esAccess'
import {createApiGatewayManagementApi} from '../dataLayer/utils'

const connectionAccess = new ConnectionAccess()
const esAccess = new ESAccess()
const apiGateway = createApiGatewayManagementApi()

export async function indexReview(records: DynamoDBRecord[]) {
  for (const record of records) {
    console.log('Processing record', JSON.stringify(record))
    if (record.eventName !== 'INSERT') {
      continue
    }

    const newItem = record.dynamodb.NewImage

    const reviewId = newItem.reviewId.S
    const bookId = newItem.bookId.S
    const body = {
      reviewId: reviewId,
      bookId: bookId,
      userId: newItem.userId.S,
      title: newItem.title.S,
      comment: newItem.comment.S,
      createDate: newItem.createDate.S,
      point: newItem.point.N
    }

    await esAccess.indexReview(reviewId,body)

    const connections = await connectionAccess.getAllConnections()

    const payload = {
      reviewId: reviewId,
      bookId: bookId
    }

    for (const connection of connections) {
        const connectionId = connection.id
        await sendMessageToClient(connectionId, payload)
    }

  }
}

async function sendMessageToClient(connectionId, payload) {
  try {
    console.log('Sending message to a connection', connectionId)

    await apiGateway.postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(payload),
    }).promise()

  } catch (e) {
    console.log('Failed to send message', JSON.stringify(e))
    if (e.statusCode === 410) {
      console.log('Stale connection')

      await connectionAccess.deleteConnection(connectionId)

    }
  }
}