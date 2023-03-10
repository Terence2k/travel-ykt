import { request, commonPath } from '@/utils/index';

// 分页查询景点信息
export async function getScenicSpotInformationList(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic`,
		method: 'get',
		data,
	});
}
// 编辑景点信息
export async function changeScenicSpotInformation(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic`,
		method: 'post',
		data,
	});
}
//查询景点详情
export async function getScenicById(id: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic/${id}`,
		method: 'get',
	});
}

// 单票分页
export async function getSingleVoteList(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-one-ticket/page`,
		method: 'get',
		data,
	});
}
// 单票库存
export async function getInevntoryDetail(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-one-ticket/get-stock`,
		method: 'get',
		data,
	});
}
// 单票库存保存
export async function saveInevntoryDetail(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-one-ticket/save-stock`,
		method: 'post',
		data,
	});
}

// 获取地区接口
export async function getAllArea(pid: any, level: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/area/list/${pid}/${level}`,
		method: 'get',
	});
}
// 获取地区
export async function getAreaByid(id: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/area/${id}`,
		method: 'get',
	});
}

// 获取企业类型
export async function getCompandType() {
	return request({
		url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChild?pid=115`,

		method: 'post',
		showLoading: false,
	});
}
// 获取核销项目列表
export async function getVariflist(id: number) {
	return request({
		// url: `${commonPath}/ticket-service/public/api/scenic-one-ticket/varif-list?id=2`,
		url: `${commonPath}/ticket-service/public/api/scenic-one-ticket/varif-list/${id}`,
		method: 'get',
	});
}
// 获取单票详情
export async function getScenicSpotSignleDetail(id: number) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-one-ticket/${id}`,
		method: 'get',
	});
}
// 获取获取核销权限用户
export async function getVerifUser() {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-one-ticket/get-verif-user?companyId=8`,
		method: 'get',
	});
}
// 新增或 编辑单票信息
export async function saveSingleVoteInfo(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-one-ticket/save`,
		method: 'post',
		data,
		showLoading: true,
	});
}

// 获取景区下拉列表
export async function getViewList() {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic/lessInfos`,
		method: 'get',
	});
}
// localhost:8003/ticket-service/public/api/scenic-ticket-down?ticketName=&ticketType=&pageNo=1&pageSize=10
// 景区下架列表
export async function scenicTicketDownList(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-ticket-down`,
		method: 'get',
		data,
	});
}
// 景区下架
export async function scenicTicketDown(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-ticket-down`,
		method: 'post',
		data,
	});
}

// 景区下架 详情
export async function scenicTicketDetail(id: number) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-ticket-down/${id}`,
		method: 'get',
	});
}

// 景区上架
export async function resigerScenicTicketDetail(id: number) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-one-ticket/putaway/${id}`,
		method: 'post',
	});
}
//单票删除
export async function singleVoteDel(id: number) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-one-ticket/${id}`,
		method: 'delete',
	});
}
//景区场馆 分页查询
export async function getShowVenueList(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-venue`,
		method: 'get',
		data,
	});
}
//核销时间段列表
export async function getWriteOffTimeList(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-verif-manage/page`,
		method: 'get',
		data,
	});
}
//景区订单 分页查询
export async function getViewOrderList(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-order`,
		method: 'get',
		data,
	});
}
//景区订单 详情
export async function getViewOrderDetails(id: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-order/${id}`,
		method: 'get',
	});
}

// 获取景区等级数据
export async function getScenicLevels() {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic/scenicLevels`,
		method: 'get',
	});
}

// 分页获取核销项目列表
export async function getWriteOffItemList(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-verif-item/page`,
		method: 'get',
		data,
	});
}

//ticket-service/public/api/scenic-verif-item/save
export async function editWriteOffItem(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-verif-item/save`,
		method: 'post',
		data,
	});
}

// /ticket-service/public/api/scenic-verif-item/id

export async function deleteWriteOffItem(id: number) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-verif-item/${id}`,
		method: 'delete',
	});
}
// localhost:8003/ticket-service/public/api/scenic-unite?pageNo=1&pageSize=10&ticketName=
// 联票 列表
export async function getMultipleList(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-unite`,
		method: 'get',
		data,
	});
}

// 联票 新增
export async function createMultiple(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-unite`,
		method: 'post',
		data,
		showLoading: true,
	});
}

// 联票 详情
export async function getMultipleDetail(id: number) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-unite/${id}`,
		method: 'get',
	});
}

//联票 子票下拉列表
export async function getChildOption() {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-ticket/search`,
		method: 'get',
	});
}

//联票 查询库存日历 （仅编辑）
export async function getCalendarMultiple(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-unite/subUnitePriceDate`,
		method: 'get',
		data,
	});
}
//联票 编辑库存日历 （仅编辑）
export async function editCalendarMultiple(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-unite/subUnitePriceDate`,
		method: 'post',
		data,
		showLoading: true,
	});
}

// 核销时间段
export async function getVerifManage(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-verif-manage/page`,
		method: 'get',
		data,
	});
}
// 核销项目详情
export async function getScenicVerif(id: number) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-verif-manage/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
// 核销时间段编辑
export async function getScenicSave(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-verif-manage/save`,
		method: 'POST',
		data,
	});
}

// 获取核销记录分页数据
export async function getWriteOffRecordList(data: any) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-verif-record/page`,
		method: 'get',
		data,
		showLoading: true,
	});
}

//获取核销记录详情
export async function getWriteOffRecordDetails(oid: number) {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-verif-record/${oid}`,
		method: 'get',
		showLoading: true,
	});
}

//获取核销记录详情
export async function getShowVenueDetail(oid: number) {
	return request({
		url: `${commonPath}/	ticket-service/public/api/scenic-venue/${oid}`,
		method: 'get',
		showLoading: true,
	});
}
