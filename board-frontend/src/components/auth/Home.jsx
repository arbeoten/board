import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { loginUserThunk } from '../../features/authSlice'
import { useNavigate } from 'react-router-dom'

function Home({ isAuthenticated, user }) {
   const [nick, setNick] = useState('')
   const [password, setPassword] = useState('')
   const [isSignupComplete, setIsSignupComplete] = useState(false) // 회원가입 완료 상태 추가
   const dispatch = useDispatch()
   const { loading, error } = useSelector((state) => state.auth)
   const navigate = useNavigate()

   const handleSignup = useCallback(() => {
      if (!nick.trim() || !password.trim()) {
         alert('모든 필드를 입력해주세요!')
         return
      }

      dispatch(registerUserThunk({ nick, password }))
         .unwrap()
         .then(() => {
            //회원가입 성공시
            setIsSignupComplete(true) //회원가입 완료 상태 true로 변경
         })
         .catch((error) => {
            //회원가입 중 에러 발생시
            console.error('회원가입 에러:', error)
         })
   }, [nick, password, dispatch])

   const handleLogin = useCallback(
      (e) => {
         e.preventDefault()
         if (nick.trim() && password.trim()) {
            dispatch(loginUserThunk({ nick: nick, password: password }))
               .unwrap()
               .then(() => navigate('/'))
               .catch((error) => console.error('로그인 실패'))
         }
      },
      [dispatch, nick, password, navigate]
   )

   return (
      <>
         {error && <>{error}</>}
         {isAuthenticated ? (
            <p>반갑습니다. {user?.nick}님</p>
         ) : (
            <>
               <p>닉네임</p>
               <input type="text" value={nick} onChange={(e) => setNick(e.target.value)} />
               <p>패스워드</p>
               <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
               <hr />
               <button onClick={handleLogin} style={{ margin: '4px' }}>
                  로그인
               </button>
               <button onClick={handleSignup} style={{ margin: '4px' }}>
                  회원가입
               </button>
            </>
         )}

         {isSignupComplete && <p>회원가입 완료</p>}
      </>
   )
}

export default Home
