import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import Auth from './Pages/Auth'
import Front from './Pages/Front'

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/front' element={<Front/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App