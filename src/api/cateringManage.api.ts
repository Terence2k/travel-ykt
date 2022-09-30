import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/catering-service/public/api`
//基础信息
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

// 门店名称
export function getCateringStore() {
	return request({
		url: `${commonPart}/catering-product/get-shop-list`,
		method: 'get',
	});
}

export function getCateringEdit(data: any) {
	return request({
		url: `${commonPart}/catering/edit`,
		method: 'post',
		data
	});
}

export function getCateringAudit(data: any) {
	return request({
		url: `${commonPart}/catering/audit`,
		method: 'post',
		data
	});
}

// 产品
export function getProductPage(data: any) {
	return request({
		url: `${commonPart}/catering-product/page`,
		method: 'get',
        data,
	});
}

export function getProductInfo(id: any) {
	return request({
		url: `${commonPart}/catering-product/${id}`,
		method: 'get',
	});
}

export function getProductEdit(data: any) {
	return request({
		url: `${commonPart}/catering-product/save`,
		method: 'post',
		data
	});
}
