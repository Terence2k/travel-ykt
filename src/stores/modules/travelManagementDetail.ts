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
	id: 'Travel',
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
		touristList: [],
		teamTime: [] as any,
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
		SetHotels(data: any, oid: any, hotelId: string) {
			if (hotelId) {
				console.log(1);

				// data.oid = oid;
				return Object.assign(this.hotelList.filter((item: any) => hotelId == item.hotelId)[0], data);
			}
			if (data.oid) {
				console.log(2);
				// Object.assign(this.hotelList.filter((item: any) => data.oid == item.oid)[0], data);
			} else {
				console.log(3);
				
				data.oid = oid;
				let newData = [...this.hotelList, data];
				this.hotelList = newData as any;
				console.log(this.hotelList, data, newData);
			}
		},
		setTicket(data: any, oid: string, productId: string) {
			if (productId) {
				data.oid = oid;
				return Object.assign(this.ticketsList.filter((item: any) => productId == item.scenicId)[0], data);
			}
			if (data.oid) {
				Object.assign(this.ticketsList.filter((item: any) => data.oid == item.oid)[0], data);
			} else {
				data.oid = oid;
				let newData = [...this.ticketsList, data];
				this.ticketsList = newData as any;
				console.log(this.ticketsList, data, newData);
			}
		},
	},
});
