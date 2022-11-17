import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/travel-agency-service/public/api/storeUser/`
const commonPart1 = `${commonPath}/customer-service/public/api/sys-role/`
// 分页查询散客门店用户列表
export function selectIndividualStoreUserList(data: any) {
  return request({
    url: `${commonPart}selectIndividualStoreUserList`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 获取中心操作员和门店操作员
export function centerAndOutletOperator() {
  return request({
    url: `${commonPart1}centerAndOutletOperator`,
    method: 'get',
    showLoading: true
  });
}
// 创建散客门店用户
export function createIndividualStoreUser(data: any) {
  return request({
    url: `${commonPart}createIndividualStoreUser`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 散客门店用户信息修改
export function editIndividualStoreUser(data: any) {
  return request({
    url: `${commonPart}editIndividualStoreUser`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 查看散客门店用户详情
export function findIndividualStoreUserById(oid: string | number) {
  return request({
    url: `${commonPart}findIndividualStoreUserById?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}
// 查看审核信息对比接口
export function auditIndividualStoreUserInformationContrast(oid: string | number) {
  return request({
    url: `${commonPart}auditIndividualStoreUserInformationContrast?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}
// 审核散客门店用户（旅游局）
export function auditIndividualStoreUser(data: any) {
  return request({
    url: `${commonPart}auditIndividualStoreUser`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 审核信息修改(旅游局)
export function auditIndividualStoreUserInformation(data: any) {
  return request({
    url: `${commonPart}auditIndividualStoreUserInformation`,
    method: 'post',
    data,
    showLoading: true
  });
}