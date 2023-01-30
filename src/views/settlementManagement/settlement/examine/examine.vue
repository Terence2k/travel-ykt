<template>
	<div>
		<CommonTable
			:dataSource="state.tableData.data"
			:scroll="{ x: '100%', y: '100%' }"
			rowKey="itineraryNo"
			:columns="columns"
			:row-selection="rowSelection"
		>
			<template #button>
				<div class="btn">
					<a-button type="primary" @click="examine('all', null)" v-permission="'预结算_审核通过'">审核通过</a-button>
				</div>
			</template>
			<template #bodyCell="{ column, record }">
				<!-- 结算状态 -->
				<template v-if="column.key === 'accountingIsNormal'">
					<div class="red" v-if="record.accountingIsNormal == 0">异常</div>
					<div v-else-if="record.accountingIsNormal == 1">正常</div>
					<div v-else>-</div>
				</template>
				<!-- 冻结状态 -->
				<template v-if="column.key === 'isFrozen'">
					<div class="red" v-if="record.isFrozen == 1">已冻结</div>
					<div v-else>未冻结</div>
				</template>
				<!-- 行程费用 单位转成元-->
				<template v-if="column.key === 'totalFee'">
					{{ record.totalFee / 100 > 0 ? (record.totalFee / 100) : 0 }}
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="examine('one', record)" v-permission="'预结算_审核'">审核</a>
						<a @click="reclosing(record)" v-permission="'预结算_重新结算'">重新结算</a>
						<a @click="thaw(record)" v-permission="'预结算_解冻'" v-if="record.isFrozen == 1">解冻</a>
						<a @click="frozen(record)" v-permission="'预结算_冻结'" v-else>冻结</a>
						<a @click="toInfo(record)" v-permission="'预结算_查看'">查看</a>
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
import { StateType } from '../index';

const props = defineProps({
	params: Object,
	status: Number,
});
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
		title: '发团时间',
		dataIndex: 'sendGroupTime',
		key: 'sendGroupTime',
	},
	{
		title: '结算状态',
		dataIndex: 'accountingIsNormal',
		key: 'accountingIsNormal',
	},
	{
		title: '冻结状态',
		dataIndex: 'isFrozen',
		key: 'isFrozen',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];
const modalData = ref({
	show: false,
	params: {},
	data: {}, // 传参对象
	type: '',
});
const tipSubmit = async () => {
	// 重新结算
	if (modalData.value.type == 'reclosing') {
		api.settlementUpdate(modalData.value.data).then((res: any) => {
			message.success('操作成功');
			onSearch();
		});
		tipCancel();
	}
	// 审核
	if (modalData.value.type == 'examine') {
		api.settlementUpdate(modalData.value.data).then((res: any) => {
			message.success('操作成功');
			onSearch();
		});
		tipCancel();
	}
	// 冻结&冻结
	if (modalData.value.type == 'frozen' || modalData.value.type == 'thaw') {
		api.updateFrozen(modalData.value.data).then((res: any) => {
			message.success('操作成功');
			onSearch();
		});
		tipCancel();
	}
};
const tipCancel = () => {
	modalData.value.data = {};
	modalData.value.type = '';
	modalData.value.show = false;
};
const state = reactive<StateType>({
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
	selectedRowKeys: [],
});

// 当前选择列
const rowSelection = computed(() => {
	return {
		onChange: (selectedRowKeys: [], selectedRows: any) => {
			state.selectedRowKeys = selectedRowKeys;
		},
	};
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	if(typeof val == 'number') {
		state.tableData.param.pageNo = val;
		onSearch();
	}
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	onSearch();
};

// 数据处理
const dealData = (params: [any]) => {
	params.map((i: any) => {
		i.timeText = i.startDate + ' - ' + i.endDate;
		return i;
	});
	return params;
};

const onSearch = async () => {
	// 处理父组件传递筛选条件
	state.tableData.param.status = props?.status;
	state.tableData.param.teamTypeId = props.params?.teamTypeId;
	state.tableData.param.itineraryNo = props.params?.itineraryNo;
	state.tableData.param.travelId = props.params?.travelId;
	state.tableData.param.subTravelId = props.params?.subTravelId;
	state.tableData.param.startDate = props.params?.time ? props.params?.time[0] : null;
	state.tableData.param.endDate = props.params?.time ? props.params?.time[1] : null;
	state.tableData.param.startSendGroupTime = props.params?.groupTime ? props.params?.groupTime[0] : null;
	state.tableData.param.endSendGroupTime = props.params?.groupTime ? props.params?.groupTime[1] : null;
	state.tableData.loading = true;
	let res = await api.settlementItineraryBasic(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	const list: [any] = dealData(content);
	state.tableData.data = list;
	state.tableData.loading = false;
};
// 向父组件暴露方法
defineExpose({ onSearch });
// 重新结算
const reclosing = (record: any) => {
	modalData.value.params = { title: '重新结算', content: '你即将对行程单重新结算，是否确定执行？' };
	modalData.value.type = 'reclosing';
	modalData.value.data = {
		status: 14,
		itineraryNoList: [record.itineraryNo],
	};
	modalData.value.show = true;
};
// 冻结
const frozen = (record: any) => {
	modalData.value.params = { title: '冻结', content: '是否确定冻结行程单' };
	modalData.value.type = 'frozen';
	modalData.value.data = {
		isFrozen: 1,
		itineraryNo: record.itineraryNo,
	};
	modalData.value.show = true;
};
// 解冻
const thaw = (record: any) => {
	modalData.value.params = { title: '解冻', content: '是否确定解冻行程单' };
	modalData.value.type = 'thaw';
	modalData.value.data = {
		isFrozen: 0,
		itineraryNo: record.itineraryNo,
	};
	modalData.value.show = true;
};
// 审核通过
const examine = (type: string, record: any) => {
	// type:one单项  all批量
	if (type == 'one') {
		// 单项跳转审核详情页
		router.push({
			path: '/settlementManagement/settlement/examineInfo',
			query: { itineraryNo: encodeURIComponent(record.itineraryNo), showExamineBtn: 'true' },
		});
	} else {
		// 判断是否有选择项
		if (state.selectedRowKeys.length == 0) {
			message.warn('请先选择审核项');
			return;
		}
		modalData.value.params = { title: '审核通过', content: '是否确定所选数据审核通过' };
		modalData.value.type = 'examine';
		modalData.value.data = {
			status: 15,
			itineraryNoList: state.selectedRowKeys,
		};
		modalData.value.show = true;
	}
};
// 查看详情
const toInfo = (record: any) => {
	// router.push({ path: '/travel/travel_manage/travel_detail', query: { oid: encodeURIComponent(record.oid) } });
	router.push({ path: '/settlementManagement/settlement/examineInfo', query: { itineraryNo: encodeURIComponent(record.itineraryNo) } });
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
.red {
	color: red;
}
</style>
