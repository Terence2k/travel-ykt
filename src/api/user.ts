import { request, config } from '@/utils/index';

export async function userList(data: any) {
	return request({
		url: '/ykt/customer-service/public/api/sys-user/list',
		method: 'get',
		data,
		showLoading: true
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

export function login(data: any) {
	return request({
		url: '/ykt/customer-service/public/api/sys-user/login',
		method: 'post',
		data,
		showLoading: true
	});
}
