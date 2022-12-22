<template>
	<div>
		<CommonSearch>
			<search-item label="接团社">
				<a-input v-model:value="gouvyStore.revocationManagementList[chart].params.subTravelName" placeholder="请输入接团社" />
			</search-item>
			<search-item label="出团时间">
				<picker placeholder="请选择出团时间" v-model="gouvyStore.revocationManagementList[chart].params.itineraryStartDate"  value-format="YYYY-MM-DD"/>
			</search-item>
			<search-item label="行程单号">
				<a-input v-model:value="gouvyStore.revocationManagementList[chart].params.itineraryNo" placeholder="请输入行程单号" />
			</search-item>
			<search-item label="行程线路">
				<a-input v-model:value="gouvyStore.revocationManagementList[chart].params.routeName" placeholder="请输入行程线路" />
			</search-item>
			<template #button>
				<a-button @click="reset()" style="margin-right: 30px">重置</a-button>
				<a-button @click="onSearch()">查询</a-button>
			</template>
		</CommonSearch>
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<!-- <a-tab-pane v-for="item in pages" :key="item.value" :tab="item.label">
					<component :onCheck="check" :is="item.name"></component>
				</a-tab-pane> -->
				<a-tab-pane v-for="item in filterPages" :key="item.value" :tab="item.label">
					<component :onCheck="check" :is="item.name"></component>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>
<script lang="ts" setup>
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import api from '@/api';
import { revocationStatus } from '@/enum';
import wait from './wait.vue';
import success from './success.vue';
import refuse from './refuse.vue';
import { useGouvyStore, revocationManagementParams } from '@/stores/modules/gouvy';
import { cloneDeep } from 'lodash';
import { Fieold } from './type/index';
import { getUserInfo, getTabPermission } from '@/utils/util';
import picker from '@/components/common/datePicker.vue';
const gouvyStore = useGouvyStore();
const activeKey = ref(revocationStatus.waits);
const check = ref(false);
const params = reactive({
	subTravelName: '',
	itineraryStartDate: '',
	itineraryNo: '',
	routeName: '',
	tabNo: '',
});
const pages = [
	{
		name: wait,
		label: gouvyStore.revocationManagementStatus[revocationStatus.waits],
		value: revocationStatus.waits,
		chart: 'waits',
	},
	{
		name: success,
		label: gouvyStore.revocationManagementStatus[revocationStatus.success],
		value: revocationStatus.success,
		chart: 'success',
	},
	{
		name: refuse,
		label: gouvyStore.revocationManagementStatus[revocationStatus.refuse],
		value: revocationStatus.refuse,
		chart: 'refuse',
	},
];
const filterPages = pages.filter((item: any) => getTabPermission(item.label));
const chart = computed(() => pages.filter((it: any) => it.value === activeKey.value)[0].chart as Fieold);
//查询
const onSearch = async () => {
	let chartField: Fieold = chart.value;
	let storeParams = gouvyStore.revocationManagementList[chartField].params;
	gouvyStore.revocationManagementList[chartField].params.tabNo = activeKey.value;
	gouvyStore.revocationManagementList[chartField].params.itineraryStartDate = storeParams.itineraryStartDate;
	gouvyStore.revocationManagementList[chartField].params.itineraryNo = storeParams.itineraryNo;
	gouvyStore.revocationManagementList[chartField].params.subTravelName = storeParams.subTravelName;
	let params = cloneDeep(gouvyStore.revocationManagementList[chartField].params);
	const res = await api.gouvyRepealNreapplyPageList(params);
	console.log(res, '13231');
	gouvyStore.setRevocationManagementList(res, chartField);
};
const reset = () => {
	let chartField: Fieold = chart.value;
	gouvyStore.revocationManagementList[chartField].params = cloneDeep(revocationManagementParams.params);
	onSearch();
};
</script>
<style lang="less" scoped>
.trave-contaner {
	height: 100%;
	::v-deep(.ant-tabs-nav) {
		padding: 16px 20px;
	}
}

.footer {
	position: sticky;
	bottom: 0;
	line-height: 64px;
	width: 100%;
	border-top: 1px solid #f1f2f5;
	background-color: #fff;
	padding-left: 16px;
	z-index: 99;
	button:first-of-type {
		margin-right: 16px;
	}
}
</style>
