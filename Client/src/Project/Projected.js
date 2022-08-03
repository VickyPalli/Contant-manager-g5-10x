import React from 'react'
import { Navigate } from 'react-router-dom';

const Projected = ({children}) => {
    const authToken = localStorage.getItem("authorization");
  return (
    <div>
      {authToken ? children : <Navigate to="/"/>}
    </div>
  )
}

export default Projected
