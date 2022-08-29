import { request, config } from '@/utils/index';

export async function userList(data: any) {
	return request({
		url: config.api.user.list,
		method: 'get',
		data,
	});
}
