import { defineStore } from 'pinia';
import { GroupMode, GroupStatus, Gender, GuideType, FeeModel, insuranceType, AuditStaus} from '@/enum';
import api from '@/api/index';
import { cloneDeep } from 'lodash';
import { Field } from '@/type';
import dayjs, { Dayjs } from 'dayjs';
import { CODEVALUE } from '@/constant';
interface TraveDataItem {
	groupType: GroupMode.All | GroupMode.TeamGroup |GroupMode.NoTeamGroup;
	[k: string]: any
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
		time: []
	}
}
export const useTravelStore = defineStore({
	id: 'travel',
	state: () => ({
		// info
		groupMode: {
			[GroupMode.All]: '全部',
			[GroupMode.TeamGroup]: '协作组团',
			[GroupMode.NoTeamGroup]: '非协作组团'
		},
		groupStatus: {
			[GroupStatus.Drafts]: '草稿',
			[GroupStatus.WaitingGroup]: '待接团',
			[GroupStatus.RefuseGroup]: '拒绝接团',
			// [GroupStatus.WaitRegiment]: '待出团',
			[GroupStatus.HaveABall]: '已接团',
			[GroupStatus.WaitingChange]: '待变更',
			[GroupStatus.CloseAnAccount]: '已结算',
			[GroupStatus.Cancellation]: '已撤销',
			[GroupStatus.Overtime]: '审核超时',

		},
		guideType: {
			[GuideType.UnderGuide]: '直属导游',
			[GuideType.AppointGuide]: '可委派导游'
		},
		genderList: [
			{
				name: '男',
				codeValue: Gender.Male
			},
			{
				name: '女',
				codeValue: Gender.Madam
			}
		],
		insuranceList: [
			{
				name: '旅责险',
				codeValue: insuranceType.brigade
			},
			{
				name: '意外险',
				codeValue: insuranceType.accident
			}
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
			status: ''
		},
		setDisabled: (current: Dayjs) => {
			return current && current < dayjs().subtract(1, 'day') || 
			current > dayjs().startOf('day');
		},
		teamTime: [],
		guideList: [],
		touristList: [],
		trafficList: [],
		traveInfo: {},
		attachmentList: [],
		compositeProducts: [],
		hotels: [],
		scenicTickets: [],
		teamType: '',
		feeModel: {
			[FeeModel.Number]: '人数',
			[FeeModel.Price]: '价格'
		},
		traveList: {
			drafts: cloneDeep(traveListParams),
			waitingGroup: cloneDeep(traveListParams),
			haveABall: cloneDeep(traveListParams),
			refuseGroup: cloneDeep(traveListParams),
			waitingChange: cloneDeep(traveListParams),
			closeAnAccount: cloneDeep(traveListParams),
			cancellation: cloneDeep(traveListParams),
			overtime: cloneDeep(traveListParams)
		},
		auditList: {
			financeSendGroup: cloneDeep(traveListParams),
			financeChange: cloneDeep(traveListParams),
			administrativeSendGroup: cloneDeep(traveListParams),
			administrativeChange: cloneDeep(traveListParams),
		},
		enterpriseState: [
			{
				stateName: '未提交',
				descriptions: ''
			},
			{
				stateName: '待审核',
				descriptions: '已提交信息变更审核，请耐心等待。'
			},
			{
				stateName: '审核通过',
				descriptions: ''
			},
			{
				stateName: '审核未通过',
				descriptions: '信息变更申请被驳回！'
			}
		],
		businessTypeOptions: {
			'TRAVEL': {
				submitFunc: 'submitInformationAudit'
			},
			'HOTEL': {
				submitFunc: 'editHotelDetailInfo' 
			},
			'TICKET': {
				submitFunc: 'changeScenicSpotInformation' 
			},
			'CATERING': {
				submitFunc: 'getCateringAudit' 
			}

		},
		itineraryStatusList: [],

		auditStatus: {
			[AuditStaus.AdministrativeSendGroup]: '发团审核',
			[AuditStaus.AdministrativeChange]: '变更审核',
			[AuditStaus.FinanceSendGroup]: '发团审核',
			[AuditStaus.FinanceChange]: '变更审核',
		},
	}),
	getters: {
		// 草稿
		teamStatus(): boolean {
			const res: any = this.itineraryStatusList.filter((it: any) => it.status == this.baseInfo.status)[0]

			return  res && (res.codeName === CODEVALUE.TRAVE_CODE.DRAFT)
		},
		// 预定
		reserveStatus(): boolean {
			const res: any = this.itineraryStatusList.filter((it: any) => it.status == this.baseInfo.status)[0]
			return  res && (res.codeName === CODEVALUE.TRAVE_CODE.WAIT_RESERVE_HOTEL || res.codeName === CODEVALUE.TRAVE_CODE.WAIT_GO_OUT)
		}
	},
	actions: {
		async getTravelList(params: object) {
			let res = await api.travelManagement.getTravelList(params);
			res.content = res.content.map((it:TraveDataItem) => {
				it.time = it.startDate + '-' + it.endDate;
				it.groupTypeStr = this.groupMode[it.groupType]
				return it
			})
			return res
		},
		async getTraveCode(codeValue: string, type: string) {
			if (type === 'IDCard' && this.IDCard.length) return
			const res = await api.commonApi.getCodeValue({codeValue})
			switch(type) {
				case 'IDCard' :
					this.IDCard = res;
					break;
				case 'specialId' :
					this.specialId = res;
					break;
				case 'trafficType' :
					this.trafficType = res;
					break;
				case 'trafficColor' :
					this.trafficColor = res;
					break;
			}
		},
		async getAuditList(params: object) {
			let res = await api.travelManagement.getAuditList(params);
			res.content = res.content.map((it:TraveDataItem) => {
				it.time = it.startDate + '-' + it.endDate;
				return it
			})
			return res
		},
		setTouristList(list: any) {
			this.touristList = list
		},
		setBaseInfo(data: any) {
			this.baseInfo = data
		},
		setGuideList(list: any) {
			this.guideList = list
		},
		setTrafficList(list: any) {
			this.trafficList = list
		},
		setTraveInfo(data: any) {
			this.traveInfo = data
		},
		setFileInfo(data: any) {
			this.attachmentList = data
		},
		setCompositeProducts(data: any) {
			this.compositeProducts = data;
		},
		setTeamType(data: any) {
			this.teamType = data;
		},
		setHotels(data: any, oid: string) {
			if (data.oid) {
				Object.assign(
					this.hotels.filter((item:any) => data.oid == item.oid)[0], 
					data
				)
			} else {
				data.oid = oid;
				let newData = [...this.hotels, data]
				this.hotels = newData as any;
				console.log(this.hotels, data, newData)
			}
			
		},
		setTicket(data: any, oid: string) {
			if (data.oid) {
				Object.assign(
					this.scenicTickets.filter((item:any) => data.oid == item.oid)[0], 
					data
				)
			} else {
				data.oid = oid;
				let newData = [...this.scenicTickets, data]
				this.scenicTickets = newData as any;
				console.log(this.scenicTickets, data, newData)
			}
			
		},
		setTraveList(data: any, key: Field) {
			this.traveList[key].list = data.content
			this.traveList[key].total = data.total
		},
		setAuditList(data: any, key: Field) {
			this.auditList[key].list = data.content
			this.auditList[key].total = data.total
		},
		async getItineraryStatus() {
			if (this.itineraryStatusList.length) return
			const res = await api.travelManagement.getItineraryStatus();
			this.itineraryStatusList = res
		}
	},
});
