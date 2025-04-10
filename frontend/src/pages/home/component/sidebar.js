import { useState } from "react";
import Search from "./search";
import UserList from "../../../component/userList";


function Sidebar({socket, onlineUsers}){
    const [searchKey , setSearchKey] = useState('');
return(
    <div className="app-sidebar">
    <Search searchKey={searchKey} setSearchKey={setSearchKey}/>
    <UserList searchKey={searchKey} socket={socket} onlineUsers={onlineUsers}/>
</div>
)
}

export default Sidebar;