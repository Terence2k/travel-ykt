import { defineStore } from 'pinia';
import { store } from '../index';

export const useRoleManage = defineStore('roleManage', {
	state: () => ({
		businessType: [
      {
        title:"全部",
        value:"ALL",
      },
      {
        title:"酒店",
        value:"HOTEL",
      },
      {
        title:"餐饮",
        value:"CATERING",
      },
      {
        title:"门票",
        value:"TICKET",
      },
      {
        title:"旅行社",
        value:"TRAVEL",
      },
      {
        title:"一卡通",
        value:"YKT",
      },
      {
        title:"监理",
        value:"SUPERVISE",
      },
      {
        title:"协会",
        value:"ASSOCIATION",
      },
      {
        title:"集团",
        value:"GROUP",
      },
      {
        title:"文旅局",
        value:"CULTURE_BUREAU",
      }]
	}),
	getters: {
	},
	actions: {
	},
});

// Need to be used outside the setup
export function useCounterWithOut() {
	return useRoleManage(store);
}
