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
