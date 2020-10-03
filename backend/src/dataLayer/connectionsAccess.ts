import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import {createDynamoDBClient} from './utils'

export class ConnectionAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly connectionsTable = process.env.CONNECTIONS_TABLE) {
  }

  async getAllConnections(): Promise<any> {
    const connections = await this.docClient.scan({
      TableName: this.connectionsTable
    }).promise()
    return connections.Items
  }

  async deleteConnection(connectionId: string){
    await this.docClient.delete({
      TableName: this.connectionsTable,
      Key: {
        id: connectionId
      }
    }).promise()
  }

  async createConnection(item: {}){
    await this.docClient.put({
      TableName: this.connectionsTable,
      Item: item
    }).promise()
  }

}
