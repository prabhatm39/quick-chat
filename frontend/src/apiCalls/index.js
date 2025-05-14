

import axios from 'axios';


export const url = 'https://quick-chat-backend-j7yq.onrender.com';

export const axiosInstance = axios.create({
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

