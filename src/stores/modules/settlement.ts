import { defineStore } from 'pinia';
import { store } from '../index';
import api from '@/api';
import { log } from 'console';
// 结算管理的筛选项数据
export const settlementOptions = defineStore('settlement', {
	state: () => ({
		teamTypesLists: [], // 团队类型
        groupSocietyList: [], //组团社
        earthContactAgencyList: [], // 地接社
        businessTypeOptionList: [], //企业类型
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
            if(!this.businessTypeOptionList.length) {
                api.businessTypeDropDown('BUSINESS_TYPE').then((res: any) => {
                    const options = res.map((i: any) => {
                        return { name: i.name, oid: i.oid, codeValue: i.codeValue };
                    });
                    this.businessTypeOptionList = options;
                    return options;
                });
            }
		},
	},

});
