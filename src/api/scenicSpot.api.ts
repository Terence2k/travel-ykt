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
		method: 'get',
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

//根据oid查询字典

export async function selectByOid(id: any) {
	return request({
		url: commonPath + `/customer-service/public/api/dictionary/selectByOidList?oid=${id}`,
		method: 'get',
		// showLoading: true,
	});
}
