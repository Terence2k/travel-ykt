import { request, commonPath } from '@/utils/index';
//查询基本信息设置
export async function getBasicInfo(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-basic-info/get`,
		method: 'get',
		data,
		showLoading: true,
	});
}
//查询基本信息编辑
export async function getBasicEdit(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-basic-info/edit`,
		method: 'POST',
		data,
		showLoading: true,
	});
}
// 启用
export async function getEnable(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-discount-rule/enable/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
// 禁用
export async function getDisenable(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-discount-rule/disenable/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
//查询古维规则列表
export async function getBasiclist(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-discount-rule/list`,
		method: 'get',
		data,
		showLoading: true,
	});
}
//查询证件下拉列表
export async function dropDownQueryList(id: number) {
	return request({
		url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChildByCodeValue?codeValue=${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
		showLoading: false,
	});
}
//编辑古维减免规则
export async function update(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-discount-rule/update`,
		method: 'post',
		data,
		showLoading: true,
	});
}
//新增古维减免规则
export async function add(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-discount-rule/add`,
		method: 'post',
		data,
		showLoading: true,
	});
}
//行程单游客列表
export async function getItineraryTourist(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/list/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
//行程单古维页面
export async function getManagementExpenses(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/getManagementExpenses/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
