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
// 景区汇总
export async function allStatement(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/ticket/allStatement`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 酒店账目
export async function hotelAccountList(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/hotel/statement//hotelAccountList`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 管理中心总账
export async function statementList(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/managementCenter/statement/byTravel`,
		method: 'post',
		data,
		showLoading: true,
	});
}
