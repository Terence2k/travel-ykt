import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/travel-agency-service/public/api/travel/`
// 旅行社信息首页
export function getTravelInformation(data: any) {
  return request({
    url: `${commonPart}getTravelInformation`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 编辑旅行社信息提交审核
export function submitInformationAudit(data: any) {
  return request({
    url: `${commonPart}submitInformationAudit`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 根据旅行社id查询入会数据
export function findTravelIdByJoinData(id: any) {
  return request({
    url: `${commonPart}findTravelIdByJoinData?tid=${id}`,
    method: 'post',
    showLoading: true
  });
}
// 集团下拉
export function findGroup() {
  return request({
    url: `${commonPart}findGroup`,
    method: 'post',
    showLoading: true
  });
}
// 旅行社申请入会
export function travelApplyJoin(data: any) {
  return request({
    url: `${commonPart}travelApplyJoin`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 旅行社申请退会
export function travelRetreat(data: any) {
  return request({
    url: `${commonPart}travelRetreat`,
    method: 'post',
    data,
    showLoading: true
  });
}