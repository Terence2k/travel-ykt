import { defineStore } from 'pinia';
import { store } from '../index';

export const useCommonEnum = defineStore({
	id: 'commonEnum',
	state: () => ({
		// info
		auditStatus: ['未提交', '待审核', '审核通过', '审核不通过'],
	}),
	getters: {},
	actions: {},
});

// Need to be used outside the setup
export function useCommonEnumWithOut() {
	return useCommonEnum(store);
}
