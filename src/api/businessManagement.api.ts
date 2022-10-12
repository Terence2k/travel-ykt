import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/customer-service/public/api/company/`
const commonPart1 = `${commonPath}/customer-service/public/api/sys-role/`
const commonPart2 = `${commonPath}/customer-service/public/api/sys-user/`
const commonPart3 = `${commonPath}/customer-service/public/api/dictionary/`
const commonPart4 = `${commonPath}/customer-service/public/api/sys/audit/flow/`
// 企业注册
export function companyRegister(data: any) {
	return request({
		url: `${commonPart}companyRegister`,
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
		url: `${commonPart3}dropDownQueryListChildByCodeValue?codeValue=${codeValue}`,
		method: 'post',
		showLoading: true
	});
}