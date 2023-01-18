import { defineStore } from 'pinia';
import { store } from '../index';
import api from '@/api';
// 产品规则和通用规则的数据
export const useGeneraRules = defineStore('generaRules', {
	state: () => ({
		teamTypeList: [],
		productTypeList: [
			{ value: 1, name: '景区' },
			{ value: 2, name: '酒店' },
			{ value: 3, name: '餐饮' },
			{ value: 4, name: '综费产品' },
			{ value: 5, name: '古维' },
		],
		currencyProductTypeList: [
			{ value: 1, name: '景区' },
			{ value: 2, name: '酒店' },
			{ value: 3, name: '餐饮' },
			{ value: 4, name: '综费产品' },
			{ value: 5, name: '古维' },
		],
		ruleStatusList: [
			{ value: 1, name: '启用' },
			{ value: 0, name: '禁用' },
		],
		chargeModelList: [
			{ value: 1, name: '百分比' },
			{ value: 2, name: '按房间收费' },
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
		deductionModelList: [
			{ value: 1, name: '冻结金额' },
			{ value: 2, name: '已核销金额' },
			{ value: 0, name: '未核销金额' },
		],
		hotelRatedList: [], //酒店星级
		getDictionaryList: [], // 报表费用归属数据
		productSettlementRuleBack: false,
		// 缓存产品结算页面跳转数据
		productSettlementRuleParams: {
			scenicId: null, //关联景区id
			productName: null, //产品名称
			productType: 1, //产品类型 1-景区 2-酒店 3-餐饮
			productSonType: null, //产品类型下拉列表，UNITE-联票 ONE-单票 SHOW-演出票
			hasProductRule: null, //是否有结算规则 true-是 false-否
			pageNo: 1, //页号
			pageSize: 10, //页大小
		},
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
						return item.oid !== 202 && item.oid !== 116 && item.oid !== 117 && item.oid !== 118;
					});
				});
			}
		},
		//获取酒店启动星级枚举
		getHotelRatedList() {
			if (!this.hotelRatedList.length) {
				api.currencySettlementHotelRatedList().then((res: any) => {
					console.log(res, `res123312`);
					this.hotelRatedList = res;
				});
			}
		},
		// 获取报表的字典
		getDictionary() {
			if (!this.getDictionaryList.length) {
				api.commonApi.getCodeValue({ codeValue: 'BUSINESS_TYPE' }).then((res: any) => {
					this.getDictionaryList = res;
				});
			}
		},
		resetProductSettlementRuleParams() {
			this.productSettlementRuleBack = false;
			this.productSettlementRuleParams = {
				scenicId: null, //关联景区id
				productName: null, //产品名称
				productType: 1, //产品类型 1-景区 2-酒店 3-餐饮
				productSonType: null, //产品类型下拉列表，UNITE-联票 ONE-单票 SHOW-演出票
				hasProductRule: null, //是否有结算规则 true-是 false-否
				pageNo: 1, //页号
				pageSize: 10, //页大小
			};
		},
	},
});
