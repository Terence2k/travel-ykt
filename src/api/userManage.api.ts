import { request, commonPath } from '@/utils/index';

// 用户列表
export async function userList(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/list`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 角色列表
export async function roleList(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-role/list`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 新增用户
export async function addUser(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/save`,
		method: 'post',
		data,
		showLoading: true
	});
}