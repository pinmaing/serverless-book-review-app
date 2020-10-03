import { ConnectionAccess } from '../dataLayer/connectionsAccess'
import {ConnectionItem} from '../models/ConnectionItem'
const connectionAccess = new ConnectionAccess()

export async function getAllConnections() : Promise<ConnectionItem[]> {
  return connectionAccess.getAllConnections()
}

export async function createConnection(connectionId: string) {

  await connectionAccess.createConnection({
    id: connectionId,
    timestamp: new Date().toISOString()
  })
}

export async function deleteConnection(
  connectionId: string) {

  await connectionAccess.deleteConnection(connectionId)
}
