<template>
	<div>
		<CommonTable :dataSource="state.tableData.data" :scroll="{ x: '100%',y: '100%' }" rowKey="itineraryNo" :columns="columns" :row-selection="rowSelection">
			<template #button>
				<div class="btn">
					<a-button type="primary" @click="settlement('all', null)">下团结算</a-button>
				</div>
			</template>
			<template #bodyCell="{ column, record }">
				<!-- 行程费用 单位转成元-->
				<template v-if="column.key === 'totalFee'">
					{{ (record.totalFee / 100) > 0 ? (record.totalFee / 100).toFixed(2) : 0}}
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="settlement('one', record)">下团结算</a>
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
	<DelModal :params="modalData.params" v-model="modalData.show" @submit="tipSubmit" @cancel="tipCancel" />
</template>

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { reactive, onMounted } from 'vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import DelModal from '@/components/common/DelModal.vue';

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
const modalData = ref({
	show: false,
	params: {},
	data: {}, // 传参对象
});
const tipSubmit = async () => {
	api.settlementUpdate(modalData.value.data).then((res: any) => {
		message.success('操作成功');
		onSearch();
	})
	tipCancel();
};
const tipCancel = () => {
	modalData.value.data = {};
	modalData.value.show = false;
};
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
			status: null,
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
	// onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
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
	state.tableData.param.endDate = props.params?.time ? props.params?.time[1] : null
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

// 下团结算
const settlement = (type: string, record: any) => {
	let oid;
	// type:one单项  all批量
	if (type == 'one') {
		oid = [record.itineraryNo];
	} else {
		// 判断是否有选择项
		if (state.selectedRowKeys.length == 0) {
			message.warn('请先选择结算项');
			return;
		}
		oid = state.selectedRowKeys;
	}
	modalData.value.params = { title: '下团结算', content: '你即将对行程单手动执行下团并结算操作，下团结算后，无法进行补刷、改刷操作。是否确定执行？' }
	modalData.value.data = {
		'status': 14,
		'itineraryNoList' : oid
	}
	modalData.value.show = true
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
