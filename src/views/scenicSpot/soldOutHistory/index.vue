<template>
	<Audit ref="auditRef" />
	<a-spin size="large" :spinning="state.tableData.loading" style="min-height: 50vh">
		<div>
			<CommonSearch>
				<search-item label="输入搜索">
					<a-input v-model:value="state.tableData.param.name" placeholder="请输入" />
				</search-item>
				<search-item label="门票分类">
					<a-select allowClear ref="select" v-model:value="state.tableData.param.auditStatus" style="width: 200px" placeholder="请选择门票分类">
						<a-select-option :value="-1">option1</a-select-option>
					</a-select>
				</search-item>
				<template #button>
					<a-button @click="initList">查询</a-button>
				</template>
			</CommonSearch>
			<div class="table-area">
				<div class="list-btn">
					<!-- <a-button type="primary" class="success">导出</a-button> -->
				</div>
				<CommonTable :dataSource="state.tableData.data" :columns="columns"> </CommonTable>

				<CommonPagination
					:current="state.tableData.param.pageNo"
					:page-size="state.tableData.param.pageSize"
					:total="state.tableData.total"
					@change="onHandleCurrentChange"
					@showSizeChange="pageSideChange"
				/>
			</div>
		</div>
	</a-spin>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();

const modelValue = ref<boolean>(false);

const columns = [
	{
		title: '门票名称',
		dataIndex: 'ticketName',
		key: 'ticketName',
	},
	{
		title: '票种',
		dataIndex: 'verificationType',
		key: 'verificationType',
	},
	{
		title: '归属景区',
		dataIndex: 'creditCode',
		key: 'creditCode',
	},
	{
		title: '平台上架状态',
		dataIndex: 'putaway',
		key: 'putaway',
	},
	{
		title: '门票管理',
		dataIndex: 'ticketType',
		key: 'ticketType',
	},
	{
		title: '下架开始时间',
		dataIndex: 'addressDetail',
		key: 'addressDetail',
	},
	{
		title: '下架结束日期',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	},
	{
		title: '原因',
		dataIndex: 'derateRule',
		key: 'derateRule',
	},
	{
		title: '申请时间',
		dataIndex: 'derateRule',
		key: 'derateRule',
	},
	{
		title: '审核时间',
		dataIndex: 'derateRule',
		key: 'derateRule',
	},
	{
		title: '审核状态',
		key: 'derateRule',
		width: 208,
	},
	{
		title: '审核结果',
		key: 'derateRule',
		width: 208,
	},
];

const auditRef = ref();
const open = () => {
	console.log(auditRef.value.open);

	auditRef.value.open();
};
const cancel = () => {
	modelValue.value = false;
};
const onSearch = () => {
	console.log('cancle');
};
const state = reactive({
	tableData: {
		data: [],
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
//编辑
const toEditPage = (record: any) => {
	console.log(record.oid, encodeURIComponent(record.oid));
	route.push({ path: '/scenic-spot/information/edit', query: { oid: encodeURIComponent(record.oid) } });
};
//查看
const toCheck = (record: any) => {
	route.push({ path: '/scenic-spot/information/info', query: { oid: encodeURIComponent(record.oid) } });
};

const initList = async () => {
	state.tableData.loading = true;
	let res = await api.getSingleVoteList(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	const list: any = dealData(content);
	state.tableData.data = list;
	state.tableData.loading = false;
};
const status: any = {
	TO_AUDIT: '待审核',
	PASS: '审核通过',
	AUDITING: '审核中',
	NO_PASS: '审核不通过',
};

const ticketType: any = {
	0: '儿童',
	1: '成人',
	2: '老人',
};

const dealData = (params: [any]) => {
	let res = params.filter((i: any) => {
		return !i.putaway;
	});
	res.map((i: any) => {
		i.ticketType = ticketType[i.ticketType];
		i.auditStatus = status[i.auditStatus];
		i.putaway = i.putaway ? '上架' : '下架';
		i.verificationType = i.verificationType === 'MANY' ? '多点核销' : i.verificationType === 'ONE' ? '单点核销' : '';
		return i;
	});

	return res;
};

onMounted(() => {
	initList();
	// navigatorBar.setNavigator(['景区信息管理']);
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
