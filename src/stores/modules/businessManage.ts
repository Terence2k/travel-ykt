import { defineStore } from 'pinia';
import { store } from '../index';
import api from '@/api';

export const useBusinessManageOption = defineStore('businessManage', {
	state: () => ({
		businessTypeOption: [],
	}),
	getters: {},
	actions: {
		//获取企业类型
		getBusinessTypeOption() {
			api.businessTypeDropDown().then((res: any) => {
				const options = res.map((i: any) => {
					return { name: i.name, oid: i.oid, codeValue: i.codeValue };
				});
				this.businessTypeOption = options;
				return options;
			});
		},
	},
});

// Need to be used outside the setup
export function useCounterWithOut() {
	return useBusinessManageOption(store);
}
