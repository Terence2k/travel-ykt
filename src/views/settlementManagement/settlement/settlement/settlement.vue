<template>
	<div>
		<CommonTable :dataSource="state.tableData.data" :scroll="{ x: '100%',y: '100%' }" rowKey="oid" :columns="columns" :row-selection="rowSelection">
			<template #button>
				<div class="btn">
					<a-button type="primary" @click="transfer('all', null)">申请转账</a-button>
					<a-button style="margin-left: 8px" type="primary" @click="combination">组合转账</a-button>
				</div>
			</template>
			<template #bodyCell="{ column, record }">
				<!-- 行程费用 单位转成元-->
				<template v-if="column.key === 'totalFee'">
					{{ (record.totalFee / 100) > 0 ? (record.totalFee / 100).toFixed(2) : 0}}
				</template>
				<!-- 结算金额 单位转成元-->
				<template v-if="column.key === 'accountingFee'">
					{{ (record.accountingFee / 100) > 0 ? (record.accountingFee / 100).toFixed(2) : 0}}
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="transfer('one', record)">申请转账</a>
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
	<transfer-modal v-model="transferData.show" @submit="transferConfirm" />
</template>

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { reactive, onMounted } from 'vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import TransferModal from '@/views/settlementManagement/settlement/settlement/transferModal.vue';

const props = defineProps({
	params: Object,
	status: Number
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
		title: '行程费用(元)',
		dataIndex: 'totalFee',
		key: 'totalFee',
	},
	{
		title: '行程时间',
		dataIndex: 'timeText',
		key: 'timeText',
	},
    {
		title: '结算金额(元)',
		dataIndex: 'accountingFee',
		key: 'accountingFee',
	},
	{
		title: '对账批号',
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
// 缓存编辑表格模态框数据
const transferData = ref({
	show: false,
	modalParams: {},
});
// 申请转账成功回调
const transferConfirm = () => {
	onSearch();
}
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
			status: null
		},
	},
	selectedRowKeys: [], //当前选择的标识
});
// 当前选择列
const rowSelection = computed(() => {
	return {
		onChange: (selectedRowKeys: [], selectedRows: any) => {
		state.selectedRowKeys = selectedRowKeys;
	},
	}
})
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
	state.tableData.param.status = props?.status
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

// 组合转账
const combination = () => {
	// 判断是否有选择项
	let oid;
	if (state.selectedRowKeys.length == 0) {
		message.warn('请先选择组合项');
		return;
	}
	oid = state.selectedRowKeys;
	console.log('把老子的id给打印出来', oid);
	Modal.confirm({
			title: '组合转账',
			width: 560,
			closable: true,
			centered: true,
			icon: false,
			content: '即将为所选行程单发起组合转账，是否确定组合转账？',
			onOk() {
				// api
				// 	.comprehensiveFeeEnable(record.oid)
				// 	.then((res: any) => {
						message.success('操作成功');
				// 		onSearch();
				// 	})
				// 	.catch((err: any) => {
				// 		message.error(err || '操作失败');
				// 	});
			},
			onCancel() {},
		});
}
// 申请转账
const transfer = (type: string, record: any) => {
	let oid;
	// type:one单项  all批量
	if (type == 'one') {
		oid = record.oid;
		Modal.confirm({
			title: '下团结算',
			width: 560,
			closable: true,
			centered: true,
			icon: false,
			content: '即将为所选行程单发起结算转账，是否确定申请转账？',
			onOk() {
				// api
				// 	.comprehensiveFeeEnable(record.oid)
				// 	.then((res: any) => {
						message.success('操作成功');
				// 		onSearch();
				// 	})
				// 	.catch((err: any) => {
				// 		message.error(err || '操作失败');
				// 	});
			},
			onCancel() {},
		});
	} else {
		oid = state.selectedRowKeys;
		transferData.value.show = true
	}
	console.log('把老子的id给打印出来', oid);
};
// 查看详情
const toInfo = (record: any) => {
	router.push({ path: '/settlementManagement/settlement/info', query: { oid: encodeURIComponent(record.oid) } });
};
onMounted(() => {
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
