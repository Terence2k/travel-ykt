import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/catering-service/public/api`

export function getCateringPage(data: any) {
	return request({
		url: `${commonPart}/catering/page`,
		method: 'get',
        data,
	});
}

export function getCateringInfo(id: any) {
	return request({
		url: `${commonPart}/catering/${id}`,
		method: 'get',
	});
}

export function getProductPage(data: any) {
	return request({
		url: `${commonPart}/catering-product/page`,
		method: 'get',
        data,
	});
}
