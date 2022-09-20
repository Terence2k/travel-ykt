import { request, commonPath } from '@/utils/index';

// 分页查询景点信息
export async function getScenicSpotInformationList(data: any) {
	return request({
		url: `/ykt/ticket-service/public/api/scenic`,
		method: 'get',
		data,
		showLoading: true,
	});
}
export async function getScenicById(data: any, id: any) {
	return request({
		url: `/ykt/ticket-service/public/api/scenic/${id}`,
		method: 'get',
		showLoading: true,
	});
}
