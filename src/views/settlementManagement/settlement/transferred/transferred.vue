<template>
	<div>
		<CommonTable :dataSource="state.tableData.data" :scroll="{ x: '100%',y: '100%' }" :columns="columns" >
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="toInfo(record)">查看</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="state.tableData.param.pageNo"
			:page-size="state.tableData.param.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
</template>

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { reactive, onMounted } from 'vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
const props = defineProps({
	params: Object,
})
const router = useRouter();
const columns = [
	{
		title: '团队类型',
		dataIndex: 'teamTypeName',
		key: 'teamTypeName',
	},
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '线路名称',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '组团社',
		dataIndex: 'travelName',
		key: 'travelName',
	},
	{
		title: '地接社',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '行程人数',
		dataIndex: 'touristNum',
		key: 'touristNum',
	},
	{
		title: '行程费用',
		dataIndex: 'totalFee',
		key: 'totalFee',
	},
	{
		title: '行程时间',
		dataIndex: 'timeText',
		key: 'timeText',
	},
	{
		title: '结算总额',
		dataIndex: 'accountingFee',
		key: 'accountingFee',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];

const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			teamTypeId: null,
			itineraryNo: null,
			travelId: null,
			subTravelId: null,
			startDate: null,
			endDate: null,
			accountingStatus: 4, //1行程中 2结算审核 3已结算 4已申请转账
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	onSearch();
};

// 数据处理
const dealData = (params: [any]) => {
	params.map((i: any) => {
		i.timeText = i.startDate + ' - ' + i.endDate
		return i;
	});
	return params;
};

const onSearch = async() => {
	// 处理父组件传递筛选条件
	state.tableData.param.teamTypeId = props.params?.teamTypeId
	state.tableData.param.itineraryNo = props.params?.itineraryNo
	state.tableData.param.travelId = props.params?.travelId
	state.tableData.param.subTravelId = props.params?.subTravelId
	state.tableData.param.startDate = props.params?.time ? props.params?.time[0] :  null
	state.tableData.param.endDate = props.params?.time ? props.params?.time[1] :  null
	state.tableData.loading = true;
	let res = await api.getItinerarySettlement(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	const list: [any] = dealData(content);
	state.tableData.data = list;
	state.tableData.loading = false;
	console.log(state.tableData.param);
};
// 向父组件暴露方法
defineExpose({ onSearch });

// 查看详情
const toInfo = (record: any) => {
	router.push({ path: '/settlementManagement/settlement/info', query: { oid: encodeURIComponent(record.oid) } });
};
onMounted(() => {
	// getRoleList();
	onSearch();
});
</script>

<style lang="less" scoped>
.btn {
	margin: -8px 0 8px 0;
}
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
