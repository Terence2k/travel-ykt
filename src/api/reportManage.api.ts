import { request, commonPath } from '@/utils/index';
// 景区账目
export async function byItineraryTicket(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/ticket/statement/byItineraryTicket`,
		method: 'post',
		data,
		showLoading: true,
	});
}
