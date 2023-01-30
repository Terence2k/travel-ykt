import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/travel-agency-service/public/api/contract/`
// 获取健康码 
export function getHealthyCode(data: any) {
  return request({
    url: `${commonPath}/customer-service/public/api/common/health/code`,
    method: 'post',
    data,
    showLoading: false
  });
}
// 新建散客合同
export function createIndividualContract(data: any) {
  return request({
    url: `${commonPart}createIndividualContract`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 分页查询散客合同列表
export function selectIndividualContractList(data: any) {
  return request({
    url: `${commonPart}selectIndividualContractList`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 编辑前回显合同详情
export function editFindIndividualContractById(oid: number) {
  return request({
    url: `${commonPart}editFindIndividualContractById?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}
// 修改散客拼团草稿合同
export function editFindIndividualContract(data: any) {
  return request({
    url: `${commonPart}editIndividualContract`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 查看散客合同详情
export function findIndividualContractById(oid: number) {
  return request({
    url: `${commonPart}findIndividualContractById?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}
// 综费产品启用列表
export function findComprehensiveProductsList() {
  return request({
    url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/findEnableList`,
    method: 'get',
    showLoading: true
  });
}
// 撤销合同
export function revokeContract(oid: number) {
  return request({
    url: `${commonPart}revokeContract?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}
// 发布合同
export function releaseContract(oid: number) {
  return request({
    url: `${commonPart}releaseContract?oid=${oid}`,
    method: 'post',
    showLoading: true,
    timeout: 20000
  });
}
// 查询游客列表
export function findIndividualContractTourist(data: any) {
  return request({
    url: `${commonPart}findIndividualContractTourist`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 发布签署（线上合同)
export function releaseOnlineContract(data: any) {
  return request({
    url: `${commonPart}releaseOnlineContract`,
    method: 'post',
    data,
    showLoading: true
  });
}