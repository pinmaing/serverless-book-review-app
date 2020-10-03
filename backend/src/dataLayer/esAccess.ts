import 'source-map-support/register'

import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

export class ESAccess {

  constructor(
    private readonly es = new elasticsearch.Client({
      hosts: [ process.env.ES_ENDPOINT ],
      connectionClass: httpAwsEs
    })) {
  }

  async indexReview(reviewId: string, body: {}){
    await this.es.index({
      index: 'reviews-index',
      type: 'reviews',
      id: reviewId,
      body
    })
  }
}
