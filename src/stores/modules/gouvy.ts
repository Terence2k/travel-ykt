import { defineStore } from 'pinia';
import { GouvyStatus,revocationStatus} from '@/enum';
import api from '@/api/index';
import { cloneDeep } from 'lodash';
import { Field } from '../../views/gouvyManagement/exemptionManagement/type/index';
import { Fieold } from '../../views/gouvyManagement/revocationManagement/type/index';
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
export const revocationManagementParams = {
	total: 0,
	list: [],
	params: {
		pageNo: 1,
		pageSize: 10,
		subTravelName:'',
		itineraryStartDate: '',
		itineraryNo: '',
		routeName:'',
		tabNo:0,
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
		revocationManagementStatus: {
			[revocationStatus.waits]: '待审核',
			[revocationStatus.success]: '审核通过',
			[revocationStatus.refuse]: '审核驳回',
		},
		revocationManagementList: {
			waits: cloneDeep(revocationManagementParams),
			success: cloneDeep(revocationManagementParams),
			refuse: cloneDeep(revocationManagementParams),
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
		setRevocationManagementList(data: any, key: Fieold) {
			this.revocationManagementList[key].list = data.content;
			this.revocationManagementList[key].total = data.total;
		},
	},
});
