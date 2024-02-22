/*
 * Copyright (c) 2022-2032 NOMIKY
 * 不能修改和删除上面的版权声明
 * 此代码属于NOMIKY编写，在未经允许的情况下不得传播复制
 */
import request from './request'

export function groupList(params) {
  return request({
    url: '/group/list',
    method: 'post',
    data: params
  })
}

export function addGroup(data) {
  return request({
    url: '/group/info',
    method: 'post',
    data: data
  })
}

export function updateGroup(data) {
  return request({
    url: '/group/info',
    method: 'put',
    data: data
  })
}

export function deleteGroup(data) {
  return request({
    url: '/group/info',
    method: 'delete',
    params: data
  })
}

export function groupUsers(data) {
  return request({
    url: '/group/users',
    method: 'get',
    params: data
  })
}

export function groupContainers(data) {
  return request({
    url: '/group/containers',
    method: 'get',
    params: data
  })
}

export function addGroupContainers(data) {
  return request({
    url: '/group/containers',
    method: 'post',
    data: data
  })
}
