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
				<span>费用合计：{{ allMoney }}</span>
			</div>
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }" bordered>
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'status'">
					<span v-if="record.status === 1" style="color: red">待审核</span>
					<span v-if="record.status === 2" style="color: green">全部完成</span>
					<span v-if="record.status === 3" style="color: red">审核不通过</span>
					<span v-if="record.status === 4" style="color: red">部分完成</span>
				</template>
				<!-- 行程费用 / 100 -->
				<template v-if="column.key === 'settlementCost'"> {{ twoDecimalPlaces(record.settlementCost) }} </template>
				<!-- 动态表头的数据 -->
				<template v-if="column.parentKey === 'collectionCompany'">
					{{ getCollectionCompany(column, record) }}
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
	ids?: null | Array<number>; // ID数组
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
			ids: [],
		},
	},
	modalShow: false,
	modalParams: { title: '审核通过', content: '是否确认对勾选的六条数据进行转账？' },
});
const columns = computed(() => {
	const startColumns = [
		{
			title: '行程单号',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
		},
		{
			title: '地接社',
			dataIndex: 'travelName',
			key: 'travelName',
			width: 100,
		},
	];
	const endColumns = [
		{
			title: '行程费用',
			dataIndex: 'settlementCost',
			key: 'settlementCost',
			width: 100,
		},
		{
			title: '状态',
			dataIndex: 'state',
			key: 'state',
			width: 100,
		},
	];
	const activeColumns = [];
	const activeData = state.tableData.data;
	for (let index = 0; index < activeData.length; index++) {
		const dataItem: { list: Array<any> } = activeData[index];
		if (dataItem.list && dataItem.list.length) {
			const dataList = dataItem.list;
			for (let subIndex = 0; subIndex < dataList.length; subIndex++) {
				const listItem = dataList[subIndex];
				// 判断是否已经存在该信息
				const idx = activeColumns.findIndex((item: { key: number }) => item.key === listItem.collectionCompanyId);
				if (idx === -1) {
					const item = {
						title: listItem.collectionCompanyName,
						dataIndex: listItem.collectionCompanyId,
						key: listItem.collectionCompanyId,
						children: [
							{
								title: '一卡通',
								key: 'yktMoney',
								collectionCompanyId: listItem.collectionCompanyId,
								parentKey: 'collectionCompany',
							},
							{
								title: '银行',
								key: 'bankMoney',
								collectionCompanyId: listItem.collectionCompanyId,
								parentKey: 'collectionCompany',
							},
						],
					};
					activeColumns.push(item);
				}
			}
		}
	}
	console.log(activeColumns, 'activeColumns');

	return [...startColumns, ...activeColumns, ...endColumns];
});
const examineType = ref(0);
const examine = (type: number) => {
	if (type === 0) {
		examineType.value = 0;
		state.modalParams = { title: '审核不通过', content: '是否确认审核不通过？' };
		state.modalShow = true;
	} else {
		examineType.value = 1;
		state.modalParams = { title: '审核通过', content: '是否确认进行转账？' };
		state.modalShow = true;
	}
};
const tipSubmit = async () => {
	if (examineType.value === 1) {
		// 调用接口
		// 审核通过
		await api.auditTransferAccounts({
			status: 2,
			transferAccountsOidList: state.tableData.param.ids,
		});
		state.modalShow = false;
		router.push('/settlementManagement/transferManagement/list');
	} else if (examineType.value === 0) {
		// 调用接口
		await api.auditTransferAccounts({
			status: 3,
			transferAccountsOidList: state.tableData.param.ids,
		});
		state.modalShow = false;
		router.push('/settlementManagement/transferManagement/list');
	}
};
const router = useRouter();
const initList = async () => {
	const id: string = router.currentRoute.value.query.id as string;
	state.tableData.param.ids = id.split(',') as Array<any>;
	state.tableData.loading = true;
	let data = await api.transferAccountList(state.tableData.param.ids);
	state.tableData.data = data;
	// state.tableData.data = [
	// 	{
	// 		oid: 17, //oid
	// 		travelId: 73, //旅行社id
	// 		travelName: '丽江a旅行社', //旅行社名称
	// 		status: null, //状态
	// 		settlementCost: 8000, //结算总额
	// 		itineraryNo: 'f0da8dfb-2130-4d81-be71-e1fde8246fe2', //行程单号
	// 		list: [
	// 			{
	// 				collectionCompanyId: 73, //收款企业id
	// 				collectionCompanyName: '第1个单位', //收款单位
	// 				yktMoney: 8000, //一卡通金额
	// 				bankMoney: 123, //银行金额
	// 			},
	// 			{
	// 				collectionCompanyId: 95, //收款企业id
	// 				collectionCompanyName: '第2个单位', //收款单位
	// 				yktMoney: 555, //一卡通金额
	// 				bankMoney: 456, //银行金额
	// 			},
	// 			{
	// 				collectionCompanyId: 106, //收款企业id
	// 				collectionCompanyName: '第3个单位', //收款单位
	// 				yktMoney: 666, //一卡通金额
	// 				bankMoney: 789, //银行金额
	// 			},
	// 		], //结算信息
	// 	},
	// 	{
	// 		oid: 18, //oid
	// 		travelId: 90, //旅行社id
	// 		travelName: 'g旅行社', //旅行社名称
	// 		status: null, //状态
	// 		settlementCost: 30121, //结算总额
	// 		itineraryNo: '8880ec2f-65ae-4a69-896b-e04e1ab34ed2', //行程单号
	// 		list: [
	// 			{
	// 				collectionCompanyId: 90, //收款企业id
	// 				collectionCompanyName: '第4个单位', //收款单位
	// 				yktMoney: 25010, //一卡通金额
	// 				bankMoney: 777, //银行金额
	// 			},
	// 			{
	// 				collectionCompanyId: 101, //收款企业id
	// 				collectionCompanyName: '第5个单位', //收款单位
	// 				yktMoney: 111, //一卡通金额
	// 				bankMoney: 888, //银行金额
	// 			},
	// 			{
	// 				collectionCompanyId: 95, //收款企业id
	// 				collectionCompanyName: '第6个单位', //收款单位
	// 				yktMoney: 5000, //一卡通金额
	// 				bankMoney: 999, //银行金额
	// 			},
	// 			{
	// 				collectionCompanyId: 107, //收款企业id
	// 				collectionCompanyName: '第7个单位', //收款单位
	// 				yktMoney: 0, //一卡通金额
	// 				bankMoney: 1111, //银行金额
	// 			},
	// 			{
	// 				collectionCompanyId: 2, //收款企业id
	// 				collectionCompanyName: '第8个单位', //收款单位
	// 				yktMoney: 0, //一卡通金额
	// 				bankMoney: 2222, //银行金额
	// 			},
	// 		], //结算信息
	// 	},
	// ];
	state.tableData.loading = false;
};
const tipCancel = () => {
	state.modalShow = false;
};
const twoDecimalPlaces = computed(() => (number: any): any => {
	if (typeof number === 'string') {
		if (number.includes('-')) {
			number = number.slice(1);
			return `-${Number(number / 100).toFixed(2)}`;
		}
	}
	return Number(number / 100).toFixed(2);
});
const twoDecimalPlacesFunc = (number: any): any => {
	if (typeof number === 'string') {
		if (number.includes('-')) {
			number = number.slice(1);
			return `-${Number(number / 100).toFixed(2)}`;
		}
	}
	return Number(number / 100).toFixed(2);
};
const getCollectionCompany = computed(() => (column: any, record: any) => {
	const list = record.list;
	// 银行
	if (column.key === 'bankMoney') {
		const idx = list.findIndex((item: any) => item.collectionCompanyId === column.collectionCompanyId);
		if (idx !== -1) {
			return twoDecimalPlacesFunc(list[idx]['bankMoney']);
		}
		return '';
	}
	// 一卡通
	if (column.key === 'yktMoney') {
		const idx = list.findIndex((item: any) => item.collectionCompanyId === column.collectionCompanyId);
		if (idx !== -1) {
			return twoDecimalPlacesFunc(list[idx]['yktMoney']);
		}
		return '';
	}
});
// 所有的数据的费用合计
const allMoney = computed(() => {
	const data = state.tableData.data;
	let count = 0;
	for (let index = 0; index < data.length; index++) {
		const money = data[index].settlementCost;
		count += money;
	}
	return twoDecimalPlacesFunc(count);
});
onMounted(() => {
	initList();
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
