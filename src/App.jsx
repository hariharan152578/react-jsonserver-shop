import React from 'react'
import SideBar from './SideBar'
import Feed from './Feed'
import Suggestions from './Suggestions'
function App() {
  return (
    <div className='flex h-[100vh]'>
      <div className='w-[20%]'><SideBar></SideBar></div>
      <div className='w-[50%]'><Feed></Feed></div>
      <div className='w-[30%]'><Suggestions></Suggestions></div>
    </div>
  )
}

export default App