import { defineStore } from 'pinia';
import { store } from '../index';

export const useNavigatorBar = defineStore('navigatorBar', {
	// id: 'navigatorBar',
	state: () => ({
		// info
		title: [],
	}),
	getters: {
		getNavigator(): Array<string> {
			return this.title;
		},
	},
	actions: {
		setNavigator(arr: any) {
			this.title = arr;
		},
		clearNavigator() {
			this.title = [];
		},
	},
});

// Need to be used outside the setup
export function useCounterWithOut() {
	return useNavigatorBar(store);
}
