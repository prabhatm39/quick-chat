
import { axiosInstance, url } from "./index";



export const createNewMessage = async (message) =>{
    
    try{
      const  response = await axiosInstance.post(url + '/api/message/new-message', (message));
       
            // console.log("response", response);
        
            return response.data;
       
          
        
        
       

    }
    catch(error){
        return error;
    }
}




export const getAllMessage = async (chatId) =>{
    
    try{
      const  response = await axiosInstance.get(url + `/api/message/get-all-message/${chatId}`);
       
            // console.log("response", response);
        
            return response.data;
       
          
        
        
       

    }
    catch(error){
        return error;
    }
}