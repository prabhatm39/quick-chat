import { useDispatch, useSelector } from "react-redux";
import { setAllChats, setSelectedChats } from "../../../redux/userSlice";
import { createNewMessage, getAllMessage } from "../../../apiCalls/message";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import moment from 'moment';
import {clearUnreadMessageCount} from './../../../apiCalls/chat';
import store from '../../../redux/store';
import EmojiPicker from 'emoji-picker-react';

function ChatArea({socket}){
    const dispatch = useDispatch();
    const  {seletedChat, user, allChats } = useSelector(state => state.userReducer);
    const [message, setMessage] = useState('');
    const [allMessage, setAllMessage]= useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    
   
    
    
    
    const selectedUser = seletedChat.members.find((ab) => ab._id != user._id);
 

    
    
    const sendMessage = async(image) =>{
        let newMessage = {
            chatId: seletedChat._id,
            sender: user._id,
            text: message,
            image: image
        }
        
        try{
            socket.emit('send-message', {
                ...newMessage,
                members: seletedChat.members.map(m => m._id),
                read: false,
                createdAt: moment().format('DD-MM-YYYY hh:mm:ss')
            })
           
         
            const response = await createNewMessage(newMessage);
          
            if(response.success){
                setMessage('');
                setShowEmojiPicker(false);
            }


        }
        catch(error){
          
            toast.error(error.message);
        }
    }
    


    const getAllMessages = async() =>{

       
        try{
           
            dispatch(showLoader());
            const response = await getAllMessage(seletedChat._id);
            dispatch(hideLoader());
           
            
            if(response.success){
                setAllMessage(response.data);
            }


        }
        catch(error){
            dispatch(hideLoader());
            toast.error(error.message);
        }
    }

    const formatTime = (timestamp) => {
        const now = moment();
        const diff = now.diff(moment(timestamp), 'days');

        if(diff< 1){
            return `Today ${moment(timestamp).format('hh:mm A')}`
        }
        else if(diff == 1){
            return `Yesterday ${moment(timestamp).format('hh:mm A')}`
        }
        else{
             return moment(timestamp).format('MMM D,hh:mm A')
        }

    };



    
function formatName(user){
    let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
    let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
}





const cleaerUnreadMessages = async() =>{

       
    try{
       
       socket.emit('clear-unread-message', {
        chatId: seletedChat._id,
        members: seletedChat.members.map(m => m._id)
       })
        const response = await clearUnreadMessageCount(seletedChat._id);
        
        
        if(response.success){
            allChats.map((chat) => {
                if(chat._id == seletedChat._id){
                    return response.data
                }
                return chat;
            })
        }


    }
    catch(error){
        dispatch(hideLoader());
        toast.error(error.message);
    }
}



const sendImage =async (e) =>{
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);

    reader.onloadend = async () =>{
        sendMessage(reader.result);
    }
}





useEffect(()=>{
    getAllMessages();
    if(seletedChat?.lastMessage?.sender !== user._id){
       
        cleaerUnreadMessages();

    }

    socket.off('receive-message').on('receive-message', (message) => {
        const selectedChat = store?.getState().userReducer.seletedChat;
        // console.log("store", selectedChat);
        
        // const selectedChat = stores?.userReducer?.seletedChat;
        if(selectedChat._id == message.chatId){
            setAllMessage(prevmsg => [...prevmsg, message]);
        }
        if(selectedChat._id==message.chatId && message.sender !== user._id){
            cleaerUnreadMessages();
        }
        
        
    })

    socket.on('clear-unread-message', data=> {
        const selectedChat = store.getState().userReducer.seletedChat;
        const allChat = store.getState().userReducer.allChats;
       

        if(selectedChat._id == data.chatId){
           const updatedChats = allChat.map(chat => {
                if(chat._id == data.chatId){
                    return {...chat, unreadMessageCount: 0}
                }
                return chat;
            })
           
            dispatch(setAllChats(updatedChats));

            setAllMessage(prvMsg => {
                return prvMsg.map(msg => {
                    return {...msg, read:true}
                })
            })
        }
    })
    
},[seletedChat])


useEffect(() =>{
    const msgContainer = document.getElementById("main-chat-area");
    msgContainer.scrollTop = msgContainer.scrollHeight;
},[allMessage])
    
    
    return(
        <>
        {seletedChat &&  
        <div className="app-chat-area">
                <div className="app-chat-area-header">    
               
                {formatName(selectedUser)}
                </div>
       
       






       
                <div className="main-chat-area" id="main-chat-area">
                    {allMessage.map((msg) => {
                        const isCurrentUserSender = msg.sender === user._id;
                        return(
                            <div className="message-container" style={isCurrentUserSender ? {justifyContent: 'end'} : {justifyContent: 'start'}}>
                            <div>
                            <div className={isCurrentUserSender? "send-message" : "received-message"}>
                                <div>
                                {msg.text}
                                </div>
                                <div>
                                    {msg.image && <img src={msg.image} alt="image"  height='120' width='120' />}
                                </div>
                                
                                </div>
                            <div className='message-timestamp' style={isCurrentUserSender? {float:'right'} : {float:'left'}}>
                               
                                {formatTime(msg.createdAt)} {isCurrentUserSender && msg.read &&
                                <i className="fa fa-check-circle" aria-hidden='true' style={{color: '#e74c3c'}}></i>
                                }
                                </div>
                            </div>
                            </div>
                        )
                      
                    })}

                  
                     
                </div>








{showEmojiPicker && <div style={{width: '100%', display: 'flex', padding: '0px 20px', justifyContent: 'right'}}>
    <EmojiPicker onEmojiClick={(e) => 
        setMessage(message + e.emoji)
    }></EmojiPicker>
</div> }






  <div className="send-message-div">
    <input type="text" className="send-message-input" placeholder="Type a message"
    value={message}
    onChange={(e) => setMessage(e.target.value)
     
    }

    
    />

<label for='file'>
<i className="fa fa-picture-o send-image-btn"></i>
<input type="file" id='file' style={{display:'none'}} accept="image/jpg,image/png, image/gif" 
onChange={sendImage}/>
</label>




<button className="fa fa-smile-o send-emoji-btn" aria-hidden="true"
    onClick={() => {setShowEmojiPicker(!showEmojiPicker)}}
    ></button>

    <button className="fa fa-paper-plane send-message-btn" aria-hidden="true"
    onClick={() => sendMessage('')}
    ></button>
</div>
</div>}
        </>
       
    )
}

export default ChatArea;