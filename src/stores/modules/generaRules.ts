import { defineStore } from 'pinia';
import { store } from '../index';
import api from '@/api';
// 产品规则和通用规则的数据
export const useGeneraRules = defineStore('menuManage', {
	state: () => ({
		teamTypeList: [],
		productTypeList: [
			{ value: 1, name: '景区' },
			{ value: 2, name: '酒店' },
			{ value: 3, name: '餐饮' },
		],
		ruleStatusList: [
			{ value: 1, name: '启用' },
			{ value: 0, name: '禁用' },
		],
		chargeModelList: [
			{ value: 1, name: '百分比' },
			{ value: 2, name: '人数' },
			{ value: 3, name: '价格' },
		],
		isPrepaidList: [
			{ value: 1, name: '是' },
			{ value: 0, name: '否' },
		],
		prepaidCompanyList: [],
		productSonTypeList: [
			{ value: 1, name: '单票', type: 'ONE' },
			{ value: 0, name: '联票', type: 'UNITE' },
			{ value: 2, name: '演出票', type: 'SHOW' },
			// { value: 'SELF', name: '没有子产品，即产品本身' },
		],
	}),
	getters: {},
	actions: {
		//获取团队类型
		getTeamTypeList() {
			if (!this.teamTypeList.length) {
				api.productRuleTeamType().then((res: any) => {
					this.teamTypeList = res;
				});
			}
		},
		// 获取企业业态
		getPrepaidCompanyList() {
			if (!this.prepaidCompanyList.length) {
				api.getPrepaidCompanyList().then((res: any) => {
					this.prepaidCompanyList = res.filter((item: any) => {
						return item.oid !== 202;
					});
				});
			}
		},
	},
});
