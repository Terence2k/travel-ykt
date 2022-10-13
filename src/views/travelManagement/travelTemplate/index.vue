<template>
	<div>
		<CommonSearch>
			<search-item label="模板名称">
				<a-select allowClear v-model:value="state.tableData.param.shopId" placeholder="请输入模板名称">
					<a-select-option v-for="i in cateringStoreName" :key="i.shopId" :value="i.shopId">{{ i.shopName }}</a-select-option>
				</a-select>
			</search-item>
			<search-item label="团队类型">
				<a-select allowClear v-model:value="state.tableData.param.shopId" placeholder="请选择团队类型">
					<a-select-option v-for="i in cateringStoreName" :key="i.shopId" :value="i.shopId">{{ i.shopName }}</a-select-option>
				</a-select>
			</search-item>
			<template #button>
				<a-button @click="getList">查询</a-button>
			</template>
		</CommonSearch>
		<CommonTable :dataSource="state.tableData.data" rowKey="id" :row-selection="rowSelection" :columns="columns">
			<template #button>
				<a-button type="primary" @click="openInfoPage" style="margin-right:16px">新增</a-button>
				<a-button type="primary">导出</a-button>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="openInfoPage(record)">查看</a>
						<a >编辑</a>
						<a >允许带团</a>
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

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { ref, reactive, onMounted } from 'vue';
import api from '@/api';
import { useScenicSpotOption } from '@/stores/modules/scenicSpot';

const scenicSpotOptions = useScenicSpotOption();

const navigatorBar = useNavigatorBar();

const router = useRouter();

interface DataSourceItem {
	cateringName: string | number;
	key: string | number;
	orderNum: string;
	price: string | number;
	status: string;
	companyName: string;
}
const columns = [
	{
		title: '模板名称',
		dataIndex: 'cateringName',
		key: 'cateringName',
	},
	{
		title: '导游电话',
		dataIndex: 'orderNum',
		key: 'orderNum',
	},
	{
		title: '导游证号',
		dataIndex: 'price',
		key: 'price',
	},
	{
		title: '所属旅行社',
		dataIndex: 'status',
		key: 'status',
	},
	{
		title: '状态',
		dataIndex: 'companyName',
		key: 'companyName',
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
			shopPhone: null,
			shopId: null,
			status: null,
		},
	},
	params: {},
	showDetail: false,
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
};

const rowSelection = computed(() => {
	return {
		// onChange: (selectedRowKeys: (string | number)[], selectedRows: DataSourceItem[]) => {
		// 	console.log('1',`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		// },
		onSelect: (record: DataSourceItem, selected: boolean, selectedRows: DataSourceItem[]) => {
			console.log(record, selected, selectedRows);
		},
		// onSelectAll: (selected: boolean, selectedRows: DataSourceItem[], changeRows: DataSourceItem[]) => {
		// 	console.log(selected, selectedRows, changeRows);
		// },
	}
})

const cateringStoreName = computed(() => scenicSpotOptions.cateringStoreName);

const getList = async (): Promise<void> => {
	api.getProductPage(state.tableData.param).then((res: any) => {
		state.tableData.total = res.total;
		const list: [any] = dealData(res.content);
		state.tableData.data = list;
	});
	await scenicSpotOptions.getCateringStoreName();
};
const status = {
	false: '停用',
	true: '启用',
};
const dealData = (params: [any]) => {
	params.map((i: any) => {
		i.status = status[i.status];
		return i;
	});
	return params;
};

const openEditPage = (record: any) => {
	router.push({ path: '/catering/product_Management/product_edit', query: { id: record.oid } });
};
const openInfoPage = (record: any) => {
	router.push({ path: '/travel/travelTtemplate/info', query: { id: record.oid } });
};
const openAddPage = (record: any) => {
	router.push({ path: '/catering/product_Management/product_add' });
};

onMounted(() => {
	navigatorBar.setNavigator(['行程模板管理']);
	getList();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style scoped lang="less">
// table style
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
