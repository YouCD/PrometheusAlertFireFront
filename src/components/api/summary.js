import request from "../../utils/request"

// 获取 summary
export function ListSummary(params) {
  return request({
    url: '/api/summary',
    params:params,
  })
}