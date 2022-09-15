import { request } from '@/utils/index';

// 用户列表
export async function userList(data: any) {
	return request({
		url: '/ykt/customer-service/public/api/sys-user/list',
		method: 'post',
		data,
		showLoading: true
	});
}