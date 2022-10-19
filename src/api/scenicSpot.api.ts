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
export async function getVariflist() {
	return request({
		url: `${commonPath}/ticket-service/public/api/scenic-one-ticket/varif-list?id=2`,
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
		url: commonPath + `/ticket-service/public/api/scenic-one-ticket/audit`,
		method: 'post',
		data,
	});
}

// 获取景区下拉列表
export async function getViewList() {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic/lessInfos`,
		method: 'get',
	});
}
// 获取景区下架
export async function scenicTicketDown(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-ticket-down`,
		method: 'post',
		data,
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
		url: commonPath + `/ticket-service/public/api/scenic-order/page`,
		method: 'get',
		data,
	});
}

// 获取景区等级数据
export async function getScenicLevels() {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic/scenicLevels`,
		method: 'get',
	});
}
