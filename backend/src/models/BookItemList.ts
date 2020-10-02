import {BookItem} from './BookItem'
export interface BookItemList {
  bookItems: BookItem[],
  lastEvaluatedKey?: any
}
