import * as uuid from 'uuid'

import { ReviewItem } from '../models/ReviewItem'
import { ReviewItemList} from '../models/ReviewItemList'
import { ReviewAccess } from '../dataLayer/reviewsAccess'
import { ReviewFileAccess } from '../dataLayer/reviewsFileAccess'
import {BookAccess} from '../dataLayer/booksAccess'
import { CreateBookReviewRequest } from '../requests/CreateBookReviewRequest'
import { UpdateBookReviewRequest } from '../requests/UpdateBookReviewRequest'

const reviewAccess = new ReviewAccess()
const reviewFileAccess = new ReviewFileAccess()
const bookAccess = new BookAccess()

export async function getAllReviews(userId: string,limit: number, nextKey: String) : Promise<ReviewItemList> {
  return reviewAccess.getAllReviewsByUserId(userId,limit,nextKey)
}

export async function getBookAllReviews(bookId: string,limit: number, nextKey: String) : Promise<ReviewItemList> {
  return reviewAccess.getAllReviewsByBookId(bookId,limit,nextKey)
}

export async function createReview(
  createReviewRequest: CreateBookReviewRequest,
  userId: string, bookId: string): Promise<ReviewItem> {

  const reviewId = uuid.v4()

  const newReview = await reviewAccess.createReview({
    userId: userId,
    bookId: bookId,
    reviewId: reviewId,
    title: createReviewRequest.title,
    comment: createReviewRequest.comment,
    createDate: new Date().toISOString(),
    point: createReviewRequest.point,
    likeCount: 0,
    disLikeCount: 0
  })

  bookAccess.updateBook(bookId,newReview.point)
  bookAccess.updateBookReviewCount(bookId,1)
  return newReview

}

export async function updateReview(
  updateReviewRequest: UpdateBookReviewRequest,
  userId: string,
  reviewId: string) {

  await reviewAccess.updateReview({
    title: updateReviewRequest.title,
    comment: updateReviewRequest.comment
    }, 
    userId, 
    reviewId)
}

export async function increaseReviewLike(
  userId: string,
  reviewId: string) {

  await reviewAccess.increaseReviewLike(
    userId, 
    reviewId)
}

export async function increaseReviewDisLike(
  userId: string,
  reviewId: string) {

  await reviewAccess.increaseReviewDisLike(
    userId, 
    reviewId)
}

export async function deleteReview(
  userId: string,
  reviewId: string) {

  const delReview = await reviewAccess.deleteReview(userId, reviewId)
  if(delReview.attachmentUrl) await reviewFileAccess.deleteAttachment(delReview.reviewId)

  bookAccess.updateBook(delReview.bookId,(-delReview.point))
  bookAccess.updateBookReviewCount(delReview.bookId,(-1))
}

export async function reviewExists(
  userId: string,
  reviewId: string) {

  const result = await reviewAccess.getReview(userId, reviewId)
  return !!result
}

export async function getUploadUrl(
  userId: string,
  reviewId: string) : Promise<string> {

  await reviewAccess.updateAttachmentURLReview(userId, reviewId)
  const url = await reviewFileAccess.getUploadUrl(reviewId)
  return url
}