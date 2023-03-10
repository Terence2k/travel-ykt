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
export function findIndividualContractTouristById(oid: any, data: any) {
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

// 查询散客团金额
export function queryIndividualTotalFee(itineraryId: number) {
  return request({
    url: `${commonPart}queryIndividualTotalFee?itineraryId=${itineraryId}`,
    method: 'get',
    showLoading: true
  });
}

// 删除散客团
export function deleteIndividualTouristsGroup(oid: number) {
  return request({
    url: `${commonPart}delete?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}

// 散客团查看详情合同列表
export function getContractListByItineraryId(itineraryId: any) {
  return request({
    url: `${commonPart}getContractListByItineraryId?itineraryId=${itineraryId}`,
    method: 'post',
    showLoading: true
  });
}

// 行程单填写/编辑过程中删除合同
export function deleteItineraryContract(data: any) {
  return request({
    url: `${commonPart}deleteItineraryContract`,
    method: 'post',
    data,
    showLoading: false
  });
}