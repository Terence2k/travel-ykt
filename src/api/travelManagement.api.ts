import { request, commonPath } from '@/utils/index';

export const travelManagement = {
    getTravelList(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/list`,
            method: 'post',
            data,
            showLoading: true
        });
    },

    getGuideList(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/guide/list`,
            method: 'get',
            data,
            showLoading: false
        });
        
    },
    getSubtravelList(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/travel/travelList`,
            method: 'get',
            data,
            showLoading: false
        });
    },
    gettravelOperatorList(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/travel/travelOperatorList`,
            method: 'get',
            data,
            showLoading: false
        });
    }
    
}