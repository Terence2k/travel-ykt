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
    },
    getCityList(data: any) {
        return request({
            url: `${commonPath}/customer-service/public/api/area/list/${data}`,
            method: 'get',
            showLoading: false
        });
    },
    getCodeValue(data: any) {
        return request({
            url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChildByCodeValue?codeValue=${data.codeValue}`,
            method: 'post',
            showLoading: false
        });
    },
    getItem(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/team/getItem`,
            method: 'post',
            showLoading: false
        });
    }
    
    
}
    