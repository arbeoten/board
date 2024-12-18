const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const { User } = require('../models')
const router = express.Router()

// 회원가입 : localhost:8000/auth/join
router.post('/join', async (req, res, next) => {
   const { nick, password } = req.body
   try {
      const exUser = await User.findOne({ where: { nick } })
      if (exUser) {
         return res.status(409).json({
            success: false,
            message: '존재하는 사용자입니다.',
         })
      }
      // 닉네임 중복 확인 통과시 새로운 계정 생성
      // 12: salt가 작동하는 임의의 데이터 10~12정도 길이 군장
      const hash = await bcrypt.hash(password, 12)

      // 새로운 사용자 생성
      const newUser = await User.create({
         nick,
         password: hash,
      })
      // 성공 응답 반환
      res.status(201).json({
         success: true,
         message: '사용자 등록 성공',
         user: {
            id: newUser.id,
            nick: newUser.nick,
         },
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, message: '회원가입중 오류 발생', err })
   }
})

router.post('/login', isNotLoggedIn, async (req, res, next) => {
   passport.authenticate('local', (authError, user, info) => {
      if (authError) {
         // 로그인 인증 중에 에러 발생시
         return res.status(500).json({ success: false, message: '인증 중 오류 발생' })
      }
      if (!user) {
         // 비밀번호 불일치 또는 사용자가 없을 경우 info.message를 사용해서 메시지 전달
         return res.status(401).json({
            success: false,
            message: info.message || '로그인 실패',
         })
      }
      // 인증이 정상적으로 되고 사용자를 로그인 상태로 바꿈
      req.login(user, (loginError) => {
         if (loginError) {
            return res.status(500).json({ success: false, message: '로그인중 오류발생' })
         }

         // 로그인 성공시 user객체와 함께 response
         res.json({
            success: true,
            message: '로그인 성공',
            user: {
               id: user.id,
               nick: user.nick,
            },
         })
      })
   })(req, res, next)
})

router.get('/logout', isLoggedIn, async (req, res, next) => {
   req.logout((err) => {
      if (err) {
         console.log(err)
         return res.status(500).json({
            success: false,
            message: '로그아웃중 오류 발생',
         })
      }
      // 로그아웃 성공시 세션에 저장되어 있던 사용자 id를 삭제하고 아래와 같은 결과를 response
      // status값 주지 않으면 기본은 200(성공)
      res.json({
         success: true,
         message: '로그아웃에 성공했습니다.',
      })
   })
})

router.get('/status', async (req, res, next) => {
   if (req.isAuthenticated()) {
      // 로그인이 되었을 때
      // req.user는 passport의 역직렬화 설정에 의해 로그인 되었을 때 로그인 한 user 정보를 가져올 수 있다
      res.json({
         isAuthenticated: true,
         user: {
            id: req.user.id,
            nick: req.user.nick,
         },
      })
   } else {
      // 로그인이 되지 않았을때
      res.json({
         isAuthenticated: false,
      })
   }
})

module.exports = router
