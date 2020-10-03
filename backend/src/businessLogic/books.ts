import { BookItemList} from '../models/BookItemList'
import { BookAccess } from '../dataLayer/booksAccess'

const bookAccess = new BookAccess()

export async function getAllBooks(limit: number, nextKey: String, orderBy: String) : Promise<BookItemList> {
  return bookAccess.getAllBooks(limit,nextKey,orderBy)
}

export async function updateBook(
  bookId: string,
  point: number) {

  await bookAccess.updateBook(
    bookId,point)
}

export async function bookExists(
  bookId: string) {

  const result = await bookAccess.getBook(bookId)
  return !!result
}
