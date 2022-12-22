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

// 新增短信模板
export function addSmsTemplate(data:any) {
	return request({
		url: `${commonPart}/smsTemplate/addSmsTemplate`,
		method: 'post',
		data
	});
}

// 查询短信模板
export function getSysSmsTemplate(templateId:any) {
	return request({
		url: `${commonPart}/smsTemplate/getSysSmsTemplate/${templateId}`,
		method: 'get',
	});
}

// 删除短信模板
export function deleteSysSmsTemplate(templateId:any) {
	return request({
		url: `${commonPart}/smsTemplate/deleteSysSmsTemplate/${templateId}`,
		method: 'delete',
	});
}