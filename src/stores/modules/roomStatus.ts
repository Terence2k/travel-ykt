import { defineStore } from 'pinia';
import { store } from '../index';
import api from '@/api';

export const useRoomStatusStore = defineStore('useRoomStatus', {
	state: () => ({
		baseInfoDataSource: [
			{
				id: 1,
				key: 1,
				date: '2022.3.14',
				roomTotal: 50,
				byOneCard: 35,
				byOffline: 10,
				supervisionFee: 10,
				emptyRoomTotal: 300,
				occupancyRate: '87%',
				filer: '李某某',
				reportDate: '2022.3.14 12:30',
				tickStatus: '异常',
			},
			{
				id: 2,
				key: 2,
				date: '2022.3.13',
				roomTotal: 20,
				byOneCard: 15,
				byOffline: 10,
				supervisionFee: 10,
				emptyRoomTotal: 300,
				occupancyRate: '87%',
				filer: '王某',
				reportDate: '2022.3.14 12:30',
				tickStatus: '无',
			},
		],
	}),
	getters: {
		getBaseInfoDataSource(): any {
			return this.baseInfoDataSource;
		},
	},
	actions: {
		setBaseInfoDataSource(value: any) {
			this.baseInfoDataSource = value;
		},
	},
});

export function useRoomStatusWithOut() {
	return useRoomStatusStore(store);
}
