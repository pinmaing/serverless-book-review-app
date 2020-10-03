import { ConnectionAccess } from '../dataLayer/connectionsAccess'

const connectionAccess = new ConnectionAccess()

export async function getAllConnections() : Promise<any> {
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
