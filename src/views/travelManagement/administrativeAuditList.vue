<template>
	<div class="trave-contaner">
		<CommonSearch>
			<search-item label="关键词搜索">
				<a-input v-model:value="travelStore.auditList[chart].params.keyWord" placeholder="请输入游客姓名、导游姓名、旅行社名称、线路名称等关键字" />
			</search-item>

			<search-item label="组团模式">
				<a-select v-model:value="travelStore.auditList[chart].params.groupType">
					<a-select-option v-for="(value, key) in travelStore.groupMode" :key="key" :value="key">{{ value }}</a-select-option>
				</a-select>
			</search-item>

			<search-item label="行程时间">
        <picker v-model="travelStore.auditList[chart].params.time" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm"/>
			</search-item>

			<template #button>
        <a-button style="margin-right: 30px" @click="reset" v-permission="'重置'">重置</a-button>
				<a-button type="primary" @click="onSearch" v-permission="'查询'">查询</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="item in filterPages" :key="item.value" :tab="item.label">
				<component :onCheck="check" :is="item.name"></component>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script lang="ts" setup>
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import administrativeSendGroup from './itineraryAuditList/administrativeSendGroup.vue';
import administrativeChange from './itineraryAuditList/administrativeChange.vue';

import { traveListParams, useTravelStore } from '@/stores/modules/travelManagement';
import { AuditStaus, GroupType } from '@/enum';
import { getUserInfo, getTabPermission } from '@/utils/util';
import { ROLE } from '@/constant';
import { AuditField } from '@/type';
import { cloneDeep } from 'lodash';
import picker from '@/components/common/datePicker.vue';
import api from '@/api';

const userInfo = getUserInfo();
const travelStore = useTravelStore();
const router = useRouter();
const activeKey = ref(AuditStaus.AdministrativeSendGroup);
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
		name: administrativeSendGroup,
		label: travelStore.auditStatus[AuditStaus.AdministrativeSendGroup],
		value: AuditStaus.AdministrativeSendGroup,
		chart: 'administrativeSendGroup',
	},
	{
		name: administrativeChange,
		label: travelStore.auditStatus[AuditStaus.AdministrativeChange],
		value: AuditStaus.AdministrativeChange,
		chart: 'administrativeChange',
	},
];

const filterPages = pages.filter((item: any) => getTabPermission(item.label));
console.log('filterPages:', filterPages)
activeKey.value = filterPages.length ? filterPages[0].value : pages[0].value;

const goToPath = (type: number) => {
	router.push({
		path: '/travel/travel_manage/add_travel',
		query: {
			type,
		},
	});
};

const chart = computed(() => pages.filter((it: any) => it.value === activeKey.value)[0].chart as AuditField);

//查询
const onSearch = async () => {
	let chartField: AuditField = chart.value;
	let storeParams = travelStore.auditList[chartField].params;
	travelStore.auditList[chartField].params.status = activeKey.value;
	travelStore.auditList[chartField].params.startDate = storeParams.time[0];
	travelStore.auditList[chartField].params.endDate = storeParams.time[1];
	let params = cloneDeep(travelStore.auditList[chartField].params);
	params.groupType = params.groupType === '0' ? '' : params.groupType;
	const res = await travelStore.getAuditList(params);

	travelStore.setAuditList(res, chartField);
};
//重置
const reset = () => {
	let chartField: AuditField = chart.value;

	travelStore.auditList[chartField].params = cloneDeep(traveListParams.params);
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
