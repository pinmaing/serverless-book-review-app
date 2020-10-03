import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {ConnectionItem} from '../models/ConnectionItem'
import {createDynamoDBClient} from './utils'

export class ConnectionAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly connectionsTable = process.env.CONNECTIONS_TABLE) {
  }

  async getAllConnections(): Promise<ConnectionItem[]> {
    const connections = await this.docClient.scan({
      TableName: this.connectionsTable
    }).promise()
    return connections.Items as ConnectionItem[]
  }

  async deleteConnection(connectionId: string){
    await this.docClient.delete({
      TableName: this.connectionsTable,
      Key: {
        id: connectionId
      }
    }).promise()
  }

  async createConnection(item: ConnectionItem){
    await this.docClient.put({
      TableName: this.connectionsTable,
      Item: item
    }).promise()
  }

}
