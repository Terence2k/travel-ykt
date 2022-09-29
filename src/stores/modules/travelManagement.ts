import { defineStore } from 'pinia';
import { GroupMode, GroupStatus } from '@/enum';
import api from '@/api/index';
interface TraveDataItem {
	groupType: GroupMode.All | GroupMode.TeamGroup |GroupMode.NoTeamGroup;
	[k: string]: any
}
export const useTravelStore = defineStore({
	id: 'travel',
	state: () => ({
		// info
		groupMode: {
			[GroupMode.All]: '全部',
			[GroupMode.TeamGroup]: '协作组团',
			[GroupMode.NoTeamGroup]: '非协作组团'
		},
		groupStatus: {
			[GroupStatus.Drafts]: '草稿',
			[GroupStatus.WaitingGroup]: '待接团',
			[GroupStatus.Unpaid]: '待支付',
			[GroupStatus.RefuseGroup]: '拒绝接团',
			[GroupStatus.WaitRegiment]: '待出团',
			[GroupStatus.HaveABall]: '已出团',
			[GroupStatus.WaitingChange]: '待变更',
			[GroupStatus.CloseAnAccount]: '已结算',
			[GroupStatus.Cancellation]: '已作废'
		}
	}),
	getters: {
		// count(): string {
		// 	return this.info;
		// },
	},
	actions: {
		async getTravelList(params: object) {
			let res = await api.travelManagement.getTravelList(params);
			res.content = res.content.map((it:TraveDataItem) => {
				it.time = it.startDate + '-' + it.endDate;
				it.groupTypeStr = this.groupMode[it.groupType]
				return it
			})
			return res
		}
	},
});
