import { defineStore } from 'pinia';
import { store } from '../index';
import api from '@/api';
import { log } from 'console';
import { getItineraryStatus } from '@/api/settlementManage.api';
// 结算管理的筛选项数据
export const settlementOptions = defineStore('settlement', {
	state: () => ({
		teamTypesLists: [], // 团队类型
		groupSocietyList: [], //组团社
		earthContactAgencyList: [], // 地接社
		businessTypeOptionList: [], //企业类型
		itineraryStatus: [], //行程单枚举状态
		testStatus: 10,
	}),
	getters: {},
	actions: {
		//获取团队类型
		getTeamTypeList() {
			if (!this.teamTypesLists.length) {
				api.productRuleTeamType().then((res: any) => {
					this.teamTypesLists = res;
				});
			}
		},
		// 获取组团社
		getGroupSocietyList() {
			if (!this.groupSocietyList.length) {
				api.getTravelInfo(1).then((res: any) => {
					this.groupSocietyList = res.filter((item: any) => {
						return item.oid !== 202;
					});
				});
			}
		},
		// 获取地接社
		getEarthContactAgencyList() {
			if (!this.earthContactAgencyList.length) {
				api.getTravelInfo(0).then((res: any) => {
					this.earthContactAgencyList = res.filter((item: any) => {
						return item.oid !== 202;
					});
				});
			}
		},
		//获取企业类型
		getBusinessTypeOptionList() {
			if (!this.businessTypeOptionList.length) {
				api.businessTypeDropDown('BUSINESS_TYPE').then((res: any) => {
					this.businessTypeOptionList = res.filter((item: any) => {
						// 筛除 酒店、餐饮、景区 选项
						return item.oid !== 116 && item.oid !== 117 && item.oid !== 118;
					});;
				});
			}
		},
		// 获取行程单枚举状态
		getItineraryStatus() {
			if (!this.itineraryStatus.length) {
				api.getItineraryStatus().then((res: any) => {
					this.itineraryStatus = res;
				});
			}
		},
	},
});
