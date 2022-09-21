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