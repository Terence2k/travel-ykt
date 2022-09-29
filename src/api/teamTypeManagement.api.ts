import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/travel-agency-service/public/api/team/`

// 分页查询团队类型列表
export function selectTeamTypeList(data: any) {
	return request({
		url: `${commonPart}selectTeamTypeList`,
		method: 'post',
		data,
		showLoading: true
	});
}
// 新增团队类型
export function addTeamType(data: any) {
	return request({
		url: `${commonPart}addTeamType`,
		method: 'post',
		data,
		showLoading: true
	});
}
// 修改团队类型
export function updataTeamType(data: any) {
	return request({
		url: `${commonPart}updataTeamType`,
		method: 'post',
		data,
		showLoading: true
	});
}