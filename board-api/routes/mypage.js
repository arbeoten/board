const express = require('express')
const router = express.Router()
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const { User } = require('../models')

router.get('/:id', isLoggedIn, async (req, res) => {
   try {
      const userId = req.params.id
      const user = await User.findOne({
         where: { id: userId },
      })
      if (!user) {
         return res.status(404).json({
            success: false,
            message: '사용자를 찾을 수 없습니다',
         })
      }
      res.json({
         success: true,
         user,
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '사용자를 불러오는데 오류가 발생했습니다.' })
   }
})

module.exports = router
