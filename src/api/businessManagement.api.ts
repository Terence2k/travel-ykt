import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/customer-service/public/api/company/`

// 企业注册
export function companyRegister(data: any) {
	return request({
		url: `${commonPart}companyRegister`,
		method: 'post',
		data,
		showLoading: true
	});
}
