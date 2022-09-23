<template>
	<Audit ref="auditRef" />
	<div>
		<CommonSearch>
			<search-item label="输入搜索">
				<a-input v-model:value="state.tableData.param.ticketName" placeholder="门票名称/关键词" />
			</search-item>
			<search-item label="门票分类">
				<a-select allowClear ref="select" v-model:value="state.tableData.param.ticketType" style="width: 200px" placeholder="请选择">
					<a-select-option :value="index" v-for="(item, index) in ticketType" :key="item">{{ item }}</a-select-option>
				</a-select>
			</search-item>
			<template #button>
				<a-button @click="initList">查询</a-button>
			</template>
		</CommonSearch>
		<div class="table-area">
			<a-spin size="large" :spinning="state.tableData.loading">
				<div class="list-btn">
					<a-button type="primary" class="success" @click="createNewProject">新增门票</a-button>
				</div>
				<CommonTable :dataSource="state.tableData.data" :columns="columns">
					<template #bodyCell="{ column, record }">
						<template v-if="column.key === 'action'">
							<div class="action-btns">
								<a href="javascript:;" @click="toEdit(record)">编辑</a>
								<a href="javascript:;">删除</a>
								<a href="javascript:;" v-if="record.putaway === '上架'" @click="open"> 下架申请</a>
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
		<Create ref="createModelRef" />
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import AddPopup from './addPopup.vue';
import Modal from '@/components/common/BaseModal.vue';
import Audit from './components/aduit.vue';
import Create from './components/create.vue';
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
		dataIndex: 'scenicName',
		key: 'scenicName',
	},
	{
		title: '门票分类',
		dataIndex: 'ticketType',
		key: 'ticketType',
	},
	{
		title: '审核状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	},
	{
		title: '平台上架状态',
		dataIndex: 'putaway',
		key: 'putaway',
	},
	{
		title: '操作 ',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];

const auditRef = ref();
const open = () => {
	console.log(auditRef.value.open);
	auditRef.value.open();
};

const toEdit = (record: any) => {
	console.log(record);

	route.push({ path: '/scenic-spot/singleVote/edit', query: { oid: encodeURIComponent(record.oid) } });
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
			ticketName: '',
			ticketType: null,
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

const initList = async () => {
	state.tableData.loading = true;
	let res = await api.getSingleVoteList(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	const list: [any] = dealData(content);
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
	params.map((i: any) => {
		i.ticketType = ticketType[i.ticketType];
		i.auditStatus = status[i.auditStatus];
		i.putaway = i.putaway ? '上架' : '下架';
		i.verificationType = i.verificationType === 'MANY' ? '多点核销' : i.verificationType === 'ONE' ? '单点核销' : '';
		return i;
	});

	return params;
};

// 新增
const createModelRef = ref();
const createNewProject = () => {
	createModelRef.value.open();
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
