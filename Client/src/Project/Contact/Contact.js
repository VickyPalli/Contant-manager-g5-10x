import React, { useEffect, useState } from 'react'
import "./style.css"
import Navbar from './Navbar/Navbar'
import Main from './Main/Main'
import axios from 'axios';
import Sidebar from './Sidebar/Sidebar';
const Contact = () => {
  const [data,setdata] = useState([])
  const [get,setget] = useState(true)
  const authToken = localStorage.getItem("authorization");
  useEffect(()=>{
    axios({
     url:"https://project-server-g5-10x-1.herokuapp.com/contact",
     method:"GET",
     headers:{
      authorization: authToken
     },
     data:{}
    }).then((res)=>{
      if(res.data.length){
        setdata(res.data[0].contact)
      }
    })
 },[get])
  return (
    <div className='contact'>
      <div className='leftside'>
        <Sidebar setget = {setget} get ={get}/>
      </div>
      <div className='rightside'>
        <div className='righttop'>
            <Navbar data={data} setdata={setdata}  setget = {setget} get ={get}/>
        </div>
        <div className='main'>
          <Main data={data} setdata={setdata} setget = {setget} get ={get}/>
        </div>
      </div>
    </div>
  )
}

export default Contact
