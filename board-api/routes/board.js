const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { User, Board } = require('../models')
const { isLoggedIn } = require('./middlewares')
const router = express.Router()

// uploads 폴더생성
try {
   fs.readdirSync('uploads')
} catch (err) {
   console.log('uploads 폴더를 새로 생성합니다')
   fs.mkdirSync('uploads')
}

const upload = multer({
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/') // uploads폴더에 저장
      },
      filename(req, file, cb) {
         const decodedFileName = decodeURIComponent(file.originalname) //파일명 디코딩(한글 파일명 깨짐 방지)
         const ext = path.extname(decodedFileName) //확장자 추출
         const basename = path.basename(decodedFileName, ext) //확장자 제거한 파일명 추출

         // 파일명 설정: 기존이름 + 업로드 날짜시간 + 확장자
         // dog.jpg
         // ex) dog + 1231342432443 + .jpg
         cb(null, basename + Date.now() + ext)
      },
   }), // 저장할 위치 지정
   limits: { fileSize: 10 * 1024 * 1024 }, // 파일의 크기 제한 (10mb)
})

// 글 등록
router.post('/', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      console.log('파일정보 : ' + req.file)
      if (!req.file) {
         return res.status(400).json({ success: false, message: '파일 업로드에 실패했습니다' })
      }

      const post = await Board.create({
         content: req.body.content,
         title: req.body.title,
         UserId: req.user.id,
         img: `/${req.file.filename}`, // 이미지 url(파일명)
      })
      res.json({
         success: true,
         post: {
            id: post.id,
            content: post.content,
            title: post.title,
            UserId: post.UserId,
            img: post.img,
         },
         message: '게시물 등록 성공',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 등록 중 오류가 발생했습니다.', error })
   }
})

// 글 수정
router.put('/:id', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      const post = await Board.findOne({ where: { id: req.params.id, userId: req.user.id } })
      if (!post) {
         return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' })
      }
      await post.update({
         title: req.body.title,
         content: req.body.content,
         img: req.file ? `/${req.file.filename}` : post.img, // 수정된 이미지 파일이 있으면 교체 없으면 기존것 사용
      })
      const updatedPost = await Board.findOne({
         where: { id: req.params.id },
         // users 테이블의 컬럼 값을 포함해서 가져옴
         include: [
            {
               model: User,
               attributes: ['id', 'nick'], // user 테이블의 id, nick 컬럼만 가져옴
            },
         ],
      })
      res.json({
         success: true,
         post: updatedPost,
         message: '게시물이 성공적으로 수정되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 수정 중 오류가 발생했습니다.', error })
   }
})
// 글 삭제
router.delete('/:id', isLoggedIn, async (req, res) => {
   try {
      // 게시물 존재 여부 확인
      const post = await Board.findOne({
         where: { id: req.params.id, UserId: req.user.id },
      })
      if (!post) {
         return res.status(400).json({ success: false, message: '게시물을 찾을 수 없습니다.' })
      }
      //게시물 삭제
      await post.destroy()
      res.json({
         success: true,
         message: '게시물이 성공적으로 삭제되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 삭제 중 오류가 발생했습니다.', error })
   }
})

// 특정 게시물 로드
router.get('/:id', async (req, res) => {
   try {
      const post = await Board.findOne({
         where: { id: req.params.id },
         include: [
            {
               model: User,
               attributes: ['id', 'nick'],
            },
         ],
      })
      if (!post) {
         return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' })
      }
      res.json({ success: true, post, message: '게시물을 성공적으로 불러왔습니다.' })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 로드 중 오류가 발생했습니다.', error })
   }
})

// 전체 게시물 로드
router.get('/', async (req, res) => {
   try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 3
      const offset = (page - 1) * limit

      const count = await Board.count()
      const posts = await Board.findAll({
         limit,
         offset,
         order: [['createdAt', 'DESC']], // 최신날짜순으로 정렬
         // 게시글을 작성한 사람과 게시글에 작성된 해시태그를 같이 가져온다
         include: [
            {
               model: User,
               attributes: ['id', 'nick'],
            },
         ],
      })
      res.json({
         success: true,
         posts,
         pagination: {
            totalPosts: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            limit,
         },
         message: '전체 게시물 리스트를 성공적으로 불러왔습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 리스트를 불러오는 중에 오류가 발생했습니다.' })
   }
})

module.exports = router
