import request from "../../utils/request"

// 获取 报警接收人
export function ListReceiver(params) {
  return request({
    url: '/api/receiver',
    params:params,
    method: 'GET',
  })
}
// 添加 报警接收人
export function CreateReceiver(params) {

  return request({
    url: '/api/receiver',
    data:params,
    method: 'POST',
  })
}
// 修改 报警接收人
export function UpdateReceiver(params) {
  return request({
    url: '/api/receiver',
    data:params,
    method: 'PUT',
  })
}
// 删除 报警接收人
export function DelReceiver(params) {
  return request({
    url: '/api/receiver',
    params:params,
    method: 'DELETE',
  })
}

export function searchReceiver(params) {
  return request({
    url: '/api/receiver/search',
    params:params,
  })
}
