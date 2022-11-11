<template>
	<div>
		<CommonSearch>
			<search-item label="模板名称">
				<a-input placeholder="请输入模板名称" v-model:value="state.tableData.param.templateName" />
			</search-item>
			<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.teamType" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
			<template #button>
				<a-button @click="react" style="margin-right: 20px" >重置</a-button>
				<a-button @click="getList">查询</a-button>
			</template>
		</CommonSearch>
		<CommonTable :dataSource="state.tableData.data" rowKey="oid" :row-selection="rowSelection" :columns="columns">
			<template #button>
				<a-button type="primary" @click="AddPage" style="margin-right: 16px">新增</a-button>
				<a-button type="primary">导出</a-button>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="openInfoPage(record)">查看</a>
						<a @click="openeditPage(record)">编辑</a>
						<a-popconfirm title="确认是否允许带团" ok-text="确认" cancel-text="取消" @confirm="confirm" @cancel="cancel">
							<a>允许带团</a>
						</a-popconfirm>
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
import { ref, reactive, onMounted, defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import api from '@/api';
import { useTravelStore } from '@/stores/modules/travelManagement';

import { useScenicSpotOption } from '@/stores/modules/scenicSpot';
import { settlementOptions } from '@/stores/modules/settlement';
const options = settlementOptions();
const scenicSpotOptions = useScenicSpotOption();
const travelStore = useTravelStore();

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
		dataIndex: 'templateName',
		key: 'templateName',
	},
	{
		title: '团队类型',
		dataIndex: 'teamTypeName',
		key: 'teamTypeName',
	},
	{
		title: '地接社',
		dataIndex: 'teamTypeName',
		key: 'teamTypeName',
	},
	{
		title: '地接社计调',
		dataIndex: 'subTravelOperatorName',
		key: 'subTravelOperatorName',
	},
	{
		title: '合作导游',
		dataIndex: 'guideNames',
		key: 'guideNames',
	},
	{
		title: '包含酒店',
		dataIndex: 'hotelNames',
		key: 'hotelNames',
	},
	{
		title: '包含景区',
		dataIndex: 'scenicNames',
		key: 'scenicNames',
	},
	{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
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
			templateName:'',
			teamType:''
		},
	},
	params: {},
	showDetail: false,
});

// 气泡框
const confirm = (e: MouseEvent) => {
	message.success('允许带团');
};

const cancel = (e: MouseEvent) => {};

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	getList()
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	getList()
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
	};
});

const cateringStoreName = computed(() => scenicSpotOptions.cateringStoreName);

const getList = async (): Promise<void> => {
	api.travelManagement.getTravelTemplateList(state.tableData.param).then((res: any) => {
		state.tableData.total = res.total;
		// const list: [any] = dealData(res.content);
		state.tableData.data = res.content;
	});
};
const react = () => {
	state.tableData.param.teamType = ''
	state.tableData.param.templateName = ''
	getList()
};
const status = {
	false: '停用',
	true: '启用',
};
// const dealData = (params: [any]) => {
// 	params.map((i: any) => {
// 		i.status = status[i.status];
// 		return i;
// 	});
// 	return params;
// };

const openeditPage = (record: any) => {
	const Cedit = 0;
	router.push({ path: '/travel/travelTtemplate/info', query: { oid: record.oid, Cedit: Cedit } });
};
const openInfoPage = (record: any) => {
	const Cinfo = 1;
	router.push({ path: '/travel/travelTtemplate/info', query: { oid: record.oid, Cinfo: Cinfo } });
};
const AddPage = (id: any) => {
	const Cedit = 0;
	travelStore.hotels = []
	travelStore.scenicTickets = []
	router.push({ path: '/travel/travelTtemplate/info', query: { Cedit: Cedit } });
};

onMounted(() => {
	navigatorBar.setNavigator(['行程模板管理']);
	getList();
	options.getTeamTypeList();
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
