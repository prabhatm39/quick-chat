
import React from 'react'
import { axiosInstance, url } from '.';

const getLoggedUser =async () => {
    try{

       const response =  await axiosInstance.get(url + '/api/user/get-logged-user');
       return response.data;

    }
    catch(error){
        return error;
    }
  return (
    <div>getLoggedUser</div>
  )
}


const getAllUsers =async () => {
  try{

     const response =  await axiosInstance.get(url + '/api/user/get-all-users');
     return response.data;

  }
  catch(error){
      return error;
  }

}





const uploadProfilePic =async (image) => {
  try{

     const response =  await axiosInstance.post(url + '/api/user/upload-profile-pic', {image});
     return response.data;

  }
  catch(error){
      return error;
  }

}


export {getLoggedUser, getAllUsers, uploadProfilePic};