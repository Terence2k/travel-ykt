import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/customer-service/public/api/sys/audit/model/`

// 查询审核模板列表
export function getAuditList(data: any) {
  return request({
    url: `${commonPart}list`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 修改审核流程
export function AuditUpdate(data: any) {
  return request({
    url: `${commonPart}update`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 查询审核模板详情
export function AuditDetail(id: any) {
  return request({
    url: `${commonPart}detail/${id}`,
    method: 'get',
  });
}
// 查询系统部门角色
export function getBusinessTypeRole() {
  return request({
    url: `${commonPart}getBusinessTypeRole`,
    method: 'get',
  });
}