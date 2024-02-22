/*
 * Copyright (c) 2022-2032 NOMIKY
 * 不能修改和删除上面的版权声明
 * 此代码属于NOMIKY编写，在未经允许的情况下不得传播复制
 */
import request from './request'

export function userList(params) {
  return request({
    url: '/user/list',
    method: 'post',
    data: params
  })
}

export function addUser(data) {
  return request({
    url: '/user/info',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/info',
    method: 'delete',
    params: data
  })
}
