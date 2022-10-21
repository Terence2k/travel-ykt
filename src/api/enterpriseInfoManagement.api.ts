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
// 根据id查询企业信息
export function getCompanyInformation(id: any) {
  return request({
    url: `/customer-service/public/api/company/getCompanyInformation?oid=${id}`,
    method: 'post',
    showLoading: true
  });
}