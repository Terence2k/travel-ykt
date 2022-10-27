import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/settlement-service/public/api/fund/`
// 查询旅行社资金信息
export function findTravelFund(data: any) {
  return request({
    url: `${commonPart}findTravelFund`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 充值
export function recharge(data: any) {
  return request({
    url: `${commonPart}recharge`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 查询旅行社流水列表
export function findCapitalDetailedList(data: any) {
  return request({
    url: `${commonPart}findCapitalDetailedList`,
    method: 'post',
    data,
    showLoading: true
  });
}