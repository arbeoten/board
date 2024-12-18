const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

module.exports = () => {
   passport.use(
      new LocalStrategy(
         {
            usernameField: 'nick',
            passwordField: 'password',
         },
         async (nick, password, done) => {
            try {
               const exUser = await User.findOne({ where: { nick } })
               if (exUser) {
                  const result = await bcrypt.compare(password, exUser.password)
                  if (result) {
                     done(null, exUser) // 비밀번호 일치
                  } else {
                     done(null, false, { message: '비밀번호가 일치하지 않습니다.' })
                  }
               } else {
                  done(null, false, { message: '가입되지 않은 회원입니다.' })
               }
            } catch (err) {
               console.error(err)
               done(err)
            }
         }
      )
   )
}
