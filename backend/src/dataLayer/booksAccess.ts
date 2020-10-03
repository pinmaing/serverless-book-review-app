import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { BookItem } from '../models/BookItem'
import {BookItemList} from '../models/BookItemList'
import {createDynamoDBClient} from './utils'

export class BookAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly booksTable = process.env.BOOK_TABLE,
    private readonly publisherIndex = process.env.BOOK_PUBLISHER_INDEX,
    private readonly publishDateIndex = process.env.BOOK_PUBLISH_DATE_INDEX,
    private readonly pointIndex = process.env.BOOK_POINT_INDEX) {
  }

  async getAllBooks(limit: number, nextKey: String, orderBy: String): Promise<BookItemList> {
    let queryParam = {
      TableName: this.booksTable,
      Limit: limit,
      ExclusiveStartKey: nextKey//,
      // KeyConditionExpression: 'bookId = :bookId',
      // ExpressionAttributeValues: {
      //     ':bookId': bookId
      // }
    }

    if(orderBy) {
      if ("publisher" == orderBy.trim().toLowerCase()){
        queryParam["IndexName"] = this.publisherIndex
      } else if ("publishDate" == orderBy.trim().toLowerCase()) {
        queryParam["IndexName"] = this.publishDateIndex
      } else if ("point" == orderBy.trim().toLowerCase()){
        queryParam["IndexName"] = this.pointIndex
      }
    }
    
    const result = await this.docClient.scan(queryParam).promise()

    const items = result.Items as BookItem[]
    const lastEvaluatedKey = result.LastEvaluatedKey
    let bookItemList : BookItemList = {
      bookItems: items,
      lastEvaluatedKey: lastEvaluatedKey
    }
    return bookItemList
  }

  async updateBook(bookId: string,point: number) {
    console.log("Update Book Review point : " + bookId + "   count  " + point)
    const old = await this.getBook(bookId)

    var params = {
      TableName:this.booksTable,
      Key:{
        bookId: bookId,
        title: old.title
      },
      UpdateExpression: "set #bookPoint = #bookPoint + :point",
      ExpressionAttributeNames:{
          '#bookPoint': "point"
      },
      ExpressionAttributeValues:{
          ":point": point
      },
      ReturnValues:"UPDATED_NEW"
  };
  const updatedBook = await this.docClient.update(params).promise() 
  console.log(updatedBook.Attributes)
  }

  async updateBookReviewCount(bookId: string, reviewCount: number) {
    console.log("Update Book Review Count : " + bookId + "   count  " + reviewCount)
    const old = await this.getBook(bookId)

    var params = {
      TableName:this.booksTable,
      Key:{
        bookId: bookId,
        title: old.title
      },
      ExpressionAttributeNames:{
          '#reviewCount': "reviewCount"
      },
      ExpressionAttributeValues:{
          ":reviewCount": 1
      },
      ReturnValues:"UPDATED_NEW"
  };
    if(reviewCount > 0) params["UpdateExpression"] = "set #reviewCount = #reviewCount + :reviewCount"
    else params["UpdateExpression"] = "set #reviewCount = #reviewCount - :reviewCount"
    const updatedBook = await this.docClient.update(params).promise() 
    console.log(updatedBook.Attributes)
  }

  async getBook(bookId: string): Promise<BookItem> {
    const result = await this.docClient.query({
      TableName: this.booksTable,
      KeyConditionExpression: 'bookId = :bookId',
      ExpressionAttributeValues: {
        ':bookId': bookId
      }
    }).promise()
    if (result.Items.length === 0) return null
    return result.Items[0] as BookItem
  }
}
