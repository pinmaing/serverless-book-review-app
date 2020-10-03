import {ReviewItem} from './ReviewItem'
export interface ReviewItemList {
  reviewItems: ReviewItem[],
  lastEvaluatedKey?: any
}
