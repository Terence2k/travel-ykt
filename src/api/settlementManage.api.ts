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
export async function deleteProductRule(id: number) {
	return request({
		url: `${commonPath}/settlement-service/public/api/product-rule/delete/${id}`,
		method: 'delete',
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
// 编辑综费产品
export async function comprehensiveFeeUpdate(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/update`,
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
