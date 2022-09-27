import { request, commonPath } from '@/utils/index';

export const travelManagement = {
    getTravelList(data: any) {
        return request({
            url: `${commonPath}/travel-agency-service/public/api/itinerary/list`,
            method: 'post',
            data,
            showLoading: true
        });
    }
}