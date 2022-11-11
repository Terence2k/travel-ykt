import { defineStore } from 'pinia';
import { GouvyStatus } from '@/enum';
import api from '@/api/index';
import { cloneDeep } from 'lodash';
import { Field } from '../../views/gouvyManagement/exemptionManagement/type/index';
export const gouvyListParams = {
	total: 0,
	list: [],
	params: {
		pageNo: 1,
		pageSize: 10,
		itineraryStartDate: '',
		itineraryNo: '',
		subTravelName: '',
		auditStatus: 1,
	},
};
export const useGouvyStore = defineStore({
	id: 'gouvy',
	state: () => ({
		// info
		GouvyOrderStatus: {
			[GouvyStatus.waits]: '待审核',
			[GouvyStatus.success]: '审核通过',
			[GouvyStatus.refuse]: '审核不通过',
		},
		gouvyList: {
			waits: cloneDeep(gouvyListParams),
			success: cloneDeep(gouvyListParams),
			refuse: cloneDeep(gouvyListParams),
		},
	}),
	getters: {
		// count(): string {
		// 	return this.info;
		// },
	},
	actions: {
		setOrderList(data: any, key: Field) {
			this.gouvyList[key].list = data.content;
			this.gouvyList[key].total = data.total;
		},
	},
});
