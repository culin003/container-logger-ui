/*
 * Copyright (c) 2022-2032 NOMIKY
 * 不能修改和删除上面的版权声明
 * 此代码属于NOMIKY编写，在未经允许的情况下不得传播复制
 */
import request from './request'

export function login(params) {
  return request({
    url: '/session/info',
    method: 'POST',
    type: 'login',
    data: params
  })
}

export function logout() {
  return request({
    url: '/session/info',
    method: 'delete',
    data
  })
}
