import { request } from '@/utils/index';

// 分页查询酒店星级
export async function getHotelStarTableInfo(data: any) {
	return request({
		url: '/ykt/hotel-service/public/api/hotel-rated/page',
		method: 'post',
		data,
		showLoading: true,
	});
}

// 新增酒店星级
export async function addHotelStarData(data: any) {
	return request({
		url: '/ykt/hotel-service/public/api/hotel-rated/add',
		method: 'post',
		data,
		showLoading: true,
	});
}

// 编辑酒店星级
export async function editHotelStarData(data: any) {
	return request({
		url: 'ykt/hotel-service/public/api/hotel-rated/update',
		method: 'post',
		data,
		showLoading: true,
	});
}

//禁用酒店星级
export async function disableHotelStar(data: any, id: string) {
	return request({
		url: `/ykt/hotel-service/public/api/hotel-rated/disenable/${id}`,
		method: 'get',
		data,
		showLoading: true,
	});
}

//启用酒店星级
export async function enableHotelStar(data: any, id: string) {
	return request({
		url: `/ykt/hotel-service/public/api/hotel-rated/enable/${id}`,
		method: 'get',
		data,
		showLoading: true,
	});
}
