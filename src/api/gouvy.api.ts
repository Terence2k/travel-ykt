import { request, commonPath } from '@/utils/index';
//查询基本信息设置
export async function getBasicInfo(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-basic-info/get`,
		method: 'get',
		data,
		showLoading: false,
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
//减免申请记录
export async function exemptionManagementList(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-apply-record/page`,
		method: 'post',
		data,
		showLoading: true,
	});
}
//行程减免信息详情
export async function ExemptionManagementDetail(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-apply-record/detail/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
//古维订单
export async function gouvyOrder(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/page`,
		method: 'post',
		data,
		showLoading: true,
	});
}
//古维订单提交减免申请
export async function applyReduction(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/applyReduction`,
		method: 'post',
		data,
		showLoading: true,
	});
}
//古维订单提交减免审核不通过
export async function noAuditFailed(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-apply-record/auditFailed`,
		method: 'post',
		data,
		showLoading: true,
	});
}
//古维订单提交减免审核通过
export async function AuditFailed(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-apply-record/auditAdopt/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
// 古维订单导出
export async function exportGouvyOrder(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/export`,
		method: 'post',
		data,
		responseType: 'blob',
		showLoading: false,
	});
}
//古维订单详情
export async function gouvyOrderDetail(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/detail/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
//古维订单出票
export async function issue(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/issue/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}

//分页查询 撤销/撤销重提 订单
export async function gouvyRepealNreapplyPageList(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/itineraryRevoke/page`,
		method: 'post',
		showLoading: false,
		data,
	});
}
//获取 撤销/撤销重提 订单详情
export async function itineraryRevoke(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/itineraryRevoke/get/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
//行程撤销/撤销重提 审核通过
export async function itineraryRevokeAuditAdopt(id: number) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/itineraryRevoke/auditAdopt/${id}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'get',
		showLoading: false,
	});
}
//行程撤销/撤销重提 审核不通过
export async function itineraryRevokeAuditFailed(data: any) {
	return request({
		url: `${commonPath}/heritage-maintenance-service/public/api/hm-order/itineraryRevoke/auditFailed`,
		method: 'post',
		showLoading: false,
		data,
	});
}
