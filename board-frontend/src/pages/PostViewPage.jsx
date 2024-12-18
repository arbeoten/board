import { Container } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback } from 'react'
import { fetchPostByIdThunk } from '../features/postSlice'
import { useParams } from 'react-router-dom'
import { Box, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Link } from 'react-router-dom'
import { deletePostThunk } from '../features/postSlice'

const PostViewPage = ({ isAuthenticated, user }) => {
   const { id } = useParams()
   const dispatch = useDispatch()

   //게시물 데이터 불러오기
   useEffect(() => {
      dispatch(fetchPostByIdThunk(id))
   }, [dispatch, id])
   const { post, loading, error } = useSelector((state) => state.posts)
   console.log(post)

   const handleBack = () => {
      window.history.back()
   }

   const onClickDelete = useCallback(
      (id) => {
         dispatch(deletePostThunk(id))
            .unwrap()
            .then(() => {
               // navigate('/') => spa방식
               window.location.href = '/board' // => 전체 페이지 새로고침
            })
            .catch((error) => {
               console.log('게시물 삭제중 오류발생 :', error)
               alert('게시물 삭제에 실패했습니다.')
            })
      },
      [dispatch]
   )

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러발생 : {error}</p>

   return (
      <>
         {post && (
            <Container maxWidth="md">
               <h1>{post.title}</h1>
               <p>{post.User.nick}</p>
               {isAuthenticated && post.User.id === user.id && (
                  <Box sx={{ p: 2 }}>
                     <Link to={`/posts/edit/${post.id}`}>
                        <button>수정</button>
                     </Link>
                     <button onClick={() => onClickDelete(post.id)}>삭제</button>
                  </Box>
               )}
               <hr></hr>
               <img src={`${process.env.REACT_APP_API_URL}${post.img}`} width={'100%'} alt="이미지"></img>
               <h2>{post.content}</h2>
               <hr></hr>
               <button onClick={handleBack}>돌아가기</button>
            </Container>
         )}
      </>
   )
}

export default PostViewPage
