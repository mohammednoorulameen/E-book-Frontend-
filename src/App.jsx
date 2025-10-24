
import './App.css'
import AdminRouter from './Routers/AdminRouter'
import UserRouter from './Routers/UserRouter'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const routes = [...UserRouter,...AdminRouter];
const router = createBrowserRouter(routes)




 function App() {
// console.log('``', `${import.meta.env.BACKENDURL}`)
  return (
    <>
    <RouterProvider router={router} />

    <ToastContainer
  position="bottom-center"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  theme="light"
  toastStyle={{
    borderRadius: "8px",
    background: "#ffffff",      
    color: "#000000",            
    fontSize: "13px",          
    fontWeight: 500,
    padding: "10px 14px",       
    border: "1px solid #e5e7eb",
    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
  }}
  progressStyle={{
    height: "3px",
    borderRadius: "0 0 8px 8px",
    background: "#3b82f6",        
  }}
/>

    </>
  )
 }

 export default App

 
