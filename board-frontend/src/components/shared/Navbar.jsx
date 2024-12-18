import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUserThunk } from '../../features/authSlice'

const Navbar = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = useCallback(() => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            navigate('/')
         })
         .catch((error) => {
            alert(error)
         })
   }, [dispatch, navigate])
   return (
      <>
         <Link to="/">
            <p>홈</p>
         </Link>
         <Link to="/board">게시판</Link>
         {isAuthenticated ? (
            <>
               <p> {user?.nick} 님</p>
               <button onClick={handleLogout}>로그아웃</button>
            </>
         ) : (
            <p>로그인해주세요</p>
         )}
         <hr></hr>
      </>
   )
}

export default Navbar
