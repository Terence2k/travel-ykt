import { defineStore } from 'pinia';
import { store } from '../index';
import api from '@/api';

export const useBusinessManageOption = defineStore('businessManage', {
	state: () => ({
		businessTypeOption: [],
		proviceList: [],
		cityList: [],
		areaList: [],
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
				return options;
			});
		},

		/**
		 * 省份
		 * @param pid 最顶级的pid 是 0，上一级的oid是下一级的pid
		 */
		getAllAreaProvice(pid: any) {
			api.getAllArea(pid, 1).then((res: any) => {
				const options = res.map((i: any) => {
					return { label: i.name, value: i.oid, isLeaf: false };
				});
				this.proviceList = options;
				return options;
			});
		},

		/**
		 * 市区
		 * @param pid 最顶级的pid 是 0，上一级的oid是下一级的pid
		 */
		getAllAreaCity(pid: any) {
			api.getAllArea(pid, 2).then((res: any) => {
				const options = res.map((i: any) => {
					return { label: i.name, value: i.oid, isLeaf: false };
				});
				this.cityList = options;
				return options;
			});
		},

		/**
		 * 辖区
		 * @param pid 最顶级的pid 是 0，上一级的oid是下一级的pid
		 */
		getAllArea(pid: any) {
			api.getAllArea(pid, 3).then((res: any) => {
				const options = res.map((i: any) => {
					return { label: i.name, value: i.oid, isLeaf: false };
				});
				this.areaList = options;
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
	},
});

// Need to be used outside the setup
export function useCounterWithOut() {
	return useBusinessManageOption(store);
}
