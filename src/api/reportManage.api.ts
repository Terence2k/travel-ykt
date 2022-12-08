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
// 管理中心明细账
export async function statementByItinerary(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/managementCenter/statement/byItinerary`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 地接总账
export async function statementByTravel(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/subTravel/statement/ByTravel`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 地接明细账
export async function statementBySubTravelDetail(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/subTravel/statement/byItinerary`,
		method: 'post',
		data,
		showLoading: true,
	});
}

// 散客结算汇总表
export async function individualSettlementSummaryReportTravel(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/individualTravel/statement/byTravel`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 散客结算明细表
export async function individualSettlementDetailReportTravel(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/individualTravel/statement/byItinerary`,
		method: 'post',
		data,
		showLoading: true,
	});
}
// 景区对账表

export async function travelAgencyAndScenicSpotReportStatement(data: any) {
	return request({
		url: `${commonPath}/settlement-service/public/api/statement/individualTravel/statement/byItineraryTicket`,
		method: 'post',
		data,
		showLoading: true,
	});
}
