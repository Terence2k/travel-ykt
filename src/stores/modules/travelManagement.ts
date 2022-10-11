import { defineStore } from 'pinia';
import { GroupMode, GroupStatus, Gender, GuideType } from '@/enum';
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
			[GroupStatus.RefuseGroup]: '拒绝接团',
			// [GroupStatus.WaitRegiment]: '待出团',
			[GroupStatus.HaveABall]: '已接团',
			[GroupStatus.WaitingChange]: '待变更',
			[GroupStatus.CloseAnAccount]: '已结算',
			[GroupStatus.Cancellation]: '已撤销',
			[GroupStatus.Overtime]: '审核超时',

		},
		guideType: {
			[GuideType.UnderGuide]: '直属导游',
			[GuideType.AppointGuide]: '可委派导游'
		},
		genderList: [
			{
				name: '男',
				codeValue: Gender.Male
			},
			{
				name: '女',
				codeValue: Gender.Madam
			}
		],
		IDCard: [],
		specialId: [],
		trafficType: [],
		trafficColor: [],
		baseInfo: {
			subTravelOperator: {}
		},
		guideList: [],
		touristList: [],
		trafficList: [],
		traveInfo: {},
		fileInfo: {}
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
		},
		async getTraveCode(codeValue: string, type: string) {
			const res = await api.commonApi.getCodeValue({codeValue})
			switch(type) {
				case 'IDCard' :
					this.IDCard = res;
					break;
				case 'specialId' :
					this.specialId = res;
					break;
				case 'trafficType' :
					this.trafficType = res;
					break;
				case 'trafficColor' :
					this.trafficColor = res;
					break;
			}
		},
		setTouristList(list: any) {
			this.touristList = list
		},
		setBaseInfo(data: any) {
			this.baseInfo = data
		},
		setGuideList(list: any) {
			this.guideList = list
		},
		setTrafficList(list: any) {
			this.trafficList = list
		},
		setTraveInfo(data: any) {
			this.traveInfo = data
		},
		setFileInfo(data: any) {
			this.fileInfo = data
		}
	},
});
