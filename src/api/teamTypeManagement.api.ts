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
