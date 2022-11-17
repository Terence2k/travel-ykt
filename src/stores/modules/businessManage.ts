import { defineStore } from 'pinia';
import { store } from '../index';
import api from '@/api';

export const useBusinessManageOption = defineStore('businessManage', {
	state: () => ({
		businessTypeOption: [],
		companyOptions: [],
		operatorRoleOptions: []
	}),
	getters: {},
	actions: {
		//获取企业类型
		getBusinessTypeOption() {
			api.businessTypeDropDown('BUSINESS_TYPE').then((res: any) => {
				const options = res.map((i: any) => {
					return { name: i.name, oid: i.oid, codeValue: i.codeValue };
				});
				this.businessTypeOption = options;
				return options;
			});
		},
		//根据业态查询企业
		getCompanyByBusinessType(businessType: string) {
			api.getCompanyByBusinessType(businessType).then((res: any) => {
				this.companyOptions = res;
			});
		},
		// 获取中心操作员和门店操作员
		getCenterAndOutletOperator() {
			api.centerAndOutletOperator().then((res: any) => {
				this.operatorRoleOptions = res;
			});
		}
	},
});

// Need to be used outside the setup
export function useCounterWithOut() {
	return useBusinessManageOption(store);
}
