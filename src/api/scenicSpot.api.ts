import { request, commonPath } from '@/utils/index';

// 分页查询景点信息
export async function getScenicSpotInformationList(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic`,
		method: 'get',
		data,
		// showLoading: true,
	});
}
// 编辑景点信息
export async function changeScenicSpotInformation(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic`,
		method: 'post',
		data,
		// showLoading: true,
	});
}
//查询景点详情
export async function getScenicById(id: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic/${id}`,
		method: 'get',
		// showLoading: true,
	});
}

// 单票分页
export async function getSingleVoteList(data: any) {
	return request({
		url: commonPath + `/ticket-service/public/api/scenic-one-ticket/page`,
		method: 'get',
		data,
		// showLoading: true,
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
export async function getAreaByid(id: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/area/${id}`,
		method: 'get',
		// showLoading: true,
	});
}

// 获取企业类型
export async function getCompandType() {
	return request({
		url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChild?pid=115`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'post',
		showLoading: false,
	});
}
