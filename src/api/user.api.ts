import { request, commonPath } from '@/utils/index';

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
		url: `${commonPath}/customer-service/public/api/sys-user/login`,
		method: 'post',
		data,
		showLoading: true
	});
}

//获取短信验证码
export function getSmsVerifyCode(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/getSmsVerifyCode`,
		method: 'post',
		data,
		showLoading: true
	});
}

//PC短信验证码登录
export function smsLogin(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/sms/login`,
		method: 'post',
		data,
		showLoading: true
	});
}
