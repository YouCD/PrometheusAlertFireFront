import request from "../../utils/request"

// 获取 prometheus rule
export function fetchPrometheusRules(params) {
  return request({
    url: '/api/prometheus/rule',
    params:params,
    method: 'GET',
  })
}