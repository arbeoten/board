import { Link } from 'react-router-dom'
import dayjs from 'dayjs' //날짜 시간 포맷해주는 패키지
import styled from 'styled-components'

const StyledTd = styled.td`
   text-align: center;
   padding: 8px;
`

const PostItem = ({ post, isAuthenticated, user }) => {
   return (
      <tr>
         <StyledTd>
            <img src={`${process.env.REACT_APP_API_URL}${post.img}`} height={'100px'} alt="이미지"></img>
         </StyledTd>
         <StyledTd>{post.id}</StyledTd>
         <StyledTd>
            <Link to={`/posts/view/${post.id}`}>{post.title}</Link>
         </StyledTd>
         <StyledTd>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}</StyledTd>
         <StyledTd>
            <Link to={`/mypage/${post.User.id}`}>{post.User.nick}</Link>
         </StyledTd>
      </tr>
   )
}
export default PostItem
