import { Container } from '@mui/material'
import PostForm from '../components/post/PostForm'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { createPostThunk } from '../features/postSlice'

const PostCreatePage = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const handleSubmit = useCallback(
      (postData) => {
         dispatch(createPostThunk(postData))
            .unwrap()
            .then(() => {
               navigate('/board')
            })
            .catch((error) => {
               console.error('게시물 등록 에러', error)
               alert('게시물 등록 실패')
            })
      },
      [dispatch, navigate]
   )

   return (
      <Container maxWidth="md">
         <h1>게시물 등록</h1>
         <PostForm onSubmit={handleSubmit} />
      </Container>
   )
}

export default PostCreatePage
