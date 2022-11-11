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

    saveItinerary(data: any, showLoading: boolean) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/saveItinerary`,
            method: 'post',
            data,
            showLoading
        });
    },

    getItineraryDetail(data: any, showLoading: boolean) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/detail`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'get',
            data,
            showLoading
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
    editItinerary(data: any, showLoading: boolean) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/edit`,
            data,
            method: 'post',
            showLoading
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
            showLoading: false
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
    addHotel(data: any){
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/hotel/modifyHotel`,
            data,
            method: 'post',
            showLoading: false
        });
    },
    addTicket(data: any){
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/ticket/modifyTicket`,
            data,
            method: 'post',
            showLoading: false
        });
    },
    sendGroup(data: any){
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/sendGroup`,
            data,
            method: 'put',
            showLoading: true
        });
    },
    hotelDetail(data: any){
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/hotel/hotelDetail/${data}`,
            method: 'get',
            showLoading: false
        });
    },
    ticketDetail(data: any){
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/ticket/ticketDetail/${data}`,
            method: 'get',
            showLoading: false
        });
    },
    revokeGroupToDraft(data: any){
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/revokeGroupToDraft/${data}`,
            method: 'get',
            showLoading: true
        });
    },
    getAuditList(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/auditList`,
            method: 'post',
            data,
            showLoading: true
        });
    },
    reserveHotel(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/hotel/reserveHotel`,
            method: 'put',
            data,
            showLoading: false
        });
    },
    reserveTicket(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/ticket/reserveTicket`,
            method: 'post',
            data,
            showLoading: false
        });
    },
    getItineraryStatus(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/getItineraryStatus`,
            method: 'get',
            data,
            showLoading: false
        });
    },
    getAuditButton(data: any) {
        return request({
            url: `${commonPath}/customer-service/public/api/sys/audit/flow/getAuditButton`,
            method: 'post',
            data,
            showLoading: true
        });
    },
    // 管理部门审核
    auditInfo(data: any) {
        return request({
            url: `${commonPath}/customer-service/public/api/sys/audit/flow/handle`,
            method: 'post',
            data,
            showLoading: true
        });
    },
    takeGroup(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/takeGroup/${data}`,
            method: 'get',
            showLoading: true
        });
    },
    rejectGroup(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/rejectGroup/${data}`,
            method: 'get',
            showLoading: true
        });
    },
    // 获取审核详情
    getAuditInfo(id: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/audit/auditDetail?oid=${id}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'get',
            showLoading: true
        });
    },
    // 财务部门审核
    financeAudit(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/financeAudit`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'put',
            data,
            showLoading: true
        });
    },
    getGuidePriceStarCodeByHotelId(data: any) {
        return request({
            url: `${commonPath}/hotel-service/public/api/hotel-information/getGuidePriceStarCodeByHotelId/${data}`,
            method: 'get',
            showLoading: false
        });
    },
    getTravelTemplateList(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/template/list`,
            method: 'get',
            showLoading: false,
            data,
        });
    }
    
}