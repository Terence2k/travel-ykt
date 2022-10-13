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

//接受审核信息 /hotel-service/private/api/hotel-information/receiveAuditResult
export async function getHotelInfoAuditResult(data: any) {
	return request({
		url: `${commonPath}/hotel-service/private/api/hotel-information/receiveAuditResult`,
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
		url: `${commonPath}/hotel-service/public/api/hotel-room-type/editRoomType`,
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

// 获取地区接口
export async function getAllArea(pid: any, level: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/area/list/${pid}/${level}`,
		method: 'get',
		// showLoading: true,
	});
}

// 获取地区
export async function getAreaById(id: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/area/${id}`,
		method: 'get',
		// showLoading: true,
	});
}

// 获取企业类型
export async function getCompanyType() {
	return request({
		url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChild?pid=115`,

		method: 'post',
		showLoading: false,
	});
}

// 获取酒店列表
export async function getHotelList(auditStatus: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-stock/listHotel?auditStatus=${auditStatus}`,
		method: 'get',
		// showLoading: true,
	});
}

// 获取未来一段时间酒店房间库存数据
export async function getHotelRoomStockInFuture(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-stock/list`,
		method: 'post',
		data,
		showLoading: true,
	});
}

//更改酒店房间库存并提交审核
export async function editHotelRoomStock(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-stock/submitAudit`,
		method: 'post',
		data,
		showLoading: true,
	});
}

//酒店库存更改审核通过
export async function hotelRoomStockPass(id: number) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-stock/auditAdopt/${id}`,
		method: 'get',
		showLoading: true,
	});
}

//酒店库存更改审核失败 /hotel-service/public/api/hotel-room-stock/auditFailed/10
export async function hotelRoomStockFailed(id: number) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-stock/auditFailed/${id}`,
		method: 'get',
		showLoading: true,
	});
}

// 获取处于审核状态的酒店房型信息
export async function getRoomDetailInfoInAuditStatus(id: number) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-type/showAuditRoomType/${id}`,
		method: 'get',
		showLoading: true,
	});
}

// /hotel-service/public/api/hotel-room-type/auditPassOrNot/{uuid}?flag=
export async function auditRoomDetailInfo(uuid: string, roleId: string, businessTypeCode: string, isPass: boolean) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-type/auditPassOrNot/${uuid}/${roleId}/${businessTypeCode}?flag=${isPass}`,
		method: 'get',
		showLoading: true,
	});
}

// /customer-service/public/api/sys/audit/flow/handle
// 酒店基本信息审核
export async function auditHotelInfo(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys/audit/flow/handle`,
		data,
		method: 'post',
		showLoading: false,
	});
}

// /customer-service/public/api/sys/audit/flow/getAuditButton
// 查询是否有审核权限，返回roleId
export async function getRoleId(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys/audit/flow/getAuditButton`,
		data,
		method: 'post',
		showLoading: false,
	});
}
// 根据酒店id查询酒店信息
export async function getHotelInfoByRated(id: number) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-information/getHotelInfoByRatedId/${id}`,
		method: 'get',
	});
}
export async function getRoomType(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-room-type/listRoomType`,
		method: 'post',
		data,
	});
}

// /hotel-service/public/api/hotel-sys-room-type/page
// 分页查询酒店系统房型
export async function getSystemRoomType(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-sys-room-type/page`,
		data,
		method: 'post',
		showLoading: false,
	});
}

// /hotel-service/public/api/hotel-sys-room-type/add
// 新增系统房型
export async function addSystemRoomType(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-sys-room-type/add`,
		data,
		method: 'post',
		showLoading: false,
	});
}

// /hotel-service/public/api/hotel-sys-room-type/update
// 编辑系统房型
export async function editSystemRoomType(data: any) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-sys-room-type/update`,
		data,
		method: 'post',
		showLoading: false,
	});
}

// /hotel-service/public/api/hotel-sys-room-type/enable/:oid
// 启用系统房型
export async function enableSystemRoomType(id: number) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-sys-room-type/enable/${id}`,
		method: 'get',
		showLoading: true,
	});
}

//禁用系统房型
export async function disableSystemRoomType(id: number) {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-sys-room-type/disenable/${id}`,
		method: 'get',
		showLoading: true,
	});
}

// /hotel-service/public/api/hotel-sys-room-type/list
export async function getEnableSystemRoomType() {
	return request({
		url: `${commonPath}/hotel-service/public/api/hotel-sys-room-type/list`,
		method: 'get',
		showLoading: true,
	});
}
