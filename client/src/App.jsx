import { useState } from 'react'
import RegisterForm from './components/RegisterForm'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import NumberGuessingGame from './components/NumberGuessingGame'




function App() {
const appRouter =createBrowserRouter([
  {
    path:"/",
    element: <div className='w-screen h-screen flex justify-center items-center' >
    <RegisterForm/>
  </div>
  },
  {
    path:"/login",
    element:<LoginForm/>

  },
  {
    path:'/home',
    element:<NumberGuessingGame/>
  }
])

  return (
    <RouterProvider router={appRouter}/>
   
  )
}

export default App
