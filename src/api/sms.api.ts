import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/customer-service/public/api`;
//查询短信模板列表
export function getSysSmsTemplates(data: any) {
	return request({
		url: `${commonPart}/smsTemplate/getSysSmsTemplates`,
		method: 'post',
		data,
	});
}

//短信模板启用禁用
export function isEnableSysSmsTemplate(oid: number, status: string) {
	return request({
		url: `${commonPart}/smsTemplate/isEnableSysSmsTemplate/${oid}/${status}`,
		method: 'get',
	});
}

// 查询短信模板接收人信息
export function getSysSmsTemplateSendPersons(data:any) {
	return request({
		url: `${commonPart}/smsTemplate/getSysSmsTemplateSendPersons`,
		method: 'post',
		data
	});
}

// 短信模板接收人信息处理
export function handleSysSmsTemplateSendPerson(data:any) {
	return request({
		url: `${commonPart}/smsTemplate/handleSysSmsTemplateSendPerson`,
		method: 'post',
		data
	});
}
