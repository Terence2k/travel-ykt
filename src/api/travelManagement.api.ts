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
            method: 'post',
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
    },

    saveItinerary(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/saveItinerary`,
            method: 'post',
            data,
            showLoading: false
        });
    },

    getItineraryDetail(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/detail`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'get',
            data,
            showLoading: false
        });
    },
    getScenicList(data: any) {
        return request({
            url: `${commonPath}/ticket-service/public/api/scenic/lessInfos`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'get',
            data,
            showLoading: false
        });
    },
    getTicketList(id: any) {
        return request({
            url: `${commonPath}/ticket-service/public/api/scenic-travel-itinerary/get-all-ticket/${id}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'get',
            showLoading: false
        });
    },
    
}