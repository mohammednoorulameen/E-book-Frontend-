
import './App.css'
import AdminRouter from './Routers/AdminRouter'
import UserRouter from './Routers/UserRouter'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'


const routes = [...UserRouter,...AdminRouter];
const router = createBrowserRouter(routes)




 function App() {
// console.log('``', `${import.meta.env.BACKENDURL}`)
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
 }

 export default App

 

// function App() {


//   return (
//     <>
//       <div>
//       <BrowserRouter>
//         <Routes>

//           <Route  path='/*' element={< UserRouter />} />
//           <Route  path='/admin/*' element={< AdminRouter />} />

//         </Routes>
//        </BrowserRouter>
//       </div>
//     </>
//   )
// }

// export default App


