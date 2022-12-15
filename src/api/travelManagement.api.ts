import { request, commonPath } from '@/utils/index';

export const travelManagement = {
	getTravelList(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/list`,
			method: 'post',
			data,
			showLoading: true,
		});
	},

	getGuideList(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/guide/list`,
			method: 'post',
			data,
			showLoading: false,
		});
	},
	getSubtravelList(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/travel/travelList`,
			method: 'get',
			data,
			showLoading: false,
		});
	},
	gettravelOperatorList(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/travel/travelOperatorList`,
			method: 'get',
			data,
			showLoading: false,
		});
	},

	saveItinerary(data: any, showLoading: boolean) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/saveItinerary`,
			method: 'post',
			data,
			showLoading,
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
			showLoading,
		});
	},
	getScenicList(data: any) {
		return request({
			url: `${commonPath}/ticket-service/public/api/scenic/ticketScenicInfos`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'get',
			data,
			showLoading: false,
		});
	},
	getTicketList(id: any, data: any) {
		return request({
			url: `${commonPath}/ticket-service/public/api/scenic-travel-itinerary/get-all-ticket/${id}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data,
			method: 'get',
			showLoading: false,
		});
	},
	editItinerary(data: any, showLoading: boolean) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/edit`,
			data,
			method: 'post',
			showLoading,
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
			showLoading: false,
		});
	},
	findProductInfo(oid: any) {
		return request({
			url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/detail/${oid}`,
			method: 'get',
			showLoading: false,
		});
	},

	comprehensiveFeeProduct(data: any) {
		return request({
			url: `${commonPath}/settlement-service/public/api/comprehensive-fee-product/page`,
			data,
			method: 'post',
			showLoading: false,
		});
	},

	getStock(data: any) {
		return request({
			url: `${commonPath}/ticket-service/public/api/scenic-travel-itinerary/get-stock`,
			data,
			method: 'get',
			showLoading: false,
		});
	},
	addHotel(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/hotel/modifyHotel`,
			data,
			method: 'post',
			showLoading: false,
		});
	},
	addTicket(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/ticket/modifyTicket`,
			data,
			method: 'post',
			showLoading: false,
		});
	},
	sendGroup(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/sendGroup`,
			data,
			method: 'put',
			showLoading: true,
		});
	},
	hotelDetail(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/hotel/hotelDetail/${data}`,
			method: 'get',
			showLoading: false,
		});
	},
	ticketDetail(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/ticket/ticketDetail/${data}`,
			method: 'get',
			showLoading: false,
		});
	},
	revokeGroupToDraft(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/revokeGroupToDraft/${data}`,
			method: 'get',
			showLoading: true,
		});
	},
	getAuditList(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/auditList`,
			method: 'post',
			data,
			showLoading: true,
		});
	},
	reserveHotel(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/hotel/reserveHotel`,
			method: 'put',
			data,
			showLoading: false,
		});
	},
	reserveTicket(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/ticket/reserveTicket`,
			method: 'post',
			data,
			showLoading: false,
		});
	},
	getItineraryStatus(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/getItineraryStatus`,
			method: 'get',
			data,
			showLoading: false,
		});
	},
	getAuditButton(data: any) {
		return request({
			url: `${commonPath}/customer-service/public/api/sys/audit/flow/getAuditButton`,
			method: 'post',
			data,
			showLoading: true,
		});
	},
	// 管理部门审核
	auditInfo(data: any) {
		return request({
			url: `${commonPath}/customer-service/public/api/sys/audit/flow/handle`,
			method: 'post',
			data,
			showLoading: true,
		});
	},
	takeGroup(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/takeGroup/${data}`,
			method: 'get',
			showLoading: true,
		});
	},
	rejectGroup(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/rejectGroup/${data}`,
			method: 'get',
			showLoading: true,
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
			showLoading: true,
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
			showLoading: true,
		});
	},
	getGuidePriceStarCodeByHotelId(data: any) {
		return request({
			url: `${commonPath}/hotel-service/public/api/hotel-information/getGuidePriceStarCodeByHotelId/${data}`,
			method: 'get',
			showLoading: false,
		});
	},
	getTravelTemplateList(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/list`,
			method: 'get',
			showLoading: false,
			data,
		});
	},
	deleteTourist(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryTourist/batchDelete`,
			method: 'delete',
			showLoading: true,
			data,
		});
	},
	deleteGuide(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryGuide/batchDelete`,
			method: 'delete',
			showLoading: true,
			data,
		});
	},
	deleteTraffic(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryTransport/batchDelete`,
			method: 'delete',
			showLoading: true,
			data,
		});
	},
	deleteHotel(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/hotel/batchDelete`,
			method: 'delete',
			showLoading: true,
			data,
		});
	},
	deleteTicket(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/ticket/batchDelete`,
			method: 'delete',
			showLoading: true,
			data,
		});
	},
	// 判断行程单的行程信息是否可发起变更
	checkVerifyByItineraryId(id: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/checkVerifyByItineraryId/${id}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'get',
			showLoading: false,
		});
	},
	// 变更详情
	changDetail(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/detail`,
			method: 'get',
			showLoading: false,
			data,
		});
	},
	// 变更详情审核
	travelChangeOrderProduct(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/changeProduct`,
			method: 'post',
			showLoading: false,
			data,
		});
	},
	//校验是否有外部票需要退订
	travelChangeCheckTicketRefund(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/checkTicketRefund`,
			method: 'post',
			showLoading: false,
			data,
		});
	},
	// 变更导游、交通、附件
	changeItineraryBasic(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/changeItineraryBasic`,
			method: 'post',
			showLoading: false,
			data,
		});
	},
	saveChangeTravel(data: any, showLoading: boolean) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/modify`,
			method: 'post',
			data,
			showLoading: false,
		});
	},
	saveChangeTraveldetail(oid: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/detail/${oid}`,
			method: 'get',
			showLoading: false,
		});
	},
	deleteTrave(itineraryId: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/delete/${itineraryId}`,
			method: 'delete',
			showLoading: false,
		});
	},
	getProductChangeAudit(itineraryId: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/getItineraryProductChangeAudit/${itineraryId}`,
			method: 'get',
			showLoading: false,
		});
	},
	//查询是否有变更驳回的行程详情（行程单id）
	getProductChangeAuditDetail(itineraryId: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/getNoPassItineraryProductChange/${itineraryId}`,
			method: 'get',
			showLoading: false,
		});
	},
	// 审核变更列表
	getChangeItineraryList(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/getChangeItineraryList`,
			method: 'post',
			showLoading: false,
			data,
		});
	},
	// 预定产品审核变更详情
	getItineraryChangeProductHistory(id: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/getItineraryChangeProductHistory/${id}`,
			method: 'get',
			showLoading: false,
		});
	},
	// 变更驳回审核
	changeItineraryAudit(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/changeItineraryAudit`,
			method: 'post',
			showLoading: false,
			data,
		});
	},
	//行程模板添加酒店
	templateaddHotel(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/addHotel`,
			data,
			method: 'post',
			showLoading: false,
		});
	},
	//行程模板酒店详情
	templateHotelDetail(oid: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/hotelDetail/${oid}`,
			method: 'get',
			showLoading: false,
		});
	},
	//行程模板添加门票
	templateaddTicket(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/addTicket`,
			data,
			method: 'post',
			showLoading: false,
		});
	},
	templateTicketDetail(oid: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/ticketDetail/${oid}`,
			method: 'get',
			showLoading: false,
		});
	},
	//行程模板删除
	templateAllDelete(oid: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/delete/${oid}`,
			method: 'DELETE',
			showLoading: false,
		});
	},
	//行程模板酒店删除
	templateHotelDelete(oid: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/deleteHotel/${oid}`,
			method: 'DELETE',
			showLoading: false,
		});
	},
	//行程模板门票删除
	templateTicketDelete(oid: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/deleteTicket/${oid}`,
			method: 'DELETE',
			showLoading: false,
		});
	},
	//行程模板导游删除
	templateGuideDelete(oid: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/deleteGuide/${oid}`,
			method: 'DELETE',
			showLoading: false,
		});
	},
	templateEditStatus(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/template/editTemplateStatus`,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data,
			showLoading: false,
		});
	},
	//撤销重提
	repealNreapplyPage(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/checkRevokeCondition`,
			data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'put',
			showLoading: false,
		});
	},
	//撤销重提权限
	repealNreapplyPagePower(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/checkTouristChangeRate`,
			data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'put',
			showLoading: false,
		});
	},

	//检查外部票是否已退订
	checkOutSideTicketIsRefund(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/checkOutSideTicketIsRefund`,
			data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'put',
			showLoading: false,
		});
	},
	//撤销重提确认
	confirmSubmit(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/confirmSubmit`,
			data,
			method: 'post',
			showLoading: true,
		});
	},

	//撤销重提确认
	submitRevokeAndRecommits(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/pc/submitRevokeAndRecommit`,
			data,
			method: 'post',
			showLoading: true,
		});
	},
	//整团撤销
	submitAllRevoke(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/submitAllRevoke`,
			data,
			method: 'post',
			showLoading: true,
		});
	},
	//撤销重提
	submitRevokeAndRecommit(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/submitRevokeAndRecommit`,
			data,
			method: 'post',
			showLoading: true,
		});
	},
	//查询撤销审核详情
	getAuditDetail(id: number) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/getAuditDetail/${id}`,
			method: 'get',
			showLoading: false,
		});
	},
	//查询撤销审核详情
	getSubmitRevokeDetail(id: number) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/getSubmitRevokeDetail/${id}`,
			method: 'get',
			showLoading: false,
		});
	},
	//查询撤销审核详情
	getRevokeItineraryTouristList(id: number) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryTourist/getRevokeItineraryTouristList/${id}`,
			method: 'get',
			showLoading: false,
		});
	},
	//旅行社审核 整团撤销
	revokeAudit(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/revokeAudit`,
			method: 'post',
			data,
			showLoading: false,
		});
	},
	//旅行社审核  撤销重提
	submitRevokeAudit(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/submitRevokeAudit`,
			method: 'post',
			data,
			showLoading: false,
		});
	},
	//分页查询 撤销/撤销重提 订单
	travelRepealNreapplyPageList(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/getItineraryRevokeAuditList`,
			method: 'post',
			showLoading: false,
			data,
		});
	},
	// 获取行程单tab
	getItineraryListTab(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/getItineraryListTab`,
			data,
			method: 'get',
			showLoading: true,
		});
	},
	getHealthCode(data: any) {
		return request({
			url: `${commonPath}/customer-service/public/api/common/health/code`,
			data,
			method: 'post',
			showLoading: false,
		});
	},
	getScenicTourist(data: any) {
		return request({
			url: `${commonPath}/ticket-service/public/api/scenic-order/scenicTourist`,
			data,
			method: 'get',
			showLoading: true,
		});
	},
	getRevokeAuditDetail(id: number) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryRevoke/getRevokeAuditDetail/${id}`,
			method: 'get',
			showLoading: false,
		});
	},
	getTicketType(data: any) {
		return request({
			url: `${commonPath}/ticket-service/public/api/scenic-ticket/ticketLessInfos`,
			data,
			method: 'get',
			showLoading: true,
		});
	},
	// 行程变更游客列表
	listByItinerary(id: number) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itineraryTourist/listByItinerary/${id}`,
			method: 'get',
			showLoading: false,
		});
	},
	getChildTicket(data: any) {
		return request({
			url: `${commonPath}/ticket-service/public/api/scenic-travel-itinerary/get-all-sub-ticket`,
			data,
			method: 'get',
			showLoading: false,
		});
	},
	//行程变更游客填写新的行程单
	changeTouristFillNewItinerary(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/change/changeTouristFillNewItinerary`,
			data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'put',
			showLoading: false,
		});
	},
	// 手动出团
	handGoOut(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/itinerary/handGoOut/${data}`,
			method: 'put',
			showLoading: true,
		});
	}
	
};
