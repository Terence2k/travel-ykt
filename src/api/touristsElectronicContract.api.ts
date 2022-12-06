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