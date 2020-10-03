Books
 - bookId (Hash)
 - title (Range)
 - category
 - edition
 - publisher (Range)
 - publishDate(Range)
 - attachementUrl
 - point(Range)
 - reviewCount
 - 
ReserveBook
 - reserveId (Range)
 - userId (Hash)
 - bookId  (Range)
 - reserveDate
 - dueDate (Range)
 - returnDate
 - memo
 - status(0:close,1:ongoing)

WaitListBook
- waitListId (Range)
- userId (Hash)
- bookId (Range)
- memo
- status(0: close, 1: ongoing)

ReviewBook
- reviewId
- bookId
- userId
- createDate
- title
- comment
- attachementUrl
- point(1~5)
- likeCount
- DisLikeCount