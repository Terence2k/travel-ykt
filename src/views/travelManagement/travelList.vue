<template>
	<div class="trave-contaner">
		<CommonSearch>
			<search-item label="关键词搜索">
				<a-input v-model:value="travelStore.traveList[chart].params.keyWord" placeholder="请输入游客姓名、导游姓名、旅行社名称、线路名称等关键字" />
			</search-item>

			<search-item label="组团模式">
				<a-select v-model:value="travelStore.traveList[chart].params.groupType">
					<a-select-option v-for="(value, key) in travelStore.groupMode" :key="key" :value="key">{{ value }}</a-select-option>
				</a-select>
			</search-item>

			<search-item label="行程时间">
				<!-- <a-range-picker
					v-model:value="travelStore.traveList[chart].params.time"
					show-time
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
				/> -->
				<datePicker
					v-model="travelStore.traveList[chart].params.time"
					type="datetimerange"
					popper-class="hidden-date-picker"
					start-placeholder="开始日期"
					:default-time="[new Date(2022, 12, 1, 0, 0, 0), new Date(2022, 12, 1, 23, 59, 59)]"
					end-placeholder="结束日期"
					value-format="YYYY-MM-DD HH:mm:ss"
				/>
			</search-item>
      
			<search-item label="行程单号">
				<a-input v-model:value="travelStore.traveList[chart].params.itineraryNo" placeholder="请输入行程单号" />
			</search-item>

			<template #button>
				<a-button style="margin-right: 30px" @click="reset" v-permission="'重置'">重置</a-button>
				<a-button @click="onSearch" v-permission="'查询'">查询</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="item in filterPages" :key="item.value" :tab="item.label">
				<!--  v-if="showAddBtn" -->
				<div class="btn d-flex justify-content-end" v-if="showAddBtn">
					<a-button @click="goToPath(GroupType.Cooperation)" type="primary" style="margin-right: 20px" v-permission="'协作填报'">+协作填报</a-button>
					<a-button @click="goToPath(GroupType.NonCooperation)" type="primary" style="margin-right: 20px" v-permission="'非协作填报'">+非协作填报</a-button>
				</div>
				<div v-if="activeKey === item.value">
					<component :onCheck="check" :is="item.name"></component>
				</div>
				
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script lang="ts" setup>
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import drafts from './travelList/drafts.vue';
import waitingGroup from './travelList/waitingGroup.vue';
import overtime from './travelList/overtime.vue';
// import refuseGroup from './travelList/refuseGroup.vue';
import waitRegiment from './travelList/waitRegiment.vue';
import haveABall from './travelList/haveABall.vue';
// import closeAnAccount from './travelList/closeAnAccount.vue';
import waitingChange from './travelList/waitingChange.vue';
import cancellation from './travelList/cancellation.vue';
import waitingTask from './travelList/waitingTask.vue';
import { traveListParams, useTravelStore } from '@/stores/modules/travelManagement';
import { GroupStatus, GroupType } from '@/enum';
import { getUserInfo, getTabPermission } from '@/utils/util';
import { ROLE } from '@/constant';
import api from '@/api';
import { Field } from '@/type';
import { cloneDeep } from 'lodash';

const userInfo = getUserInfo();
const travelStore = useTravelStore();
const router = useRouter();
const activeKey = ref(GroupStatus.Drafts);
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
		name: drafts,
		label: travelStore.groupStatus[GroupStatus.Drafts],
		value: GroupStatus.Drafts,
		chart: 'drafts',
	},
	{
		name: waitRegiment,
		label: travelStore.groupStatus[GroupStatus.WaitRegiment],
		value: GroupStatus.WaitRegiment,
		chart: 'waitRegiment',
	},
	{
		name: waitingGroup,
		label: travelStore.groupStatus[GroupStatus.WaitingGroup],
		value: GroupStatus.WaitingGroup,
		chart: 'waitingGroup',
	},
	{
		name: haveABall,
		label: travelStore.groupStatus[GroupStatus.HaveABall],
		value: GroupStatus.HaveABall,
		chart: 'haveABall',
	},
	{
		name: waitingTask,
		label: travelStore.groupStatus[GroupStatus.WaitingTask],
		value: GroupStatus.WaitingTask,
		chart: 'waitingTask',
	},
	{
		name: cancellation,
		label: travelStore.groupStatus[GroupStatus.Cancellation],
		value: GroupStatus.Cancellation,
		chart: 'cancellation',
	},
	// {
	// 	name: refuseGroup,
	// 	label: travelStore.groupStatus[GroupStatus.RefuseGroup],
	// 	value: GroupStatus.RefuseGroup,
	// 	chart: 'refuseGroup',
	// },
	// {
	// 	name: closeAnAccount,
	// 	label: travelStore.groupStatus[GroupStatus.CloseAnAccount],
	// 	value: GroupStatus.CloseAnAccount,
	// 	chart: 'closeAnAccount',
	// },
	{
		name: waitingChange,
		label: travelStore.groupStatus[GroupStatus.WaitingChange],
		value: GroupStatus.WaitingChange,
		chart: 'waitingChange',
	},
	{
		name: overtime,
		label: travelStore.groupStatus[GroupStatus.Overtime],
		value: GroupStatus.Overtime,
		chart: 'overtime',
	},
];
const filterPages = pages.filter((item: any) => getTabPermission(item.label));
activeKey.value = filterPages.length ? filterPages[0].value : pages[0].value;
travelStore.insuranceStatus = '3'
const goToPath = (type: number) => {
	router.push({
		path: '/travel/travel_manage/add_travel',
		query: {
			type,
		},
	});
};

const chart = computed(() => pages.filter((it: any) => it.value === activeKey.value)[0].chart as Field);

//查询
const onSearch = async () => {

	let chartField: Field = chart.value;
	let storeParams = travelStore.traveList[chartField].params;
	travelStore.traveList[chartField].params.pageNo = 1;
	travelStore.traveList[chartField].params.status = activeKey.value;
	travelStore.traveList[chartField].params.startDate = storeParams.time[0];
	travelStore.traveList[chartField].params.endDate = storeParams.time[1];
	let params = cloneDeep(travelStore.traveList[chartField].params);
	params.groupType = params.groupType === '0' ? '' : params.groupType;
	const res = await travelStore.getTravelList(params);

	travelStore.setTraveList(res, chartField);
};
//重置
const reset = () => {
	let chartField: Field = chart.value;

	travelStore.traveList[chartField].params = cloneDeep(traveListParams.params);
	onSearch();
};
travelStore.teamTime = [];
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

travelStore.hotels = [];
travelStore.setAllTicket([]);
travelStore.scenicTickets = [];
travelStore.setTeamType('');
travelStore.setCompositeProducts([]);
const showAddBtn = computed(() => {
	return userInfo.sysRoles.some((it: any) => it.roleCode === ROLE.TRAVE_CODE);
});

travelStore.getItineraryStatus();
// travelStore.getItineraryListTab();
sessionStorage.removeItem('traveList');
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
	.btn {
		margin-bottom: 20px;
	}
}
</style>
