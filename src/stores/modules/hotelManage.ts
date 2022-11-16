import { defineStore } from 'pinia';
import { HotelStatus } from '@/enum';
import api from '@/api/index';
import { cloneDeep } from 'lodash';
import { Field } from '../../views/hotelManagement/order/type/index';
export const hotelListParams = {
	total: 0,
	list: [],
	params: {
		pageNo: 1,
		pageSize: 10,
		scheduledTime: '',
		arrivalDate: '',
		itineraryNo: '',
		status: 1,
	},
};
export const useHotelStore = defineStore({
	id: 'hotel',
	state: () => ({
		// info
		HotelOrderStatus: {
			[HotelStatus.waits]: '待审核',
			[HotelStatus.success]: '审核通过',
			[HotelStatus.refuse]: '审核不通过',
			[HotelStatus.cancal]: '未提交',
			[HotelStatus.finish]: '已完成',
		},
		HotelList: {
			waits: cloneDeep(hotelListParams),
			success: cloneDeep(hotelListParams),
			refuse: cloneDeep(hotelListParams),
			cancal: cloneDeep(hotelListParams),
			finish: cloneDeep(hotelListParams),
		},
	}),
	getters: {
		// count(): string {
		// 	return this.info;
		// },
	},
	actions: {
		setOrderList(data: any, key: Field) {
			this.HotelList[key].list = data.content;
			this.HotelList[key].total = data.total;
		},
	},
});
