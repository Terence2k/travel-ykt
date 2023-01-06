<template>
	<CommonSearch>
		<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.teamTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="行程单号">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" />
		</search-item>
		<search-item label="组团社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.groupSocietyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="行程时间" style="width: 350px">
			<!-- <a-range-picker @change="timeChange" value-format="YYYY-MM-DD HH:mm:ss" /> -->
			<picker v-model="state.tableData.param.time" style="width: 180px" type="daterange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期"> </picker>
		</search-item>
		<search-item label="发团时间" style="width: 350px">
			<picker v-model="state.tableData.param.groupTime" style="width: 180px" type="daterange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期"> </picker>
		</search-item>
		<template #button>
			<a-button @click="initList" v-permission="'查询'">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<!-- 等待行程单枚举获取完成 -->
		<a-tabs v-model:activeKey="activeKey" v-if="options.itineraryStatus.length > 0">
			<a-tab-pane v-for="(item, index) in filterPages" :key="index" :tab="item.label">
				<component
					ref="listRef"
					:is="item.name"
					v-if="index == activeKey"
					:params="state.tableData.param"
					:status="getItineraryStatus(item.codeName)"
				></component>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import trip from './trip/trip.vue';
import examine from './examine/examine.vue';
import settlement from './settlement/settlement.vue';
import transferred from './transferred/transferred.vue';
import massesEnd from './massesEnd/massesEnd.vue';
import picker from '@/components/common/datePicker.vue';

import { settlementOptions } from '@/stores/modules/settlement';
import { getTabPermission } from '@/utils';
const options = settlementOptions();

// 计算属性 匹配费用归属企业类型
const getItineraryStatus = computed(() => (value: any) => {
	if (options.itineraryStatus) {
		const idx = options.itineraryStatus.findIndex((item) => item.codeName === value);
		if (idx !== -1) {
			return options.itineraryStatus[idx]['status'];
		}
		return '';
	}
	return '';
});
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();
const activeKey = ref(0);
const check = ref(false);
const dateFormat = 'YYYY-MM-DD';
const pages = [
	{
		name: trip,
		label: '行程中',
		codeName: 'AT_OUT',
	},
	{
		name: massesEnd,
		label: '已散团',
		codeName: 'TEAM_END',
	},
	{
		name: examine,
		label: '预结算',
		codeName: 'PRE_SETTLE',
	},
	{
		name: settlement,
		label: '已结算',
		codeName: 'HAD_SETTLED',
	},
	{
		name: transferred,
		label: '已申请转账',
		codeName: 'HAD_APPLY_TRANSFER',
	},
];
const filterPages = pages.filter((item: any) => getTabPermission(item.label));
// activeKey.value = filterPages.length ? filterPages[0].value : pages[0].value;

const state = reactive({
	tableData: {
		data: [
			{
				name: 123456,
			},
		],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			teamTypeId: null,
			itineraryNo: null,
			travelId: null,
			subTravelId: null,
			time: '',
			groupTime: '',
		},
	},
});

const listRef = ref<any>();

// 搜索触发子组件查询
const initList = async () => {
	if (listRef.value) {
		listRef.value[0].onSearch();
	}
};
onMounted(() => {
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	options.getItineraryStatus();
	initList();
	navigatorBar.setNavigator(['结算管理', '结算管理']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
const timeChange = (arr: any) => {
	console.log(arr);
	if (arr && arr.length > 0) {
		const timeList: any = [arr[0], arr[1]];
		state.tableData.param.time = timeList;
	} else {
		state.tableData.param.time = '';
	}
};
</script>

<style lang="less" scoped>
::v-deep(.ant-tabs-nav) {
	padding: 0px 20px !important;
}
// ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
// 	margin: 0;
// }
.ant-table-thead > tr > th {
	border-top: 1px solid #f0f0f0;
	background-color: #fcfcfc;
	&::before {
		height: 100% !important;
	}
}
.ant-table-body {
	height: 500px;
}
</style>
