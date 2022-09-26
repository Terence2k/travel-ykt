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

// 新增酒店星级
export async function addHotelStarData(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-rated/add`,
		method: 'post',
		data,
		showLoading: true,
	});
}

// 编辑酒店星级
export async function editHotelStarData(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-rated/update`,
		method: 'post',
		data,
		showLoading: true,
	});
}

//禁用酒店星级
export async function disableHotelStar(data: any, id: string) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-rated/disenable/${id}`,
		method: 'get',
		data,
		showLoading: true,
	});
}

//启用酒店星级
export async function enableHotelStar(data: any, id: string) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-rated/enable/${id}`,
		method: 'get',
		data,
		showLoading: true,
	});
}

// 获取酒店星级列表
export async function getHotelStarList(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-rated/list`,
		method: 'get',
		data,
		showLoading: true,
	});
}
// 分页查询酒店
export async function getHotelTableInfo(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-information/page`,
		method: 'post',
		data,
		showLoading: true,
	});
}

// 根据酒店id查询酒店信息
export async function getHotelDetailInfo(data: any, id: number) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-information/getInfoById/${id}`,
		method: 'get',
		data,
		showLoading: true,
	});
}

//编辑保存酒店信息
export async function editHotelDetailInfo(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-information/update`,
		method: 'post',
		data,
		showLoading: true,
	});
}

//根据酒店id查询房型信息
export async function getRoomDetailInfo(data: any, id: number) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-type/getRoomType/${id}`,
		method: 'get',
		data,
		showLoading: true,
	});
}

//编辑酒店房型信息
export async function editRoomDetailInfo(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-type/updateRoomType`,
		method: 'post',
		data,
		showLoading: true,
	});
}

//删除酒店房型信息
export async function deleteRoomDetailInfo(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-type/deleteRoomType`,
		method: 'post',
		data,
		showLoading: true,
	});
}
