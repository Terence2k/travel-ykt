import { defineStore } from 'pinia';
import { store } from '../index';

export const useCounter = defineStore({
	id: 'counter',
	state: () => ({
		// info
		info: '212',
	}),
	getters: {
		count(): string {
			return this.info;
		},
	},
	actions: {
		setInfo(info: string) {
			this.info = info;
		},
	},
});

// Need to be used outside the setup
export function useCounterWithOut() {
	return useCounter(store);
}
