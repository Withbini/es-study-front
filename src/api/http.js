import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_API,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default instance;