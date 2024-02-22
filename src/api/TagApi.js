/*
 * Copyright (c) 2022-2032 NOMIKY
 * 不能修改和删除上面的版权声明
 * 此代码属于NOMIKY编写，在未经允许的情况下不得传播复制
 */
import request from './request'

export function containerList(params) {
  return request({
    url: '/container/list',
    method: 'post',
    params
  })
}

export function addContainer(data) {
  return request({
    url: '/container/info',
    method: 'post',
    data
  })
}

export function updateContainer(data) {
  return request({
    url: '/container/info',
    method: 'put',
    data
  })
}

export function deleteContainer(data) {
  return request({
    url: '/container/info',
    method: 'delete',
    data
  })
}
