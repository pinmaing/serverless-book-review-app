import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { ReviewItem } from '../models/ReviewItem'
import {ReviewItemList} from '../models/ReviewItemList'
import { ReviewUpdate } from '../models/ReviewUpdate'

export class ReviewAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly reviewsTable = process.env.REVIEW_TABLE,
    private readonly bookIdIndex = process.env.REVIEW_BOOK_ID_INDEX,
    private readonly userIdIndex = process.env.REVIEW_USER_ID_INDEX,
    private readonly likeCountIndex = process.env.REVIEW_LIKE_COUNT_INDEX,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET) {
  }

  async getAllReviewsByBookId(bookId: string,limit: number, nextKey: String): Promise<ReviewItemList> {
    const result = await this.docClient.query({
      TableName: this.reviewsTable,
      IndexName : this.bookIdIndex,
      Limit: limit,
      ExclusiveStartKey: nextKey,
      KeyConditionExpression: 'bookId = :bookId',
      ExpressionAttributeValues: {
          ':bookId': bookId
      },
      ExpressionAttributeNames: {
        '#reviewTitle': "title",
        '#reviewComment': "comment"
      },
      ProjectionExpression: 
        "reviewId, bookId, createDate, #reviewTitle, #reviewComment, attachmentUrl, point"
      
    }).promise()

    const items = result.Items as ReviewItem[]
    const lastEvaluatedKey = result.LastEvaluatedKey
    let reviewItemList : ReviewItemList = {
      reviewItems: items,
      lastEvaluatedKey: lastEvaluatedKey
    }
    return reviewItemList
  }

  async getAllReviewsByUserId(userId: string,limit: number, nextKey: String): Promise<ReviewItemList> {
    const result = await this.docClient.query({
      TableName: this.reviewsTable,
      IndexName : this.userIdIndex,
      Limit: limit,
      ExclusiveStartKey: nextKey,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      },
      ExpressionAttributeNames: {
        '#reviewTitle': "title",
        '#reviewComment': "comment"
      },
      ProjectionExpression: 
        "reviewId, bookId, createDate, #reviewTitle, #reviewComment, attachmentUrl, point, likeCount, DisLikeCount"
      
    }).promise()

    const items = result.Items as ReviewItem[]
    const lastEvaluatedKey = result.LastEvaluatedKey
    let reviewItemList : ReviewItemList = {
      reviewItems: items,
      lastEvaluatedKey: lastEvaluatedKey
    }
    return reviewItemList
  }

  async createReview(review: ReviewItem): Promise<ReviewItem> {
    await this.docClient.put({
      TableName: this.reviewsTable,
      Item: review
    }).promise()

    return this.getReview(review.userId,review.reviewId);
  }

  async updateReview(review: ReviewUpdate,userId: string, reviewId: string) {
    var params = {
      TableName:this.reviewsTable,
      Key:{
        userId: userId,
        reviewId: reviewId
      },
      UpdateExpression: "set #reviewTitle = :reviewTitle, #reviewComment=:reviewComment",
      ExpressionAttributeNames:{
          '#reviewTitle': "title",
          '#reviewComment': "comment"
      },
      ExpressionAttributeValues:{
          ":reviewTitle": review.title,
          ":reviewComment": review.comment
      },
      ReturnValues:"UPDATED_NEW"
  };
    await this.docClient.update(params).promise()
  }

  async increaseReviewLike(userId: string, reviewId: string) {
    var params = {
      TableName:this.reviewsTable,
      Key:{
        userId: userId,
        reviewId: reviewId
      },
      UpdateExpression: "set likeCount= likeCount + 1",
      ReturnValues:"UPDATED_NEW"
  };
    await this.docClient.update(params).promise()
  }

  async increaseReviewDisLike(userId: string, reviewId: string) {
    var params = {
      TableName:this.reviewsTable,
      Key:{
        userId: userId,
        reviewId: reviewId
      },
      UpdateExpression: "set disLikeCount= disLikeCount + 1",
      ReturnValues:"UPDATED_NEW"
  };
    await this.docClient.update(params).promise()
  }

  async deleteReview(userId: string, reviewId: string): Promise<ReviewItem> {
    var params = {
      TableName: this.reviewsTable,
      IndexName : this.userIdIndex,
      Key: {
        userId: userId,
        reviewId: reviewId
      },
      ReturnValues:"ALL_OLD"
  };
  
    const result = await this.docClient.delete(params).promise()
    console.log(" Return Value " + result.Attributes)
    return result.Attributes as ReviewItem
  }

  async getReview(userId: string, reviewId: string): Promise<ReviewItem> {
    const result = await this.docClient.query({
      TableName: this.reviewsTable,
      IndexName : this.userIdIndex,
      KeyConditionExpression: 'userId = :userId and reviewId = :reviewId ',
      ExpressionAttributeValues: {
        ':reviewId': reviewId,
        ':userId': userId
      },
      ExpressionAttributeNames: {
        '#reviewTitle': "title",
        '#reviewComment': "comment"
      },
      ProjectionExpression: 
        "reviewId, bookId, createDate, #reviewTitle, #reviewComment, attachmentUrl, point, likeCount, DisLikeCount"
      
    }).promise()
    if (result.Items.length === 0) return null
    return result.Items[0] as ReviewItem
  }
  

  async updateAttachmentURLReview(userId: string,reviewId: string) {
    var params = {
      TableName:this.reviewsTable,
      IndexName : this.userIdIndex,
      Key:{
        userId: userId,
        reviewId: reviewId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues:{
          ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${reviewId}`
      },
      ReturnValues:"UPDATED_NEW"
  };
    await this.docClient.update(params).promise()
  }
}
