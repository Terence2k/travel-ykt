import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/travel-agency-service/public/api/store/`
// 散客门店列表
export function selectIndividualStoreList(data: any) {
  return request({
    url: `${commonPart}selectIndividualStoreList`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 根据id查询门店详情
export function findIndividualStoreById(oid: string | number) {
  return request({
    url: `${commonPart}findIndividualStoreById?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}
// 创建门店(旅行社超管，需审核)
export function createIndividualStore(data: any) {
  return request({
    url: `${commonPart}createIndividualStore`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 创建门店(管理添加，无需审核)
export function createIndividualStoreAdmin(data: any) {
  return request({
    url: `${commonPart}createIndividualStoreAdmin`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 提交散客门店信息修改（旅行社超管）
export function editIndividualStore(data: any) {
  return request({
    url: `${commonPart}editIndividualStore`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 提交散客门店信息修改（管理修改，无需审核）
export function editIndividualStoreAdmin(data: any) {
  return request({
    url: `${commonPart}editIndividualStoreAdmin`,
    method: 'post',
    data,
    showLoading: true
  });
}
// 信息审核前后数据对比
export function auditIndividualStoreInformationContrast(oid: string | number) {
  return request({
    url: `${commonPart}auditIndividualStoreInformationContrast?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}