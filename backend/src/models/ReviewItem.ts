export interface ReviewItem {
  reviewId: string
  bookId: string
  userId: string
  title: string
  comment: string
  createDate: string
  point: number
  likeCount: number
  disLikeCount: number
  attachmentUrl?: string
}
