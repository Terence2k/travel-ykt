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
		defaultStartTime: new Date(2022, 12, 1, 0, 0, 0),
		defaultEndTime: new Date(2022, 12, 1, 0, 0, 0),
		setDisabled: (current: Dayjs) => {
			return (current && current < dayjs().subtract(1, 'day')) || current > dayjs().startOf('day');
		},
		baseInfo: [] as any,
		guideList: [],
		trafficList: [],
		touristList: [],
		teamTime: [] as any,
		IDCard: [],
		specialId: [],
		trafficType: [],
		trafficColor: [],
		hotelList: [],
		disbledDate: true as any,
		ticketsList: [],
		auditticket: [] as any,
		attachmentList: [
			{
				attachmentName: '',
				attachmentTypeName: '旅行合同上传：',
				attachmentType: 1,
				attachmentUrl: '',
				oid: null,
			},
			{
				attachmentName: '',
				attachmentTypeName: '委托接待协议上传：',
				attachmentType: 2,
				attachmentUrl: '',
				oid: null,
			},
			{
				attachmentName: '',
				attachmentTypeName: '包车合同上传：',
				attachmentType: 3,
				attachmentUrl: '',
				oid: null,
			},
		],
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
		setDisabledTime() {
			return (current: Dayjs) => {
				if (this.teamTime && this.teamTime[0]) {
					return (
						(dayjs(this.teamTime[0]) && dayjs(this.teamTime[0]).startOf('day') > current && current) ||
						(dayjs(this.teamTime[1]) && dayjs(this.teamTime[1]).endOf('day') < current && current)
					);
				} else {
					return (current && current < dayjs().endOf('day')) || current > dayjs().startOf('day');
				}
			};
		},
		setdisbledDate() {
			console.log(this.disbledDate, 'this.disbledDate');
		},
		setBaseInfo(data: any) {
			this.baseInfo = data;
		},
		setauditticket(data: any) {
			this.auditticket = data;
		},
		setGuideList(list: any) {
			this.guideList = list;
		},
		setTrafficList(list: any) {
			this.trafficList = list;
		},
		SetHotels(data: any, oid: any, key: string) {
			if (key) {
				console.log(1);

				data.oid = oid;
				return Object.assign(this.hotelList.filter((item: any) => key == item.key)[0], data);
			}
			if (data.oid) {
				console.log(2);

				return Object.assign(this.hotelList.filter((item: any) => data.oid == item.oid)[0], data);
			}
			if (data.changeId) {
				console.log(3);

				return Object.assign(this.hotelList.filter((item: any) => data.changeId == item.changeId)[0], data);
			} else {
				data.oid = oid;
				if (!this.hotelList) {
					let newData = [data];
					this.hotelList = newData as any;
				} else {
					let newData = [...this.hotelList, data];
					this.hotelList = newData as any;
				}
			}
		},
		setTicket(data: any, oid: string, key: string) {
			if (key) {
				return Object.assign(this.ticketsList.filter((item: any) => key == item.key)[0], data);
			}
			if (data.oid) {
				return Object.assign(this.ticketsList.filter((item: any) => data.oid == item.oid)[0], data);
			}
			if (data.changeId) {
				return Object.assign(this.ticketsList.filter((item: any) => data.changeId == item.changeId)[0], data);
			} else {
				data.oid = oid;
				if (!this.ticketsList) {
					let newData = [data];
					this.ticketsList = newData as any;
				} else {
					let newData = [...this.ticketsList, data];
					this.ticketsList = newData as any;
				}
			}
		},
		setFileInfo(data: any) {
			this.attachmentList = data;
		},
	},
});
