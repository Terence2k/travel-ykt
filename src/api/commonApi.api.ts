import { request, commonPath } from '@/utils/index';

export const commonApi = {
    getDictionary(data: any) {
        return request({
            url: `${commonPath}/customer-service/public/api/dictionary/listChild`,
            method: 'post',
            data,
            showLoading: true
        });
    },
    getTeamTypeList(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/team/selectTeamTypeList`,
            method: 'post',
            data,
            showLoading: true
        });
    }
}
    