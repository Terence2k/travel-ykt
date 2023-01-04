import { defineStore } from 'pinia';
import { GroupMode, GroupStatus, Gender, GuideType, FeeModel, insuranceType, AuditStaus, TakeGroupStatus } from '@/enum';
import api from '@/api/index';
import { cloneDeep, toArray } from 'lodash';
import { AuditField, Field, TakeGroupField } from '@/type';
import dayjs, { Dayjs } from 'dayjs';
import { CODEVALUE } from '@/constant';
interface TraveDataItem {
	groupType: GroupMode.All | GroupMode.TeamGroup | GroupMode.NoTeamGroup;
	[k: string]: any;
}
export const traveListParams = {
	total: 0,
	list: [],
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 0,
		startDate: '',
		endDate: '',
		keyWord: '',
		keyWordType: 1,
		groupType: '',
		time: [],
		isSend: true,
	},
};
export const takeGroupListParams = {
	total: 0,
	list: [],
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 0,
		startDate: '',
		endDate: '',
		keyWord: '',
		keyWordType: 1,
		groupType: '',
		time: [],
		isSend: false,
	},
};
export const auditListParams = {
	total: 0,
	list: [],
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 0,
		startDate: '',
		endDate: '',
		time: [],
		keyWord: '',
		keyWordType: 1,
		groupType: '',
	},
};
export const fileOne = {
	attachmentName: '',
	attachmentTypeName: '旅行合同上传：',
	attachmentType: 1,
	attachmentUrl: '',
	oid: null,
}

export const fileTwo = {
	attachmentName: '',
	attachmentTypeName: '委托接待协议上传：',
	attachmentType: 2,
	attachmentUrl: '',
	oid: null,
}

