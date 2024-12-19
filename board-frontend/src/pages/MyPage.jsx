import { Container } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProfileIdThunk } from '../features/pageSlice'

const MyPage = ({ auth }) => {
   const { id } = useParams()
   const dispatch = useDispatch()
   const { user } = useSelector((state) => state.page)

   useEffect(() => {
      dispatch(getProfileIdThunk(id))
   }, [dispatch, id])

   return (
      <>
         {user && auth && (
            <Container maxWidth="md">
               <h1>마이페이지</h1>
               <p>닉네임 : {user.nick}</p>
               <p>회원번호 : {user.id}</p>
               {auth.id === user.id && <p>본인입니다</p>}
            </Container>
         )}
      </>
   )
}
export default MyPage
