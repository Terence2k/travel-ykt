<template>
	<div class="trave-contaner">
		<CommonSearch>
			<search-item label="关键词搜索">
				<a-input v-model:value="params.keyWord" placeholder="请输入游客姓名、导游姓名、旅行社名称、线路名称等关键字" />
			</search-item>

			<search-item label="组团模式">
				<a-select v-model:value="params.groupType">
					<a-select-option v-for="(value, key) in travelStore.groupMode" :key="key" :value="key">{{ value }}</a-select-option>
				</a-select>
			</search-item>

			<search-item label="行程时间">
				<a-range-picker v-model:value="params.time" show-time format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" />
			</search-item>

			<template #button>
				<a-button @click="query">查询</a-button>
				<a-button style="margin-left: 30px" @click="reset">重置</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="item in pages" :key="item.value" :tab="item.label">
				<!--  v-if="showAddBtn" -->
				<div class="d-flex justify-content-end">
					<a-button style="margin-right: 20px">删除</a-button>
				</div>
				<component :onCheck="check" :is="item.name"></component>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script lang="ts" setup>
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import waitingGroup from './travelTakeGroupList/waitingGroup.vue';
import overtime from './travelTakeGroupList/overtime.vue';
import refuseGroup from './travelTakeGroupList/refuseGroup.vue';
import haveABall from './travelTakeGroupList/haveABall.vue';
import closeAnAccount from './travelTakeGroupList/closeAnAccount.vue';
import waitingChange from './travelTakeGroupList/waitingChange.vue';
import cancellation from './travelTakeGroupList/cancellation.vue';

import { useTravelStore } from '@/stores/modules/travelManagement';
import { GroupStatus, GroupType } from '@/enum';
import { getUserInfo } from '@/utils/util';
import { ROLE } from '@/constant';
import api from '@/api';

const userInfo = getUserInfo();
const travelStore = useTravelStore();
const router = useRouter();
const activeKey = ref(GroupStatus.WaitingGroup);
const check = ref(false);
const params = reactive({
	keyWord: '',
	groupType: '',
	time: [],
	startDate: '',
	endDate: '',
});
const pages = [
	{
		name: waitingGroup,
		label: travelStore.groupStatus[GroupStatus.WaitingGroup],
		value: GroupStatus.WaitingGroup,
	},
	{
		name: haveABall,
		label: travelStore.groupStatus[GroupStatus.HaveABall],
		value: GroupStatus.HaveABall,
	},
	{
		name: refuseGroup,
		label: travelStore.groupStatus[GroupStatus.RefuseGroup],
		value: GroupStatus.RefuseGroup,
	},
	{
		name: closeAnAccount,
		label: travelStore.groupStatus[GroupStatus.CloseAnAccount],
		value: GroupStatus.CloseAnAccount,
	},
	{
		name: waitingChange,
		label: travelStore.groupStatus[GroupStatus.WaitingChange],
		value: GroupStatus.WaitingChange,
	},
	{
		name: cancellation,
		label: travelStore.groupStatus[GroupStatus.Cancellation],
		value: GroupStatus.Cancellation,
	},
	{
		name: overtime,
		label: travelStore.groupStatus[GroupStatus.Overtime],
		value: GroupStatus.Unpaid,
	},
];

const goToPath = (type: number) => {
	router.push({
		path: '/travel/travel_manage/add_travel',
		query: {
			type,
		},
	});
};
//查询
const query = () => {
	console.log(GroupStatus.Cancellation, '11111111');
};
//重置
const reset = () => {
	(params.keyWord = ''), (params.time = ''), (params.groupType = '');
};
watch(
	() => params.time,
	(newVal) => {
		if (newVal) {
			params.startDate = newVal[0];
			params.endDate = newVal[1];
		} else {
			params.startDate = '';
			params.endDate = '';
		}
	}
);

const showAddBtn = computed(() => {
	return userInfo.sysRoles.some((it: any) => it.roleCode === ROLE.TRAVE_CODE);
});
</script>
<style lang="less" scoped>
.trave-contaner {
	height: 100%;
	::v-deep(.ant-tabs-nav) {
		padding: 0 20px;
	}
	// ::v-deep(.ant-tabs-content-holder) {
	//   padding: 0 20px;
	// }
}
</style>
