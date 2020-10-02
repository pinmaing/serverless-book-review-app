import {ReviewItem} from "./ReviewItem"
export interface BookItem {
  bookId: string
  title: string
  edition: string
  category: string
  publisher: string
  publishDate: string
  point: number
  attachmentUrl: string
  reviewCount: number
}
