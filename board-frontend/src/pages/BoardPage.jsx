import Board from '../components/auth/Board'

function BoardPage({ isAuthenticated, user }) {
   return (
      <>
         <Board isAuthenticated={isAuthenticated} user={user}></Board>
      </>
   )
}

export default BoardPage
