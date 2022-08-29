import { request, config } from '@/utils/index';

export async function userList(data: any) {
	return request({
		url: config.api.user.list,
		method: 'get',
		data,
	});
}
export async function getInfo(data: any) {
	return request({
		url: '/merchant/get/info',
		method: 'get',
		data,
		showLoading: true
	});
}
export function getOrder(data: any) {
	return request({
		url: '/hotel/order/list',
		method: 'post',
		data,
		showLoading: true
	});
}
