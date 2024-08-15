import axios from 'axios'
import {showToast, Toast} from "vant";


// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: "/api/parking/api",
    // 超时
    timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    sessionStorage
    const token = localStorage.getItem("token");
    if (token && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, error => {
    Promise.reject(error)
});

// 响应拦截器
service.interceptors.response.use(res => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const msg = res.data.msg || '系统未知错误'
        if (code === 200) {
            return res.data;
        } else {
            if (!res.config.skipToast) {
                showToast(msg);
            }
            return Promise.reject(res.data);
        }
    },
    error => {
        const {request} = error
        if (request.status === 401) {
            localStorage.removeItem("token");
            location.reload()
        } else {
            showToast('网络错误');
            return Promise.reject(error)
        }
    }
);


export default service;
