import { defineStore } from 'pinia';
import { store } from '../index';
import api from '@/api';

export const useScenicSpotOption = defineStore('scenicSpot', {
	state: () => ({
		businessTypeOption: [],
		proviceList: [],
		cityList: [],
		areaList: [],
		cateringStoreName: [],
		varificatinPageValue: '',
	}),
	getters: {},
	actions: {
		//获取企业类型
		getBusinessTypeOption() {
			api.getCompandType(115).then((res: any) => {
				const options = res.map((i: any) => {
					return { name: i.name, oid: i.oid };
				});
				this.businessTypeOption = options;
			});
		},

		//餐饮获取门店名称data
		getCateringStoreName() {
			api.getCateringStore().then((res: any) => {
				console.log('2323', res);
				const data = res.map((i: any) => {
					return { shopName: i.shopName, shopId: i.shopId };
				});
				this.cateringStoreName = data;
			});
		},

		/**
		 * 省份
		 * @param pid 最顶级的pid 是 0，上一级的oid是下一级的pid
		 */
		getAllAreaProvice(pid: any) {
			api.getAllArea(pid, 1).then((res: any) => {
				this.proviceList = res;
			});
		},

		/**
		 * 市区
		 * @param pid 最顶级的pid 是 0，上一级的oid是下一级的pid
		 */
		getAllAreaCity(pid: any) {
			api.getAllArea(pid, 2).then((res: any) => {
				console.log('getAllAreaCity', res);
				this.cityList = res;
			});
		},

		/**
		 * 辖区
		 * @param pid 最顶级的pid 是 0，上一级的oid是下一级的pid
		 */
		getAllArea(pid: any) {
			api.getAllArea(pid, 3).then((res: any) => {
				this.areaList = res;
			});
		},

		//清除 省 市区 辖区
		cleanProvice() {
			this.proviceList = [];
			this.cleanCity();
		},
		//清除 市区 辖区
		cleanCity() {
			this.cityList = [];
			this.cleanArae();
		},
		//清除 辖区
		cleanArae() {
			this.areaList = [];
		},
		//设置核销记录
		setVerification(value: string) {
			this.varificatinPageValue = value;
		},
		cleanVerification() {
			this.varificatinPageValue = '';
		},
	},
});

// Need to be used outside the setup
export function useCounterWithOut() {
	return useScenicSpotOption(store);
}
