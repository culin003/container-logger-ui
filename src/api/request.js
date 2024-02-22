/*
 * Copyright (c) 2022-2032 NOMIKY
 * 不能修改和删除上面的版权声明
 * 此代码属于NOMIKY编写，在未经允许的情况下不得传播复制
 */
import axios from 'axios'
import router from '../router'
import { nanoid } from 'nanoid'
import GLOBAL from './GlobalVariable'

// create an axios instance
const service = axios.create({
  baseURL: GLOBAL.BASE_URL, // url = base url + request url
  // baseURL: import.meta.env.VITE_API_HOST,
  // baseURL: 'http://localhost:8080',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['RequestID'] = nanoid()

    if (config.type === 'login') {
      return config
    }

    config.headers['auth-token'] = localStorage.getItem("token")

    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    res.extraValue = {
      url: response.config.url,
      uid: response.config.headers.RequestID,
      time: new Date()
    }

    let code = typeof res.code === 'string' ? parseInt(res.code) : res.code

    // if the custom code is not 20000, it is judged as an error.
    if (code !== 200) {
      if (code === 401) {
        router.push('/login')
      }

      app.config.globalProperties.$Message.error({
        content: res.desc,
        duration: 3
      })
      return Promise.reject(res)
    } else {
      // 登录接口
      // return res
      if (response.config.type === 'login') {
        return response
      } else {
        return res
      }
    }
  },
  error => {
    const code = error.response.status

    if ((code === 401 && !error.response.config.isLogin)) {
      app.config.globalProperties.$Message.error({
        content: '会话超时，请重新登录！',
        duration: 3
      })
      router.push('/login')
    }

    app.config.globalProperties.$Message.error({
      content: error.message,
      duration: 3
    })
    return Promise.reject(error)
  }
)

export default service
