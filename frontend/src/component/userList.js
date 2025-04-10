import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createNewChat } from '../apiCalls/chat';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { setAllChats, setSelectedChats } from '../redux/userSlice';
import moment from 'moment';
import { useEffect } from 'react';
import store from '../redux/store';

function UserList({searchKey, socket, onlineUsers})

{

   


    const {allUser, allChats, user: currentUser, seletedChat} = useSelector(state => state.userReducer);
    const dispatch = useDispatch();



    const startNewChat = async (searchUserId)=>{
        let response = null;

        try{
            dispatch(showLoader());
            response= await createNewChat([currentUser._id, searchUserId]);
            dispatch(hideLoader());
            if(response.success){
                toast.success(response.message);
                const newChat = response.data;
                const updatedChat = [...allChats, newChat];
                dispatch(setAllChats(updatedChat));
                dispatch(setSelectedChats(newChat));
            }

        }
        catch(error){
            
            toast.error(response.message);
            dispatch(hideLoader());
        }
    }



    
    const IsSelectedChat = (us) => {
        if(seletedChat){
            
           return seletedChat.members.map(e=>e._id).includes(us);
        }
        return false;
    }

   
    


    

    


   



    const openChat = (selectedUserId)=>{
        const chat = allChats.find((chat) =>
           chat.members.map((m) => m._id).includes(currentUser._id) 
        && chat.members.map((m) => m._id).includes(selectedUserId));
       
        
        if(chat){
            dispatch(setSelectedChats(chat))
           
        }
    }
    
  

    
const getlastMessgae = (userId) => {
    const chat = allChats.find(chat => chat.members.map((m) => m._id).includes(userId));


    if(!chat || !chat.lastMessage){
        return "";
    }
    else{
        const msgPrefix = chat?.lastMessage?.sender == currentUser._id? "You: " : "";
       return msgPrefix + chat?.lastMessage?.text?.substring(0,10);
    }
}
    

const getLastMessageTimeStamp = (userId) =>{

    const chat = allChats.find(chat => chat.members.map((m) => m._id).includes(userId));


    if(!chat || !chat?.lastMessage){
        return "";
    }
    else{
        
       return moment(chat?.lastMessage.createdAt).format('hh:mm A')
    }
}
 


function formatName(user){
    let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
    let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
}



function getData(){
    if(searchKey == ""){
        return allChats;
    }
    else{
        allUser.filter(user => {
           return (user.firstname.toLowerCase().includes(searchKey) || user.lastname.toLowerCase().includes(searchKey));
        })
    }
}


const getUnreadMessageCount = (userId) =>{
    const chat = allChats.find((chat) => 
        chat.members.map(m => m._id).includes(userId))
    // console.log("count", chat);
    
    if(chat && chat.unreadMessageCount && chat.lastMessage.sender !== currentUser._id){
        return chat.unreadMessageCount;
    }
    else{
        return "";
    }

}




useEffect(() => {
    socket.off('set-message-count').on('receive-message', (message) => {
        const selectedChat = store?.getState().userReducer.seletedChat;
        let allChat = store?.getState().userReducer.allChats;

        if(selectedChat?._id !== message.chatId){
            const updatedChat = allChat.map((chat) => {
                if(chat._id === message.chatId){
                    return({
                        ...chat,
                        unreadMessageCount: (chat?.unreadMessageCount || 0) +1,
                        lastMessage: message
                    })
                }
                return chat;
            });
            allChat = updatedChat;
        }
        //find the lastest chat
        const latestChat = allChat.find((chat) => chat._id === message.chatId);
    //get all chats after that selectected chat
    const otherChats = allChat.filter((chat) => chat._id !== message.chatId );

    // create the lastest chat array with sorting

    allChat = [latestChat, ...otherChats];


        dispatch(setAllChats(allChat));
    })
},[])



    return(

        getData()

        
        .map((obj) => {
            let user = obj;
            
            if(obj.members){
                user = obj.members.find(mem => mem._id !== currentUser._id)
            }
           
            return(

                <div className="user-search-filter" onClick={() => openChat(user._id) } key={user._id}>
                <div className={IsSelectedChat(user._id)? "selected-user" : "filtered-user"}>
                    <div className="filter-user-display">
                       {/* <img src={user.profilePic} alt="Profile Pic" className="user-profile-image">  */}
                     {user.profilePic && <img src={user.profilePic} alt="Profile Pic" className="user-profile-image" 
                     style={onlineUsers.includes(user._id) ? {border:"green 3px solid"} : {}}
                     /> }
                     {!user.profilePic &&  <div className={IsSelectedChat(user._id) ? 'user-selected-avatar' : 'user-default-avatar'}
                     style={onlineUsers.includes(user._id) ? {border:"green 3px solid"} : {}}
                     >
                           {user.firstname.charAt(0).toUpperCase()+user.lastname.charAt(0).toUpperCase()}
                        </div>}
                     
                       
                        <div className="filter-user-details">
                            <div className="user-display-name">{formatName(user)}</div>
                                <div className="user-display-email">{getlastMessgae(user._id) || user.email}</div>
                            </div>

                <div>
                <div className={getUnreadMessageCount(user._id) ? 'unread-message-counter' : ""}>
                    {getUnreadMessageCount(user._id)}
                </div>

                <div className='last-message-timestamp'>
                                {getLastMessageTimeStamp(user._id)}
                            </div>

                </div>
               

                         

                        {!allChats.find((chat) => chat.members.map((m) => m._id).includes(user._id)) &&
                          <div classNameName="user-start-chat">
                               <button className="user-start-chat-btn" onClick={() => startNewChat(user._id)}>Start Chat</button>
                          </div>}
                          



                        </div>
                    </div>                        
                </div>

            )

          

        })
       
       
       
     


    );
    
}

export default UserList;
