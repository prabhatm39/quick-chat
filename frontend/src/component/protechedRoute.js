import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getLoggedUser, getAllUsers} from '../apiCalls/unser';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import toast from 'react-hot-toast';
import { setAllChats, setAllUser, setUser } from '../redux/userSlice';
import { getAllChat } from '../apiCalls/chat';


function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const {user}= useSelector(state => state.userReducer);
    const dispatch = useDispatch();


    const getloggedInUser =async () => {
        let response = null;
        try{
            dispatch(showLoader());
           response = await getLoggedUser();
           dispatch(hideLoader());
           if(response.success){
            dispatch(setUser(response.data));
            
            
           }
           else{
            
            toast.error( response.message);
            navigate('/login');
           }
        }
        catch(error){
            
            dispatch(hideLoader());
            navigate('/login')
        }
    }




    const getAllUser =async () =>{
        let response = null;
        try{
            dispatch(showLoader());
           response = await getAllUsers();
           dispatch(hideLoader());
           if(response.success){
            dispatch(setAllUser(response.data));
           
            
           }
           else{
           
            toast.error( response.message);
            navigate('/login');
           }
        }
        catch(error){
          
            dispatch(hideLoader());
            navigate('/login')
        }
    }



    const getCurrentUserChat =async () =>{
       
        try{
           const response = await getAllChat();
          
            
            if(response.success){
              
                
                dispatch(setAllChats(response.data));
            }
            else{
                navigate('/login')
            }
        }
        catch(error){

            navigate('/login')
        }
    }


    useEffect(() => {
        // Check if user is authenticated
        if (localStorage.getItem('token')) {
            getloggedInUser();
            getAllUser();
            getCurrentUserChat();
        }
        else{
            navigate('/login');
        }

    }, []); // Added dependency array to prevent infinite re-renders

    return <>
  
    {children}
    </>; // Render children if authenticated
}

export default ProtectedRoute;
