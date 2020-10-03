import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class ReviewFileAccess {

  constructor(
    private readonly s3 = new XAWS.S3({
      signatureVersion: 'v4'
    }),
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)) {
  }

  async getUploadUrl(reviewId: string): Promise<string> {
    const key = "review/"+reviewId
    const url = await this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: this.urlExpiration
    })

    return url
  }

  async deleteAttachment(reviewId: string) {
    const key = "review/"+reviewId
    var params = {  Bucket: this.bucketName, Key: key };
    await this.s3.deleteObject(params).promise()
  }
}
