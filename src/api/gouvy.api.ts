import { request, commonPath } from '@/utils/index';

export async function getBasicInfo(data: any) {
	return request({
		url: '/heritage-maintenance-service/public/api/hm-basic-info/get',
		method: 'get',
		data,
		showLoading: true
	});
}
