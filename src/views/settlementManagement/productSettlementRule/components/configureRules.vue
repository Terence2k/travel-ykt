<template>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="toAddPage()" style="margin-right: 10px">新增</a-button>
			<a-button type="primary" class="success" @click="showTip('all', undefined)">删除</a-button>
		</div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable
				:dataSource="state.tableData.data"
				:columns="columns"
				:row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
			>
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toCheck(record)">查看</a>
							<a href="javascript:;" @click="toEditPage(record)">编辑</a>
							<a href="javascript:;" @click="showTip('state', index)">启用</a>
							<a href="javascript:;" @click="showTip('index', index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-spin>
		<CommonPagination
			:current="state.tableData.param.pageNo"
			:page-size="state.tableData.param.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
	<DelModal :params="cacheData.delParams" v-model="cacheData.delShow" @submit="tipSubmit" @cancel="tipCancel" />
</template>

<script setup lang="ts">
import { Ref } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import DelModal from '@/components/common/DelModal.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();

const columns = [
	{
		title: '团单类型',
		dataIndex: 'teamTypeId',
		key: 'teamTypeId',
	},
	{
		title: '结算产品',
		dataIndex: 'productId',
		key: 'productId',
	},
	{
		title: '费用名称',
		dataIndex: 'costName',
		key: 'costName',
	},
	{
		title: '收费金额',
		dataIndex: 'chargeCount',
		key: 'chargeCount',
	},
	{
		title: '费用说明',
		dataIndex: 'costExplanation',
		key: 'costExplanation',
	},
	{
		title: '状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	},
	{
		title: '优先级',
		dataIndex: 'level',
		key: 'level',
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
		data: [
			{
				teamTypeId: 123456,
			},
		],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			scenicLevel: null, //景区等级(字典序号)
			auditStatus: null, //审核状态（-1未提交  0待审核  1审核通过  2审核未通过）
			name: '',
		},
	},
	selectedRowKeys: [],
});

//搜索
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	// onSearch();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
};
//新增
const toAddPage = () => {
	route.push({ path: '/settlementManagement/productSettlementRule/edit' });
};
//编辑
const toEditPage = (record: any) => {
	console.log(record.oid, encodeURIComponent(record.oid));
	route.push({ path: '/settlementManagement/productSettlementRule/edit', query: { oid: encodeURIComponent(record.oid) } });
};
//查看
const toCheck = (record: any) => {
	route.push({ path: '/settlementManagement/productSettlementRule/info', query: { oid: encodeURIComponent(record.oid) } });
};
// const onSearch = () => {
// 	userList(state.tableData.param).then((res) => {
// 		console.log(res);
// 	});
// };
const initList = async () => {
	// state.tableData.loading = true;
	// let res = await api.getScenicSpotInformationList(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// const list: [any] = dealData(content);
	// state.tableData.data = list;
	// state.tableData.loading = false;
};
const status = {
	'-1': '未提交',
	0: '待审核',
	1: '审核通过',
	2: '审核未通过',
};
const dealData = (params: [any]) => {
	params.map((i: any) => {
		// i.derate = i.derate ? '支持' : '不支持';
		i.scenicLevel = i.scenicLevel ? i.scenicLevel : 0;
		i.auditStatus = status[i.auditStatus];
		let all = i.derateRule?.split(',');
		//减免规则
		if (all?.length > 1) {
			i.derateRule = '满' + all[0] + '减' + all[1];
		} else {
			i.derateRule = '无';
		}

		return i;
	});

	return params;
};
interface cacheDataType {
	delIndex: null | number | Array<any> | string;
	delShow: boolean;
	delParams?: delParamsType;
	delState?: string;
}
interface delParamsType {
	title?: string;
	content?: string;
}
const cacheData: Ref<cacheDataType> = ref({
	delIndex: null,
	delShow: false,
	delParams: {},
	delState: '',
});
const showTip = (str: string, par: any) => {
	if (str === 'index') {
		cacheData.value.delParams = { title: '删除', content: '是否删除所选数据？' };
		cacheData.value.delIndex = par;
		cacheData.value.delState = 'del';
	} else if (str === 'all') {
		cacheData.value.delParams = { title: '删除', content: '是否删除所选数据？' };
		cacheData.value.delIndex = state.selectedRowKeys;
		cacheData.value.delState = 'del';
	} else if (str === 'state') {
		let parStr = '';
		if (par === 1) {
			parStr = '启用';
		} else {
			parStr = '禁用';
		}
		cacheData.value.delIndex = par;
		cacheData.value.delState = 'state';
		cacheData.value.delParams = { title: parStr, content: `确定是否${parStr}？` };
	}
	cacheData.value.delShow = true;
};
const tipSubmit = () => {
	// 调用接口
	initList();
	tipCancel();
};
const tipCancel = () => {
	cacheData.value.delState = '';
	cacheData.value.delIndex = null;
	cacheData.value.delShow = false;
};
const onSelectChange = (selectedRowKeys: []) => {
	console.log('selectedRowKeys changed: ', selectedRowKeys);
	state.selectedRowKeys = selectedRowKeys;
};
onMounted(() => {
	initList();
	navigatorBar.setNavigator(['通用结算规则']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less" scoped>
.table-area {
	position: relative;
	overflow: hidden;
}
</style>
