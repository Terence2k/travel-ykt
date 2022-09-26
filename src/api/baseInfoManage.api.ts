import { request, commonPath } from '@/utils/index';

// 行政区划详情接口
export async function getPublicArea(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/area/2`,
		method: 'get',
		data,
		// showLoading: true,
	});
}

// 行政区划详情接口
export async function getArea(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/area/list/2/3`,
		method: 'get',
		data,
		// showLoading: true,
	});
}
