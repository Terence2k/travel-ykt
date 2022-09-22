import { request, commonPath } from '@/utils/index';

// 角色列表
export async function roleList(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-role/list`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 业态范围
export async function businessType() {
	return request({
		url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChild?pid=115`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
		method: 'post',
		showLoading: false
	});
}