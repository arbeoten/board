import { Container } from '@mui/material'
import PostForm from '../components/post/PostForm'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { fetchPostByIdThunk, updatePostThunk } from '../features/postSlice'
import { useParams } from 'react-router-dom'

const PostEditPage = () => {
   const { id } = useParams()
   const dispatch = useDispatch()
   const { post, loading, error } = useSelector((state) => state.posts)
   const handleSubmit = useCallback(
      (postData) => {
         dispatch(updatePostThunk({ id, postData }))
            .unwrap()
            .then(() => {
               window.location.href = `/posts/view/${id}`
            })
            .catch((error) => {
               console.error('게시물 수정 실패 : ', error)
               alert('게시물 수정에 실패했습니다.')
            })
      },
      [dispatch, id]
   )

   //게시물 데이터 불러오기
   useEffect(() => {
      dispatch(fetchPostByIdThunk(id))
   }, [dispatch, id])

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러발생 : {error}</p>

   return (
      <Container maxWidth="md">
         <h1>게시물 수정</h1>
         {post && <PostForm onSubmit={handleSubmit} initialValues={post} />}
      </Container>
   )
}

export default PostEditPage
