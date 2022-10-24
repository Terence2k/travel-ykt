<template>
	<CommonSearch>
		<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.teamTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item,index) in options.teamTypesLists" :value="item.oid" :key=index>{{ item.name }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="行程单号">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" />
		</search-item>
		<search-item label="组团社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item,index) in options.groupSocietyList" :value="item.travelAgencyId" :key=index>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item,index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key=index>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="行程时间">
			<a-range-picker
				v-model:value="state.tableData.param.time"
				show-time
				format="YYYY-MM-DD HH:mm"
				value-format="YYYY-MM-DD HH:mm:ss"
			/>
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div>
		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
				<component 
					ref="listRef" 
					:is="item.name" 
					v-if="index == activeKey"
					:params="state.tableData.param"
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
import { settlementOptions } from '@/stores/modules/settlement';
const options = settlementOptions();

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
	},
	{
		name: examine,
		label: '结算审核',
	},
	{
		name: settlement,
		label: '已结算',
	},
	{
		name: transferred,
		label: '已申请转账',
	},
];

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
			time:'',
		},
	},
});

const listRef = ref<any>();

// 搜索触发子组件查询
const initList = async () => {
	listRef.value[0].onSearch();
};
onMounted(() => {
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	initList();
	navigatorBar.setNavigator(['结算管理','结算管理']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
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
