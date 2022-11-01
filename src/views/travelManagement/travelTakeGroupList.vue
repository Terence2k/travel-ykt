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
				<a-range-picker
					v-model:value="travelStore.traveList[chart].params.time"
					show-time
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
				/>
			</search-item>

			<template #button>
				<a-button style="margin-right: 30px" @click="reset">重置</a-button>
				<a-button @click="onSearch">查询</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="item in pages" :key="item.value" :tab="item.label">
				<component :onCheck="check" :is="item.name"></component>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script lang="ts" setup>
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import drafts from './travelTakeGroupList/drafts.vue';
import waitingGroup from './travelTakeGroupList/waitingGroup.vue';

import { traveListParams, useTravelStore } from '@/stores/modules/travelManagement';
import { TakeGroupStatus, GroupType } from '@/enum';
import { getUserInfo } from '@/utils/util';
import { ROLE } from '@/constant';
import api from '@/api';
import { TakeGroupField } from '@/type';
import { cloneDeep } from 'lodash';

const userInfo = getUserInfo();
const travelStore = useTravelStore();
const router = useRouter();
const activeKey = ref(TakeGroupStatus.Drafts);
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
		label: travelStore.takeGroupStatus[TakeGroupStatus.Drafts],
		value: TakeGroupStatus.Drafts,
		chart: 'drafts',
	},
	{
		name: waitingGroup,
		label: travelStore.takeGroupStatus[TakeGroupStatus.WaitingGroup],
		value: TakeGroupStatus.WaitingGroup,
		chart: 'waitingGroup',
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

const chart = computed(() => pages.filter((it: any) => it.value === activeKey.value)[0].chart as TakeGroupField);

//查询
const onSearch = async () => {
	let chartField: TakeGroupField = chart.value;
	let storeParams = travelStore.traveList[chartField].params;
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
	let chartField: TakeGroupField = chart.value;

	travelStore.traveList[chartField].params = cloneDeep(traveListParams.params);
	onSearch();
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

travelStore.getItineraryStatus();
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
}
</style>
