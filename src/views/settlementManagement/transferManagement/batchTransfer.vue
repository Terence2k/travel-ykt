<template>
	<div class="batchTransfer">
		<div class="batchTransfer-header">
			<div class="last-btn">
				<div class="btn">
					<a-button type="primary" class="success" @click="examine(0)">审核不通过</a-button>
					<a-button type="primary" class="success" @click="examine(1)">审核通过</a-button>
				</div>
			</div>
			<div class="header-total">
				<span>费用合计：</span>
			</div>
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }" bordered>
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'ruleMap'"> {{ getRulePrice(record, column) }} </template>
				<template v-if="column.dataIndex.includes('tualPrice')"> {{ getActualPrice(record, column) }} </template>
				<template v-if="column.dataIndex === 'unSettlementPrice' && column.key === 'subTravelVo'">
					{{ getSubTravelVoUnSettlementPrice(record, column) }}
				</template>
			</template>
		</CommonTable>
		<Modal :params="state.modalParams" v-model="state.modalShow" @submit="tipSubmit" @cancel="tipCancel" />
	</div>
</template>

<script setup lang="ts">
import api from '@/api';
import Modal from '@/components/common/DelModal.vue';
import CommonTable from '@/components/common/CommonTable.vue';
interface StateType {
	tableData: TableDataType;
	modalShow: boolean;
	modalParams: ModalParamsType;
}
interface TableDataType {
	data: Array<DataType>;
	total: number;
	loading: boolean;
	param: ParamType;
}
interface DataType {
	name: string;
}
interface ParamType {
	teamTypeId?: null | number; //团队类型id(对应ljykt_travel_agency数据库sys_team_type表oid)
	productType?: null | number; //产品类型 1-景区 2-酒店 3-餐饮 6开始为综费产品id
	costName?: string; //费用名称
	ruleStatus?: null | number; //规则状态 1-启用 0-禁用
	pageNo?: number; //页号
	pageSize?: number; //页大小
}
interface ModalParamsType {
	title: string;
	content: string;
}
const state = reactive<StateType>({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			teamTypeId: null, //团队类型id(对应ljykt_travel_agency数据库sys_team_type表oid)
			productType: null, //产品类型 1-景区 2-酒店 3-餐饮 6开始为综费产品id
			costName: '', //费用名称
			ruleStatus: null, //规则状态 1-启用 0-禁用
			pageNo: 1, //页号
			pageSize: 10, //页大小
		},
	},
	modalShow: false,
	modalParams: { title: '审核通过', content: '是否确认对勾选的六条数据进行转账？' },
});
const columns = computed(() => {
	const column = [
		{
			title: '行程单号',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
			width: 100,
		},
		{
			title: '地接社',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
			width: 100,
		},
		{
			title: '监理公司',
			key: 'superviseVo',
			children: [
				{
					title: '一卡通',
					dataIndex: 'ytk',
					key: 'ytk',
					width: 100,
				},
				{
					title: '银行',
					dataIndex: 'bank',
					key: 'bank',
					width: 100,
				},
			],
		},
		{
			title: '协会',
			key: 'associationVo',
			children: [
				{
					title: '一卡通',
					dataIndex: 'ytk',
					key: 'ytk',
					width: 100,
				},
				{
					title: '银行',
					dataIndex: 'bank',
					key: 'bank',
					width: 100,
				},
			],
		},
		{
			title: '启明旅行社',
			key: 'qmTravelAgencyVo',
			children: [
				{
					title: '一卡通',
					dataIndex: 'ytk',
					key: 'ytk',
					width: 100,
				},
				{
					title: '银行',
					dataIndex: 'bank',
					key: 'bank',
					width: 100,
				},
			],
		},
		{
			title: '丽江旅行社',
			key: 'ljTravelAgencyVo',
			children: [
				{
					title: '一卡通',
					dataIndex: 'ytk',
					key: 'ytk',
					width: 100,
				},
				{
					title: '银行',
					dataIndex: 'bank',
					key: 'bank',
					width: 100,
				},
			],
		},
		{
			title: '状态',
			dataIndex: 'state',
			key: 'state',
			width: 100,
		},
		{
			title: '行程费用',
			dataIndex: 'totalFee',
			key: 'totalFee',
			width: 100,
		},
	];
	return column;
});
const examineType = ref(0);
const examine = (type: number) => {
	if (type === 0) {
		examineType.value = 0;
		state.modalParams = { title: '审核不通过', content: '是否确认审核不通过？' };
		state.modalShow = true;
	} else {
		examineType.value = 1;
		state.modalParams = { title: '审核通过', content: '是否确认对勾选的六条数据进行转账？' };
		state.modalShow = true;
	}
};
const tipSubmit = () => {
	if (examineType.value === 1) {
		// 调用接口
	} else if (examineType.value === 0) {
		// 调用接口
	}
};
const initList = async (query: any) => {
	state.tableData.loading = true;
	// let res = await api.currencySettlementRuleList(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// const list: [any] = dealData(content);
	// state.tableData.data = list;
	state.tableData.loading = false;
};
const tipCancel = () => {
	state.modalShow = false;
};
const router = useRouter();
onMounted(() => {
	const query = router.currentRoute.value.query;
	initList(query);
});
const getRulePrice = computed(() => (record: any, column: any) => {
	const ruleColumnKey = column.parent.split('-')[0];
	// 综费产品
	if (ruleColumnKey.includes('List')) {
		for (const key in record[ruleColumnKey]) {
			if (column.columnParentName === record[ruleColumnKey][key]['comprehensiveFeeProductName']) {
				for (const subKey in record[ruleColumnKey][key].ruleList) {
					if (column.title === record[ruleColumnKey][key].ruleList[subKey].ruleName) {
						return `${record[ruleColumnKey][key].ruleList[subKey].rulePrice}`;
					}
				}
			}
		}
	}
	// 除综费产品外
	if (record[ruleColumnKey] && record[ruleColumnKey].ruleList && record[ruleColumnKey].ruleList.length) {
		for (const key in record[ruleColumnKey].ruleList) {
			if (column.title === record[ruleColumnKey].ruleList[key].ruleName) {
				return `${record[ruleColumnKey].ruleList[key].rulePrice}`;
			}
		}
	}
	return `暂无数据`;
});
// 获取实收
const getActualPrice = computed(() => (record: any, column: any) => {
	// 先判断非综费产品
	if (!column.key.includes('List')) {
		return record[column.key] ? record[column.key]['actualPrice'] : '';
	} else {
		// 综费产品
		if (record[column.key]) {
			const idx = record[column.key].findIndex((r: any) => r.comprehensiveFeeProductName === column.parentTitle);
			if (idx !== -1) {
				return record[column.key][idx][column.dataIndex] || '';
			}
		}
	}
	return '';
});
//地接社未消费费用获取数据
const getSubTravelVoUnSettlementPrice = computed(() => (record: any, column: any) => {
	return record[column.key] ? record[column.key]['unSettlementPrice'] : '';
});
</script>
<style scoped lang="scss">
.batchTransfer {
	margin: 20px 0;
	.last-btn {
		display: flex;
		justify-content: flex-end;
		margin-right: 30px;
		.btn {
			button {
				margin-left: 10px;
			}
		}
	}
	.header-total {
		margin: 10px 0;
		margin-left: 30px;
		span {
			font-size: 16px;
			font-weight: 700;
		}
	}
}
</style>
