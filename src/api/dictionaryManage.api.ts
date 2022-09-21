import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/customer-service/public/api/dictionary/`
/* export async function getInfo(data: any) {
	return request({
		url: '/merchant/get/info',
		method: 'get',
		data,
		showLoading: true
	});
} */
export function getDictionary(data: any) {
	return request({
		url: `${commonPart}list?value=${data?.value}`,
		method: 'post',
		showLoading: true
	});
}

export function addDictionary(data: any) {
	return request({
		url: `${commonPart}save`,
		method: 'post',
		data,
		showLoading: true
	});
}

export function updateDictionary(data: any) {
	return request({
		url: `${commonPart}update`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 根据pid查询字典子级
export function getListChild(data: any) {
	return request({
		url: `${commonPart}listChild`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 查询可添加的序号
export function querySortNumber(oid: string) {
	return request({
		url: `${commonPart}querySortNumber?pid=${oid}`,
		method: 'post',
		showLoading: true
	});
}