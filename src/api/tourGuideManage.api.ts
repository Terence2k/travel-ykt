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
//发送委派邀请
export async function sendSignInvitation(data: any) {
	return request({
        url: `${commonPath}/travel-agency-service/public/api/guide/sendSignInvitation`,
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'put',
        showLoading: false,
    });
}
//取消委派邀请
export async function cancelSign(data: any) {
	return request({
        url: `${commonPath}/travel-agency-service/public/api/guide/cancelSign`,
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'put',
        showLoading: false,
    });
}