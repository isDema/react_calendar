import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from './redux/counterSlice'
import { Calendar } from 'react-big-calendar'
import MyCalendar from './components/calendar'
import './App.css'
import SideBar from './components/sideBar'

export default function App() {


  return (
    <div className='container'>
      <div className='box1'>
        <SideBar></SideBar>
      </div>
      <div className='box2'>
        <MyCalendar></MyCalendar>
      </div>
    </div>
  )
}