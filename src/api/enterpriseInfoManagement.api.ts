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
// 根据id查询企业信息
export function getCompanyInformation(id: any) {
  return request({
    url: `${commonPath}/customer-service/public/api/company/getCompanyInformation?oid=${id}`,
    method: 'post',
    showLoading: true
  });
}
// 企业信息编辑（除了酒店、景区、旅行社业态）
export function editCompany(data: any) {
  return request({
    url: `${commonPath}/customer-service/public/api/company/editCompany`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 查询入会审核列表
export function findByStateTravelMembershipList(data: any) {
  return request({
    url: `${commonPart}findByStateTravelMembershipList`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 审核退入会
export function reviewRetreatApplyJoin(data: any) {
  return request({
    url: `${commonPart}reviewRetreatApplyJoin`,
    method: 'post',
    data,
    showLoading: true
  });
}