// import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserPrivate = ({children}) => {

  // const token = useSelector(state => state.auth.token)
  const token = localStorage.getItem('userToken')
  if (!token) {

    return <Navigate to={'/'}/>
  }
  return children
}

export default UserPrivate