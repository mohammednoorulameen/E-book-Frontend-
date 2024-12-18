import { Navigate } from "react-router-dom";

const AdminPrivate = ({children}) =>{
    const token = localStorage.getItem('adminToken');

    if (!token) {
        return <Navigate to={'/admin/login'}/>
    }
    return children
}

export default AdminPrivate