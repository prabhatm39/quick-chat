import React, { useEffect, useState } from 'react';
import Header from './component/header';
import Sidebar from './component/sidebar';
import {io} from 'socket.io-client';

import ChatArea from './component/chat';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:5000');

const Home = () => {
  const {seletedChat, user} = useSelector(state => state.userReducer);
  const [onlineUsers, setOnlineUser] = useState([]); 
  
  useEffect(() =>{
    if(user){
      socket.emit('join-room', user._id);
      socket.emit('user-login', user._id);
      socket.on('online-user', onlineusers =>{
        setOnlineUser(onlineusers);
        
      })

      socket.on('onlie-user-updated', onlineusers =>{
        setOnlineUser(onlineusers);
        
      })

      

     
    }

    
   
    
  },[user, onlineUsers])


  
  
  
  return (
    <div className="home-page">
     <Header socket={socket}/>
    <div className="main-content">
        <Sidebar socket={socket} onlineUsers={onlineUsers}/>
        {seletedChat && <ChatArea socket ={socket} />}
        
    </div>
</div>
  )
}

export default Home