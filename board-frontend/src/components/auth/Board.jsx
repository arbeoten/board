import { Typography, Pagination, Stack } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../../features/postSlice'
import PostItem from '../../components/post/PostItem'
import { Link } from 'react-router-dom'

const Board = ({ isAuthenticated, user }) => {
   const [page, setPage] = useState(1) // 현재 페이지
   const dispatch = useDispatch()
   const { posts, pagination, loading, error } = useSelector((state) => state.posts)
   useEffect(() => {
      dispatch(fetchPostsThunk(page))
   }, [dispatch, page])

   // 페이지 변경
   const handlePageChange = useCallback((event, value) => {
      setPage(value)
   }, [])
   return (
      <>
         {posts.length > 0 ? (
            <>
               <table>
                  <tbody>
                     <tr>
                        <th>이미지</th>
                        <th>글번호</th>
                        <th>제목</th>
                        <th>작성일</th>
                        <th>작성자</th>
                     </tr>
                     {posts.map((post) => (
                        <PostItem key={post.id} post={post} isAuthenticated={isAuthenticated} user={user} />
                     ))}
                  </tbody>
               </table>
               <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                  <Pagination
                     count={pagination.totalPages} // 총 페이지
                     page={page} // 현재 페이지
                     onChange={handlePageChange} // 페이지 변경 함수
                  />
               </Stack>
            </>
         ) : (
            !loading && (
               <Typography variant="body1" align="center">
                  게시물이 없습니다.
               </Typography>
            )
         )}
         <Link to="/posts/create">글쓰기</Link>
      </>
   )
}
export default Board
