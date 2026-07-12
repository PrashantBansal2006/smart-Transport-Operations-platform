import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import VehicleRegistry from './pages/VehicleRegistry'

const App = () => {
  return (
    <BrowserRouter>
      <VehicleRegistry />
    </BrowserRouter>
  )
}

export default App