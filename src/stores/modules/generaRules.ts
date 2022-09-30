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
		prepaidCompanyList: [
			{ value: 1, name: '旅行社' },
			{ value: 2, name: '集团' },
			{ value: 3, name: '监理公司' },
			{ value: 4, name: '一卡通' },
			{ value: 5, name: '协会' },
		],
		productSonTypeList: [
			{ value: 'ONE', name: '单票' },
			{ value: 'UNITE', name: '联票' },
			{ value: 'SHOW', name: '演出票' },
			{ value: 'SELF', name: '没有子产品，即产品本身' },
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
	},
});
