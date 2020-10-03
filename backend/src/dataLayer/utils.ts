import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
export function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

export function createApiGatewayManagementApi() {
  return new XAWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: `${process.env.API_ID}.execute-api.ap-northeast-1.amazonaws.com/${process.env.STAGE}`
  })
}