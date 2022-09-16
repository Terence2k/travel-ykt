import { request, commonPath } from '@/utils/index';

// 分页查询酒店星级
export async function getHotelStarTableInfo(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-rated/page`,
		method: 'post',
		data,
		showLoading: true,
	});
}