export const fileThree = {
	attachmentName: '',
	attachmentTypeName: '包车合同上传：',
	attachmentType: 3,
	attachmentUrl: '',
	oid: null,
}
export const useTravelStore = defineStore({
	id: 'travel',
	state: () => ({
		// info
		groupMode: {
			[GroupMode.All]: '全部',
			[GroupMode.TeamGroup]: '协作组团',
			[GroupMode.NoTeamGroup]: '非协作组团',
		},
		groupStatus: {
			[GroupStatus.Drafts]: '草稿',
			[GroupStatus.WaitRegiment]: '待审核',
			[GroupStatus.WaitingGroup]: '待接团',
			// [GroupStatus.RefuseGroup]: '拒绝接团',
			[GroupStatus.Cancellation]: '已散团',
			[GroupStatus.HaveABall]: '已接团',
			[GroupStatus.WaitingChange]: '待变更',
			// [GroupStatus.CloseAnAccount]: '已结算',
			[GroupStatus.Overtime]: '已过期',
			[GroupStatus.WaitingTask]: '待处理'
		},
		guideType: {
			[GuideType.UnderGuide]: '直属导游',
			[GuideType.AppointGuide]: '可委派导游',
		},
		genderList: [
			{
				name: '男',
				codeValue: Gender.Male,
			},
			{
				name: '女',
				codeValue: Gender.Madam,
			},
		],
		insuranceList: [
			{
				name: '旅责险',
				codeValue: insuranceType.brigade,
			},
			{
				name: '意外险',
				codeValue: insuranceType.accident,
			},
		],
		IDCard: [],
		specialId: [],
		trafficType: [],
		trafficColor: [],
		baseInfo: {
			subTravelOperatorOid: '',
			subTravelOperatorName: '',
			subTravelOperatorPhone: '',
			teamType: '',
			startDate: '',
			endDate: '',
			groupType: '',
			status: '',
			itineraryNo: '',
		},
		isOptional: false, //是否任意选择综费
		setStarEndHMS: {
			start: {},
			end: {},
		},
		setDisabled: (current: Dayjs) => {
			return (current && current < dayjs().subtract(1, 'day')) || current > dayjs().startOf('day');
		},
		defaultStartTime: new Date(2022, 12, 1, 0, 0, 0),
		defaultEndTime: new Date(2022, 12, 1, 0, 0, 0),
		setDisabledTime: () => {},
		teamTime: [],
		guideList: [],
		touristList: [],
		trafficList: [],
		traveInfo: {},
		sendTabList: [], //发团tab
		takeTabList: [], //接团tab
		attachmentList: [fileOne, fileTwo, fileThree],
		compositeProducts: [],
		curentProduct: [] as any,
		hotels: [],
		productList: [{ productId: null }], //综费
		scenicTickets: [],
		insuranceStatus: null,
		checkInsurance: false,
		gouvyList: [
			{
				feeName: '古维管理费',
				touristNum: '',
				payableNum: '',
				payablePrice: '',
				isInitiateReductionName: '待接团后由地接社申请',
				isReductionPassedName: '',
				issueStatusName: '',
			},
		],
		teamType: '',
		feeModel: {
			[FeeModel.Number]: '人数',
			[FeeModel.Price]: '价格',
		},
		templateHotel: [],
		templateTicket: [],
		templateGuide: [],
		columnsIndex: 0,
		traveList: {
			drafts: cloneDeep(traveListParams),
			waitingGroup: cloneDeep(traveListParams),
			haveABall: cloneDeep(traveListParams),
			refuseGroup: cloneDeep(traveListParams),
			waitingChange: cloneDeep(traveListParams),
			closeAnAccount: cloneDeep(traveListParams),
			cancellation: cloneDeep(traveListParams),
			overtime: cloneDeep(traveListParams),
			waitRegiment: cloneDeep(traveListParams),
			waitingTask: cloneDeep(traveListParams)
		},
		auditList: {
			financeSendGroup: cloneDeep(auditListParams),
			financeChange: cloneDeep(auditListParams),
			withdrawalChange: cloneDeep(auditListParams),
			administrativeSendGroup: cloneDeep(auditListParams),
			administrativeChange: cloneDeep(auditListParams),
		},
		takeGroupList: {
			drafts: cloneDeep(takeGroupListParams),
			waitingGroup: cloneDeep(takeGroupListParams),
			waitingReserved: cloneDeep(takeGroupListParams),
			dispatched: cloneDeep(takeGroupListParams),
			cancellation: cloneDeep(takeGroupListParams),
			waitingChange: cloneDeep(takeGroupListParams),
			overtime: cloneDeep(takeGroupListParams),
			waitingOutGroup: cloneDeep(takeGroupListParams),
			waitingHandle: cloneDeep(takeGroupListParams),
		},
		enterpriseState: [
			{
				stateName: '未提交',
				descriptions: '',
			},
			{
				stateName: '待审核',
				descriptions: '已提交信息变更审核，请耐心等待。',
			},
			{
				stateName: '审核通过',
				descriptions: '',
			},
			{
				stateName: '审核未通过',
				descriptions: '信息变更申请被驳回！',
			},
		],
		businessTypeOptions: {
			TRAVEL: {
				submitFunc: 'submitInformationAudit',
			},
			HOTEL: {
				submitFunc: 'editHotelDetailInfo',
			},
			TICKET: {
				submitFunc: 'changeScenicSpotInformation',
			},
			CATERING: {
				submitFunc: 'getCateringAudit',
			},
		},
		itineraryStatusList: [],

		auditStatus: {
			[AuditStaus.AdministrativeSendGroup]: '发团审核',
			[AuditStaus.AdministrativeChange]: '变更审核',
			[AuditStaus.FinanceSendGroup]: '发团审核',
			[AuditStaus.FinanceChange]: '变更审核',
			[AuditStaus.withdrawalChange]: '撤销重提审核',
		},
		takeGroupStatus: {
			[TakeGroupStatus.Drafts]: '草稿',
			[TakeGroupStatus.WaitingGroup]: '待接团',
			[TakeGroupStatus.WaitingReserved]: '待预订',
			[TakeGroupStatus.Dispatched]: '已出团',
			[TakeGroupStatus.Cancellation]: '已散团',
			[TakeGroupStatus.WaitingChange]: '待变更',
			[TakeGroupStatus.Overtime]: '已过期',
			[TakeGroupStatus.WaitingOutGroup]: '待出团',
			[TakeGroupStatus.WaitingHandle]: '待处理',
		},
		revokeParams: {},
	}),
	getters: {
		// 草稿
		teamStatus(): boolean {
			const res: any = this.itineraryStatusList.filter((it: any) => it.status == this.baseInfo.status)[0];

			return !res || res.codeName === CODEVALUE.TRAVE_CODE.DRAFT;
		},
		// 预定
		reserveStatus(): boolean {
			const res: any = this.itineraryStatusList.filter((it: any) => it.status == this.baseInfo.status)[0];
			return res && (res.codeName === CODEVALUE.TRAVE_CODE.WAIT_RESERVE_HOTEL || res.codeName === CODEVALUE.TRAVE_CODE.WAIT_GO_OUT || res.codeName === CODEVALUE.TRAVE_CODE.AT_OUT);
		},
	},
	actions: {
		setDisabledDate() {
			return (current: Dayjs) => {
				if (this.teamTime && this.teamTime[0]) {
					return (dayjs(this.teamTime[0]) && dayjs(this.teamTime[0]).startOf('day') > current && current) ||
							(dayjs(this.teamTime[1]) && dayjs(this.teamTime[1]).endOf('day') < current && current)
				} else {
					return current && current < dayjs().endOf('day') || 
							current > dayjs().startOf('day');
				}
				
			}
		},
		async getTravelList(params: object) {
			const res = await api.travelManagement.getTravelList(params);
			res.content = res.content.map((it: TraveDataItem) => {
				it.time = it.startDate + '-' + it.endDate;
				it.groupTypeStr = this.groupMode[it.groupType];
				return it;
			});
			return res;
		},
		async getTraveCode(codeValue: string, type: string) {
			if (type === 'IDCard' && this.IDCard.length) return;
			const res = await api.commonApi.getCodeValue({ codeValue });
			switch (type) {
				case 'IDCard':
					this.IDCard = res;
					break;
				case 'specialId':
					this.specialId = res;
					break;
				case 'trafficType':
					this.trafficType = res;
					break;
				case 'trafficColor':
					this.trafficColor = res;
					break;
			}
		},
		async getAuditList(params: object) {
			const res = await api.travelManagement.getAuditList(params);
			res.content = res.content.map((it: TraveDataItem) => {
				it.time = it.startDate + '-' + it.endDate;
				return it;
			});
			return res;
		},
		async getChangeItineraryList(params: object) {
			const res = await api.travelManagement.getChangeItineraryList(params);
			res.content = res.content.map((it: TraveDataItem) => {
				it.time = it.startDate + '-' + it.endDate;
				return it;
			});
			return res;
		},
		setTouristList(list: any) {
			this.touristList = list;
		},
		setBaseInfo(data: any) {
			this.baseInfo = data;
		},
		setGuideList(list: any) {
			this.guideList = list;
		},
		setTrafficList(list: any) {
			this.trafficList = list;
		},
		setTraveInfo(data: any) {
			this.traveInfo = data;
		},
		setFileInfo(data: any) {
			this.attachmentList = data;
		},
		setCompositeProducts(data: any) {
			this.compositeProducts = data;
		},
		setTeamType(data: any) {
			this.teamType = data;
		},
		setHotels(data: any) {
			this.hotels.splice(this.columnsIndex, 1, data);
		},
		setAllHotel(data: any) {
			this.templateHotel = data;
		},
		setAllTicket(data: any) {
			this.templateTicket = data;
		},
		setTemplateGuide(data: any) {
			this.templateGuide = data;
		},
		setHotelsStatus(id: string) {
			this.hotels = this.hotels.map((it: any) => {
				if (it.oid == id) {
					return {
						...it,
						orderStatus: 1,
					};
				} else {
					return it;
				}
			}) as any;
		},
		setTicketStatus(id: string) {
			this.scenicTickets = this.scenicTickets.map((it: any) => {
				if (it.oid == id) {
					return {
						...it,
						// orderStatus: 1
					};
				} else {
					return it;
				}
			}) as any;
		},
		setTicket(data: any) {
			this.scenicTickets.splice(this.columnsIndex, 1, data);
		},
		setTraveList(data: any, key: Field) {
			this.traveList[key].list = data.content;
			this.traveList[key].total = data.total;
		},
		setAuditList(data: any, key: AuditField) {
			this.auditList[key].list = data.content;
			this.auditList[key].total = data.total;
		},
		setTakeGroupList(data: any, key: TakeGroupField) {
			this.takeGroupList[key].list = data.content;
			this.takeGroupList[key].total = data.total;
		},
		async getItineraryStatus() {
			console.log(this.itineraryStatusList,'FFFFFFFFFFFFFF');
			if (this.itineraryStatusList.length) return;
			const res = await api.travelManagement.getItineraryStatus();
			this.itineraryStatusList = res;
		},
		async getManagementExpenses(id: any) {
			const res = await api.getManagementExpenses(id);
			this.gouvyList = res;
		},
		async getItineraryListTab() {
			if (this.sendTabList.length) return;
			const { takeTabList, sendTabList } = await api.travelManagement.getItineraryListTab();
			this.sendTabList = sendTabList;
			this.takeTabList = takeTabList;
		},
		async getHealthCode(list: Array<any>) {
			const tourist = list.map((item: any) => {
				return {
					name: item.name,
					certificateId: item.certificateNo,
				};
			});
			const res = await api.travelManagement.getHealthCode(tourist);
			console.log(res);
			return list.map((item: any, index: number) => {
				item.healthCode = res[index].healthCodeStatus;
				return item;
			});
		},
		setRevokeParams(value: any) {
			this.revokeParams = value;
		},
		tempeletSetHotels(data: any, oid: string, hotelId: string) {
			if (hotelId) {
				data.oid = oid;
				return Object.assign(this.hotels.filter((item: any) => hotelId == item.hotelId)[0], data);
			}
			if (data.oid) {
				Object.assign(this.hotels.filter((item: any) => data.oid == item.oid)[0], data);
			} else {
				data.oid = oid;
				let newData = [...this.hotels, data];
				this.hotels = newData as any;
				console.log(this.hotels, data, newData);
			}
		},
		tempeleteSetTicket(data: any, oid: string, productId: string) {
			if (productId) {
				data.oid = oid;
				return Object.assign(this.scenicTickets.filter((item: any) => productId == item.scenicId)[0], data);
			}
			if (data.oid) {
				Object.assign(this.scenicTickets.filter((item: any) => data.oid == item.oid)[0], data);
			} else {
				data.oid = oid;
				let newData = [...this.scenicTickets, data];
				this.scenicTickets = newData as any;
				console.log(this.scenicTickets, data, newData);
			}
		},
	},
});
