<template>
	<div>
		<CommonSearch>
			<search-item label="出团时间">
				<a-space direction="vertical">
					<a-date-picker v-model:value="gouvyStore.gouvyList[chart].params.itineraryStartDate" />
				</a-space>
			</search-item>
			<search-item label="行程单号">
				<a-input v-model:value="gouvyStore.gouvyList[chart].params.itineraryNo" placeholder="请输入行程单号" />
			</search-item>
			<search-item label="旅行社">
				<a-input v-model:value="gouvyStore.gouvyList[chart].params.subTravelName" placeholder="请输入旅行社" />
			</search-item>
			<template #button>
				<a-button @click="reset()" style="margin-right: 30px">重置</a-button>
				<a-button @click="onSearch()">查询</a-button>
			</template>
		</CommonSearch>
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane v-for="item in filterPages" :key="item.value" :tab="item.label">
					<!-- <a-tab-pane v-for="item in pages" :key="item.value" :tab="item.label">
				</a-tab-pane> -->
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
import { GouvyStatus } from '@/enum';
import wait from './wait.vue';
import success from './success.vue';
import refuse from './refuse.vue';
import { useGouvyStore, gouvyListParams } from '@/stores/modules/gouvy';
import { cloneDeep } from 'lodash';
import { Field } from './type/index';
import { getUserInfo, getTabPermission } from '@/utils/util';
const gouvyStore = useGouvyStore();
const activeKey = ref(GouvyStatus.waits);
const check = ref(false);
const params = reactive({
	itineraryStartDate: '',
	itineraryNo: '',
	subTravelName: '',
	auditStatus: '',
});
const pages = [
	{
		name: wait,
		label: gouvyStore.GouvyOrderStatus[GouvyStatus.waits],
		value: GouvyStatus.waits,
		chart: 'waits',
	},
	{
		name: success,
		label: gouvyStore.GouvyOrderStatus[GouvyStatus.success],
		value: GouvyStatus.success,
		chart: 'success',
	},
	{
		name: refuse,
		label: gouvyStore.GouvyOrderStatus[GouvyStatus.refuse],
		value: GouvyStatus.refuse,
		chart: 'refuse',
	},
];
const filterPages = pages.filter((item: any) => getTabPermission(item.label));
const chart = computed(() => pages.filter((it: any) => it.value === activeKey.value)[0].chart as Field);
//查询
const onSearch = async () => {
	let chartField: Field = chart.value;
	let storeParams = gouvyStore.gouvyList[chartField].params;
	gouvyStore.gouvyList[chartField].params.auditStatus = activeKey.value;
	gouvyStore.gouvyList[chartField].params.itineraryStartDate = storeParams.itineraryStartDate;
	gouvyStore.gouvyList[chartField].params.itineraryNo = storeParams.itineraryNo;
	gouvyStore.gouvyList[chartField].params.subTravelName = storeParams.subTravelName;
	let params = cloneDeep(gouvyStore.gouvyList[chartField].params);
	const res = await api.exemptionManagementList(params);
	gouvyStore.setOrderList(res, chartField);
};
const reset = () => {
	let chartField: Field = chart.value;
	gouvyStore.gouvyList[chartField].params = cloneDeep(gouvyListParams.params);
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
