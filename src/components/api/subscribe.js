import request from "../utils/request"

// 获取 订阅规则
export function ListSubscribe(params) {
  return request({
    url: '/api/subscribe',
    params:params,
    method: 'GET',
  })
}
// 添加 订阅规则
export function CreateSubscribe(params) {
  return request({
    url: '/api/subscribe',
    data:params,
    method: 'GET',
  })
}
// 修改 订阅规则
export function UpdateSubscribe(params) {
  return request({
    url: '/api/subscribe',
    data:params,
    method: 'PUT',
  })
}
// 删除 订阅规则
export function DelSubscribe(params) {
  return request({
    url: '/api/subscribe',
    data:params,
    method: 'DELETE',
  })
}
