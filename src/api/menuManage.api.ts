import { request, commonPath } from '@/utils/index';

// 用户列表
export async function menuList(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/tree`,
		method: 'get',
		data,
		showLoading: true
	});
}