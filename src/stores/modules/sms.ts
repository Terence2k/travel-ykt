import { defineStore } from 'pinia';
import { HotelStatus } from '@/enum';
import api from '@/api/index';
import { cloneDeep } from 'lodash';
export const smsParams = {
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
export const useSmsStore = defineStore({
	id: 'sms',
	state: () => ({
		// info
        recipientList:[]
	}),
	getters: {
		
	},
	actions: {
		setrecipientList(list: any) {
			this.recipientList = list;
		},
	},
});
