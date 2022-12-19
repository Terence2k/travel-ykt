import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/travel-agency-service/public/api/single/`
// 分页查询单项合同列表
export function selectSingleContractList(data: any) {
  return request({
    url: `${commonPart}selectSingleContractList`,
    method: 'post',
    data,
    showLoading: false
  });
}
// 新建单项合同
export function createSingleContract(data: any) {
  return request({
    url: `${commonPart}createSingleContract`,
    method: 'post',
    data,
    showLoading: false
  });
}
// 查看单项合同详情
export function getSingleContractDetails(oid: number) {
  return request({
    url: `${commonPart}selectSingleContractList?oid=${oid}`,
    method: 'post',
    showLoading: false
  });
}
// 撤销单项合同
export function revokeSingleContract(oid: number) {
  return request({
    url: `${commonPart}revokeContract?oid=${oid}`,
    method: 'post',
    showLoading: false
  });
}
// 发布单项合同
export function releaseSingleContract(oid: number) {
  return request({
    url: `${commonPart}releaseContract?oid=${oid}`,
    method: 'post',
    showLoading: false
  });
}
// 修改草稿单项合同
export function editSingleContract(data: any) {
  return request({
    url: `${commonPart}editSingleContract`,
    method: 'post',
    data,
    showLoading: false
  });
}
