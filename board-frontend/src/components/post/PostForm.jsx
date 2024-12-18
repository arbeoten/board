import React, { useState, useCallback } from 'react'
import { TextField, Button, Box } from '@mui/material'

const PostForm = ({ onSubmit, initialValues = {} }) => {
   const [imgUrl, setImgUrl] = useState(initialValues.img ? process.env.REACT_APP_API_URL + initialValues.img : '')
   const [imgFile, setImgFile] = useState(null) // 이미지 파일 객체
   const [content, setContent] = useState(initialValues.content || '') // 게시물 내용
   const [title, setTitle] = useState(initialValues.title || '') // 게시물 내용
   // 이미지 파일 미리보기
   const handleImageChange = useCallback((e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return // 파일이 없을 경우 함수 종료

      setImgFile(file) // 업로드한 파일 객체를 state에 저장
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
         setImgUrl(event.target.result)
      }
   }, [])

   const handleSubmit = useCallback(
      (e) => {
         e.preventDefault()
         if (!content.trim()) {
            alert('내용을 입력하세요')
            return
         }
         if (!imgFile && !initialValues.id) {
            alert('이미지 파일을 추가하세요')
            return
         }
         if (!title) {
            alert('제목을 추가하세요')
            return
         }
         const formData = new FormData() // 폼 데이터를 쉽게 생성하고 전송할 수 있도록 하는 객체
         formData.append('content', content)
         formData.append('title', title)
         // 한글 처리용 인코딩
         if (imgFile) {
            // 파일명 인코딩(한글 파일명 깨짐 방지)
            const encodedFile = new File([imgFile], encodeURIComponent(imgFile.name), { type: imgFile.type })

            formData.append('img', encodedFile) //이미지 파일 추가
         }
         onSubmit(formData) // formData 객체 전송
      },
      [content, imgFile, title, onSubmit, initialValues.id]
   )
   return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label">
            이미지 업로드
            <input type="file" name="img" accept="image/*" hidden onChange={handleImageChange} />
         </Button>

         {imgUrl && (
            <Box mt={2}>
               <img src={imgUrl} alt="업로드 이미지 미리보기" style={{ width: '400px' }} />
            </Box>
         )}

         {/* 게시물 제목 입력 필드 */}
         <TextField label="게시물 제목" variant="outlined" fullWidth multiline rows={4} value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} />

         {/* 게시물 내용 입력 필드 */}
         <TextField label="게시물 내용" variant="outlined" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mt: 2 }} />

         {/* 등록 / 수정 버튼 */}
         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {/* {submitButtonLabel} */}
            등록
         </Button>
      </Box>
   )
}

export default PostForm
