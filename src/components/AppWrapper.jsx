import React from 'react'
import ScrollToTop from './ScrollToTop'
import { Outlet } from 'react-router-dom'

const AppWrapper = () => {
  return (
    <>
      <ScrollToTop/>
      <Outlet/>
    </>
  )
}

export default AppWrapper
