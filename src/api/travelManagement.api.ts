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
    editItinerary(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/edit`,
            data,
            method: 'post',
            showLoading: true
        });
    },
    findByIdTeamType(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/team/findByIdTeamType`,
            data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'post',
            showLoading: false
        });
    },
    findProductInfo(oid: any) {
        return request({
            url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/detail/${oid}`,
            method: 'get',
            showLoading: false
        });
    },
    
    comprehensiveFeeProduct(data: any){
        return request({
            url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/page`,
            data,
            method: 'post',
            showLoading: true
        });
    },

    getStock(data: any){
        return request({
            url: `${commonPath}/ticket-service/public/api/scenic-travel-itinerary/get-stock`,
            data,
            method: 'get',
            showLoading: false
        });
    },
    reserveHotel(data: any){
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/modifyHotel`,
            data,
            method: 'post',
            showLoading: true
        });
    },
    reserveTicket(data: any){
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/modifyTicket`,
            data,
            method: 'post',
            showLoading: true
        });
    },
    sendGroup(data: any){
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/sendGroup`,
            data,
            method: 'put',
            showLoading: true
        });
    }
}