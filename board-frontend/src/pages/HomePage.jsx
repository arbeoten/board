import Home from '../components/auth/Home'

function HomePage({ isAuthenticated, user }) {
   return (
      <>
         <Home isAuthenticated={isAuthenticated} user={user}></Home>
      </>
   )
}

export default HomePage
