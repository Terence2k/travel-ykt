import { request, commonPath } from '@/utils/index';
//查询导游列表
export async function travelGuideList(data: any) {
	return request({
		url: `${commonPath}/travel-agency-service/public/api/guide/travelGuideList`,
		method: 'POST',
		data,
		showLoading: true,
	});
}
//同步
export async function travelSynchronizeGuide(data: any) {
	return request({
        url: `${commonPath}/travel-agency-service/public/api/guide/travelSynchronizeGuide`,
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'put',
        showLoading: false,
    });
}
//手动委派
export async function queryNoSignGuideList(data: any) {
	return request({
        url: `${commonPath}/travel-agency-service/public/api/guide/queryNoSignGuideList`,
		method: 'GET',
		data,
		showLoading: false,
    });
}