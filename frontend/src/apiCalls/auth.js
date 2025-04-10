

import { axiosInstance, url } from "./index";

export const singupUser =async (user) => {
try{
    const response = await axiosInstance.post(url + '/api/auth/singup', user);
    return response.data;
}
catch(error){
    return error
}
}

export const loginUser = async (user) => {
    try{
        const response = await axiosInstance.post(url + '/api/auth/login', user);
        return response.data;
    }
    catch(error){
        return error
    }
}
