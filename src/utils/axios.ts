import router from '@/routers'
import axios from 'axios'
import { showDialog, showNotify } from 'vant'

// 创建 Axios 对象
const $axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 公共 URL
  timeout: import.meta.env.VITE_API_TIMEOUT, // 超时时间
})

// 配置请求拦截器
$axios.interceptors.request.use((config) => {
  // 添加请求头
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, (error) => {
  console.error(error)
})

// 配置响应拦截器
$axios.interceptors.response.use((response) => {
  if (typeof response.data.data === 'string') {
    showNotify({ type: 'success', message: response.data.data })
  }
  return response
}, (error) => {
  console.error(error)
  let { message } = error

  if (message.includes('Network Error')) {
    showNotify({ type: 'danger', message: '系统网络异常' })
  } else if (message.includes('timeout')) {
    showNotify({ type: 'danger', message: '系统请求超时' })
  } else if (error.response.status === 400) {
    showNotify({ type: 'warning', message: error.response.data.message })
  } else if (error.response.status === 401) {
    let message = error.response.data.message === '用户未登录' ? '登录以继续' : '登录状态已过期'
    showNotify({ type: 'warning', message: message })
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    router.push('/login').then()
  } else if (error.response.status === 403) {
    showDialog({
      title: '权限不足', message: '您没有权限访问该页面',
    }).then(() => {
      router.push('/home').then()
    })
  } else if (error.response.status === 500) {
    showNotify({ type: 'danger', message: '系统未知异常' })
  }
  return Promise.reject(error)
})

export default $axios
