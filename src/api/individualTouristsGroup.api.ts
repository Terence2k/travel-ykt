import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/travel-agency-service/public/api/individual/itinerary/`

// 创建散客团（草稿）
export function createIndividualItinerary(data: any) {
  return request({
    url: `${commonPart}createIndividualItinerary`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 提交财务审核
export function individualSubmitFinanceAudit(itineraryId: number) {
  return request({
    url: `${commonPath}/travel-agency-service/public/api/itinerary/audit/individualSubmitFinanceAudit?itineraryId=${itineraryId}`,
    method: 'put',
    showLoading: true
  });
}

// 选择合同列表
export function getContractList(data: any) {
  return request({
    url: `${commonPart}getContractList`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 散客团列表
export function individualTouristsGroupList(data: any) {
  return request({
    url: `${commonPart}list`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 根据散客团id查询游客分页(变更)
export function findIndividualContractTouristById(oid: any,data:any) {
  return request({
    url: `${commonPart}findIndividualContractTouristById?oid=${oid}`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 编辑
export function editIndividualTouristsGroup(data: any) {
  return request({
    url: `${commonPart}edit`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 查询合同配置回显
export function getContractDetails(oid: number) {
  return request({
    url: `${commonPart}getContractDetails?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}
