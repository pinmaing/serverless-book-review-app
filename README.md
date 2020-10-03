# Serverless Book Review

To implement this project, you need to implement a simple Book Review application using AWS Lambda and Serverless framework. Search for all comments starting with the `TODO:` in the code to find the placeholders that you need to implement.

# Functionality of the application

This application will allow fetching Book items and Review related with associated Book. And then it will also allow creating/removing/updating/fetching Review items. Each Review item can optionally have an attachment image. Each Login user has permission to fetch Book and Review related with Book and rate the review. Each login user only has permission to update/remove to Review items that he/she has created.

# REVIEW items

The application should store REVIEW items, and each REVIEW item contains the following fields:

* `reviewId` (string) - a unique id for an item
* `bookId` (string) - target bookId to create Review item
* `createDate` (string) - date and time when an item was created
* `title` (string) - title of a Review item
* `comment` (string) - comment of a Review item
* `point` (number) - point(1~5) for target book
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Review item

You might also store an id of a user who created a TODO item.


# Functions to be implemented

To implement this project, implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetBooks` - should return all available Books for everyone. A user id can be extracted from a JWT token that is sent by the frontend

* `GetBookReview` - should return all related Review for target book. A user id can be extracted from a JWT token that is sent by the frontend
* 
* `GetReviews` - should return all Reviews for a current user. A user id can be extracted from a JWT token that is sent by the frontend

* `CreateReview` - should create a new REVIEW for target book by a current user. A shape of data send by a client application to this function can be found in the `CreateBookReviewRequest.ts` file. Increase the review count and point for target book.

* `UpdateReview` - should update a REVIEW item for target book created by a current user. A shape of data send by a client application to this function can be found in the `UpdateBookReviewRequest.ts` file

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `LikeReview` - should update a REVIEW item by increasing likeCount for target review for any login user. 
The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DisLikeReview` - should update a REVIEW item by increasing disLikeCount for target review for any login user. 
The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteTodo` - should delete a REVIEW item for target book created by a current user. Reduce the review count and point for related book based on deleted REVIEW information. Expects an id of a REVIEW item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a REVIEW item.

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

Add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# DynamoDB table

To store TODO items, you might want to use a DynamoDB table with Global secondary index(es) and local secondary index(es). A DynamoDB resource like this:

```yml

ReviewsTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.REVIEWS_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.LOC_INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index
    GlobalSecondaryIndexes:
      - IndexName: ${self:provider.environment.GLO_INDEX_NAME}
        KeySchema:
        - AttributeName: partitionKey
          KeyType: HASH
        - AttributeName: indexKey
          KeyType: RANGE
        Projection:
          ProjectionType: ALL

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

# Postman collection

For Testing API, use the Postman collection that contains sample requests. Can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
