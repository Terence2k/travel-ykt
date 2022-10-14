import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/customer-service/public/api/company/`
const commonPart1 = `${commonPath}/customer-service/public/api/sys-role/`
const commonPart2 = `${commonPath}/customer-service/public/api/sys-user/`
const commonPart3 = `${commonPath}/customer-service/public/api/dictionary/`
const commonPart4 = `${commonPath}/customer-service/public/api/sys/audit/flow/`
const commonPart5 = `${commonPath}/hotel-service/public/api/hotel-information/`
// 企业注册
export function companyRegister(data: any) {
	return request({
		url: `${commonPart}companyRegister`,
		method: 'post',
		data,
		showLoading: true
	});
}
// 手动新增企业
export function addCompany(data: any) {
	return request({
		url: `${commonPart}addCompany`,
		method: 'post',
		data,
		showLoading: true
	});
}
// 企业审核列表查询
export function findCompanyList(data: any) {
	return request({
		url: `${commonPart}findCompanyList`,
		method: 'post',
		data,
		showLoading: true
	});
}
// 查询审核按钮
export function getAuditButton(data: any) {
	return request({
		url: `${commonPart4}getAuditButton`,
		method: 'post',
		data,
		showLoading: true
	});
}
// 根据企业业态查询角色
export function listByBusinessType(data: any) {
	return request({
		url: `${commonPart1}list`,
		method: 'post',
		data,
		showLoading: true
	});
}
// 审核企业
/* export function auditCompany(data: any) {
	return request({
		url: `${commonPart}auditCompany`,
		method: 'post',
		data,
		showLoading: true
	});
} */
export function auditCompany(data: any) {
	return request({
		url: `${commonPart4}handle`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 管理员重置密码
export function resetPassword(data: any) {
	return request({
		url: `${commonPart2}resetPassword?oid=${data.oid}&newPassword=${data.newPassword}`,
		method: 'post',
		showLoading: true
	});
}
// 获取企业类型
export function businessTypeDropDown(codeValue: string) {
	return request({
		url: `${commonPart3}companyBusinessDictionary?codeValue=${codeValue}`,
		method: 'post',
		showLoading: true
	});
}
// 禁用企业
export function onOffCompany(data: any) {
	return request({
		url: `${commonPart}onOffCompany`,
		method: 'post',
		data,
		showLoading: true
	});
}

export function getChangeBeforeAfterData(companyId: string, type: string) {
	if (type === 'HOTEL') {
		// 酒店根据企业id查询提交审核前、后数据
		return request({
			url: `${commonPart5}getAuditBeforeAfterData?companyId=${companyId}`,
			method: 'post',
			showLoading: true
		});
	} else if (type === 'TRAVEL') {
		// 旅行社根据企业id查询提交审核前、后数据
		return request({
			url: `${commonPart}findCompanyInformationAuditDta?companyId=${companyId}`,
			method: 'post',
			showLoading: true
		});
	} else if (type === 'CATERING') {
		// 餐饮根据企业id查询提交审核前、后数据
		return request({
			url: `${commonPath}/catering-service/public/api/catering/post-data/${companyId}`,
			method: 'post',
			showLoading: true
		});
	} else if (type === 'TICKET') {
		// 景区根据企业id查询提交审核前、后数据
	} else if (type === 'SUPERVISE') {
		// 监理根据企业id查询提交审核前、后数据
	} else if (type === 'ASSOCIATION') {
		// 协会根据企业id查询提交审核前、后数据
	} else if (type === 'GROUP') {
		// 集团根据企业id查询提交审核前、后数据
	} else if (type === 'CULTURE_BUREAU') {
		// 文旅局根据企业id查询提交审核前、后数据
	} else if (type === 'ANCIENT_UYGUR') {
		// 古维管理部门根据企业id查询提交审核前、后数据
	}
}