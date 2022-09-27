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
