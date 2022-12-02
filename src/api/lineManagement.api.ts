import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/travel-agency-service/public/api/line/`
// 根据父级code_value查询子级字典 
export function dropDownQueryListChildByCodeValue(codeValue: string) {
  return request({
    url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChildByCodeValue?codeValue=${codeValue}`,
    method: 'post',
    showLoading: true
  });
}
// 线路列表查询
export function selectIndividualLineList(data: any) {
  return request({
    url: `${commonPart}selectIndividualLineList`,
    data,
    method: 'post',
    showLoading: true
  });
}
// 创建散客拼团线路（无需审核）
export function createIndividualLineAdmin(data: any) {
  return request({
    url: `${commonPart}createIndividualLineAdmin`,
    data,
    method: 'post',
    showLoading: true
  });
}
// 创建散客拼团线路（需审核）
export function createIndividualLine(data: any) {
  return request({
    url: `${commonPart}createIndividualLine`,
    data,
    method: 'post',
    showLoading: true
  });
}
// 散客线路修改（管理修改，无需审核）
export function editIndividualLineAdmin(data: any) {
  return request({
    url: `${commonPart}editIndividualLineAdmin`,
    data,
    method: 'post',
    showLoading: true
  });
}
// 提交散客线路修改（旅行社超管，需审核）
export function editIndividualLine(data: any) {
  return request({
    url: `${commonPart}editIndividualLine`,
    data,
    method: 'post',
    showLoading: true
  });
}
// 查看散客拼团线路详情
export function findIndividualLineById(oid: string | number) {
  return request({
    url: `${commonPart}findIndividualLineById?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}
// 线路审核数据对比接口
export function auditIndividualLineInformationContrast(oid: string | number) {
  return request({
    url: `${commonPart}auditIndividualLineInformationContrast?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}
// 下拉获取线路
export function selectIndividualLineDropdown() {
  return request({
    url: `${commonPart}selectIndividualLineDropdown`,
    method: 'post',
    showLoading: true
  });
}