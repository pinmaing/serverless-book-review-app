/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateBookReviewRequest {
  bookId: string
  title: string
  comment: string
  point: number
}
