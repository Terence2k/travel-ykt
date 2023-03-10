import { request, commonPath } from '@/utils/index';
// 产品结算规则 ---- 保存产品结算
export async function saveProductRule(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/product-rule/save`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 产品结算规则 ---- 编辑产品结算
export async function updateProductRule(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/product-rule/update`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 综费产品列表
export async function getcomprehensiveFeeList(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/page`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 综费产品新增
export async function comprehensiveFeeAdd(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/add`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 综费产品启用
export async function comprehensiveFeeEnable(oid: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/enable/${oid}`,
		method: 'get',
		// showLoading: true,
	});
}
// 综费产品禁用
export async function comprehensiveFeeDisenable(oid: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/disenable/${oid}`,
		method: 'get',
		// showLoading: true,
	});
}
// 综费产品详情
export async function getcomprehensiveFeeDetail(oid: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/detail/${oid}`,
		method: 'get',
		showLoading: true,
	});
}
// 产品结算规则 ---- 删除产品结算
export async function deleteProductRule(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/product-rule/delete`,
		method: 'delete',
		data,
		showLoading: true,
	});
}
// 产品结算规则 ---- 产品结算详情
export async function productRuleDetail(id: number) {
	return request({
		url: `${commonPath}/settlement-service/public/api/product-rule/detail/${id}`,
		method: 'get',
		showLoading: true,
	});
}
// 产品结算规则 ---- 产品结算规则配置列表
export async function productRuleConfigList(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/product-rule/rule/list`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 编辑综费产品
export async function comprehensiveFeeUpdate(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/update`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 产品结算规则 ---- 产品结算列表
export async function productRuleList(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/product-rule/product/list`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 删除综费产品
export async function comprehensiveFeeDelete(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/delete`,
		method: 'post',
		data,
		showLoading: true,
	});
}

// 产品结算规则 ---- 产品结算列表关联景区下拉枚举数据
export async function productRuleLessInfos() {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic/lessInfos`,
		method: 'get',
		showLoading: true,
	});
}
// 产品结算规则 ---- 批量修改状态
export async function productRuleUpdateStatus(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/product-rule/update/ruleStatus`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 产品结算规则 ---- 团队类型枚举值
export async function productRuleTeamType(data: any) {
	return request({
		url: `${commonPath}/travel-agency-service/public/api/team/downTeamTypeAll`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 产品结算规则 ---- 保存产品结算
export async function saveCurrencySettlementRule(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-universal-rule/add`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 通用结算规则 ---- 编辑通用结算
export async function updateCurrencySettlementRule(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-universal-rule/update`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 通用结算规则 ---- 删除通用结算
export async function deleteCurrencySettlementRule(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-universal-rule/delete`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 通用结算规则 ---- 通用详情
export async function currencySettlementRuleDetail(id: number) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-universal-rule/detail/${id}`,
		method: 'get',
		showLoading: true,
	});
}
// 通用结算规则 ---- 通用分页查询
export async function currencySettlementRuleList(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-universal-rule/page`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 通用结算规则 ---- 启用结算规则
export async function currencySettlementEnableRule(oid: number) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-universal-rule/enable/${oid}`,
		method: 'get',
		showLoading: true,
	});
}
// 通用结算规则 ---- 禁用结算规则
export async function currencySettlementDisenableRule(oid: number) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-universal-rule/disenable/${oid}`,
		method: 'get',
		showLoading: true,
	});
}
// 查询旅行社基本信息
export async function getTravelInfo(id: any) {
	return request({
		url: `${commonPath}/travel-agency-service/public/api/itinerary/getTravelInfo/${id}`,
		method: 'get',
		showLoading: false,
	});
}
// 查询团队类型
export async function getTeamTypes() {
	return request({
		url: `${commonPath}/travel-agency-service/public/api/team/getTeamTypes`,
		method: 'get',
		showLoading: false,
	});
}
// 查询结算行程单列表 -- 行程中 已散团
export async function getItinerarySettlement(data: any) {
	return request({
		url: `${commonPath}/travel-agency-service/public/api/itinerary/getItinerarySettlement`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 查询结算行程单列表 -- 预结算 已结算 已申请转账
export async function settlementItineraryBasic(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-information/settlementItineraryBasic/list`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 企业业态字典下拉列表
export async function getPrepaidCompanyList() {
	return request({
		url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChildByCodeValue?codeValue=BUSINESS_TYPE`,
		method: 'post',
		showLoading: true,
	});
}
// 获取门店下拉列表
export async function getShopList() {
	return request({
		url: `${commonPath}/catering-service/public/api/catering-product/get-shop-list`,
		method: 'get',
		showLoading: true,
	});
}
// 获取酒店名称下拉列表
export async function getAllOpenHotelNameList() {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-information/getAllOpenHotelName`,
		method: 'get',
		showLoading: true,
	});
}
// 转账单列表
export async function getTransferAccountList(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/transfer-account/page`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 转账单列表
export async function getTransferAccountDetails(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/transfer-account/pageDetails`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 单条数据申请转账
export async function transferAccountsDetail(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/transfer-account/transferAccount`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 审核转账单
export async function transferAccountAudit(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/transfer-account/audit`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 结算管理--审核详情
export async function examineDetail(itineraryNo: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-information/itinerary/details?itineraryNo=${itineraryNo}`,
		method: 'get',
		showLoading: true,
	});
}
// 结算管理--结算明细
export async function settlementDetail(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-information/information/details`,
		method: 'post',
		data,
		showLoading: false,
	});
}
// 结算状态变更
export async function settlementUpdate(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-information/update/status`,
		method: 'post',
		data,
		showLoading: false,
	});
}
// 酒店星级下拉列表
export async function currencySettlementHotelRatedList() {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-rated/list`,
		method: 'get',
		showLoading: true,
	});
}
// 查询行程单枚举状态
export async function getItineraryStatus() {
	return request({
		url: `${commonPath}/travel-agency-service/public/api/itinerary/getItineraryStatus`,
		method: 'get',
		showLoading: false,
	});
}
// 组合对账 导出企业结算资金对账表
export async function exportReconciliation(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-information/exportReconciliation`,
		method: 'post',
		data,
		responseType: 'blob',
		showLoading: false,
	});
}
// 行程下团
export async function updateItineraryStatusEnd(data: any) {
	return request({
		url: `${commonPath}/travel-agency-service/public/api/itinerary/updateItineraryStatusEnd`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 结算行程单修改冻结状态
export async function updateFrozen(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/settlement-information/settlementItineraryBasic/updateFrozen`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 批量处理转账单页面接口
export async function transferAccountList(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/transfer-account/dealTransferAccountsList`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 批量审核转账单接口
export async function auditTransferAccounts(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/transfer-account/auditTransferAccounts`,
		method: 'post',
		data,
		showLoading: true,
	});
}
