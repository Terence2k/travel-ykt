import { defineStore } from 'pinia';
import { GroupMode, GroupStatus, Gender, GuideType, FeeModel, insuranceType, AuditStaus, TakeGroupStatus } from '@/enum';
import api from '@/api/index';
import { cloneDeep, toArray } from 'lodash';
import { AuditField, Field, TakeGroupField } from '@/type';
import dayjs, { Dayjs } from 'dayjs';
import { CODEVALUE } from '@/constant';
interface TraveDataItem {}
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
export const useTravelStore = defineStore({
	id: 'travel',
	state: () => ({
		guideType: {
			[GuideType.UnderGuide]: '直属导游',
			[GuideType.AppointGuide]: '可委派导游',
		},
		setDisabled: (current: Dayjs) => {
			return (current && current < dayjs().subtract(1, 'day')) || current > dayjs().startOf('day');
		},
		baseInfo: [] as any,
		guideList:[],
		trafficList:[],
		IDCard: [],
		specialId:[],
		trafficType: [],
		trafficColor: [],
		hotelList:[],
		ticketsList:[],
    attachmentList: [],
	}),
	getters: {},
	actions: {
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
		setBaseInfo(data: any) {
			this.baseInfo = data;
		},
		setGuideList(list: any) {
			this.guideList = list;
		},
		setTrafficList(list: any) {
			this.trafficList = list;
		},
	},
});
