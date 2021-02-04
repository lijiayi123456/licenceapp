// 封装axios
import axios from 'axios';
import { Message } from 'element-ui';

// 创建axios实例
const service = axios.create({

})

service.defaults.withCredentials = false;

// 添加拦截请求器
service.interceptors.request.use((config) => {
    return config;
},error => Promise.reject(error));

// 添加响应拦截器
service.interceptors.response.use((response)=>{
    const res = response.data;
    return res;
},({
    message,
    response
}) => {
    let messageMsg = null;
    if(response) {
        switch(response.data.status) {
            case 404:
                messageMsg = '';
                break;
            case 400:
                messageMsg = '错误的请求';
                break;
            default:
                messageMsg = response.data.message;
                break;
            
        }
    } else {
        messageMsg = message;
    }
    Message({
        message: messageMsg,
        type: 'error',
        duration: 5 * 1000,
        showClose: true,
      });
    return Promise.reject(messageMsg);
})
export default service;