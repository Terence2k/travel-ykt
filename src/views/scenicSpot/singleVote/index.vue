<template>
	<Audit ref="auditRef" @done="done" />
	<div>
		<a-spin size="large" :spinning="state.tableData.loading" style="min-height: 50vh">
			<CommonSearch>
				<search-item label="输入搜索">
					<a-input v-model:value="state.tableData.param.ticketName" placeholder="门票名称/关键词" />
				</search-item>
				<!-- <search-item label="门票分类">
					<a-select allowClear ref="select" v-model:value="state.tableData.param.ticketType" style="width: 200px" placeholder="请选择">
						<a-select-option :value="index" v-for="(item, index) in ticketType" :key="item">{{ item }}</a-select-option>
					</a-select>
				</search-item> -->
				<template #button>
					<a-button @click="reset" style="margin-right: 30px">重置</a-button>
					<a-button @click="search">查询</a-button>
				</template>
			</CommonSearch>
			<div class="table-area">
				<div class="list-btn">
					<a-button type="primary" class="success" @click="createNewProject">新增门票</a-button>
				</div>

				<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }">
					<template #bodyCell="{ column, record }">
						<template v-if="column.key === 'action'">
							<div class="action-btns">
								<a href="javascript:;" v-permission="'编辑'" @click="toEdit(record)">编辑</a>
								<a href="javascript:;" v-permission="'删除'" @click="del(record)">删除</a>
								<a href="javascript:;" v-permission="'库存与价格日历'" @click="Inventory(record)">库存与价格日历</a>
								<a href="javascript:;" v-permission="'下架修改'" v-if="record.putaway === '上架'" @click="open(record)"> 下架</a>
								<a href="javascript:;" v-permission="'下架修改'" v-if="record.putaway === '下架'" @click="register(record)"> 上架</a>
								<a href="javascript:;" v-permission="'下架修改'" v-if="record.putaway === '下架'" @click="changeDownTicket(record)"> 下架修改</a>
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
			<Create ref="createModelRef" />
		</a-spin>
		<DelModal :params="{ title: '删除', content: '是否确定该条数据' }" v-model="delShow" @submit="delSubmit" @cancel="delCancel" />
		<InventoryCalendar ref="calendarRef" />
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
import DelModal from '@/components/common/DelModal.vue';
import Calendar from '@/components/common/calendarDouble.vue';
import InventoryCalendar from './components/InventoryCalendar.vue';
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();

const modelValue = ref<boolean>(false);

const columns = [
	{
		title: '门票名称',
		dataIndex: 'ticketName',
		key: 'ticketName',
		width: 200,
	},
	{
		title: '票种',
		dataIndex: 'verificationTypeName',
		key: 'verificationTypeName',
		width: 120,
	},
	{
		title: '归属景区',
		dataIndex: 'scenicName',
		key: 'scenicName',
		width: 120,
	},
	// {
	// 	title: '审核状态',
	// 	dataIndex: 'auditStatus',
	// 	key: 'auditStatus',
	// 	width: 120,
	// },
	{
		title: '平台上架状态',
		dataIndex: 'putaway',
		key: 'putaway',
		width: 120,
	},
	{
		title: '操作 ',
		key: 'action',
		// fixed: 'right',
		width: 208,
	},
];

const auditRef = ref();
const open = (value: any) => {
	auditRef.value.open(value.oid, '', value.ticketName);
};

const changeDownTicket = (value: any) => {
	auditRef.value.open(value.oid, 'edit', value.ticketName);
};
const done = () => {
	state.tableData.loading = true;
	setTimeout(() => {
		initList();
	}, 300);
};
//上架
const register = async (value: any) => {
	await api.resigerScenicTicketDetail(value.oid);
	done();
};

const toEdit = (record: any) => {
	console.log(record);

	route.push({ path: '/scenic-spot/singleVote/edit', query: { t: record.verificationType, oid: record.oid } });
};
//库存日历
const calendarRef = ref();

//库存部分
const Inventory = (value: any) => {
	// InventoryIndex.value = index;
	calendarRef.value.open(value.oid);
};
// 删除提示
const delShow = ref(false);
const delOid = ref<null | number>();
const del = (record: any) => {
	delShow.value = true;
	delOid.value = record.oid;
	// emits('del-verification-obj', index);
};
const delSubmit = () => {
	api.singleVoteDel(delOid.value);
	delCancel();

	done();
};
const delCancel = () => {
	delShow.value = false;
	delOid.value = null;
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
//重置
const reset = () => {
	state.tableData.param.ticketName = '';
	state.tableData.param.pageNo = 1;
};
//搜索
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
};
const search = () => {
	state.tableData.param.pageNo = 1;
	initList();
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

const status = ['待审核', '审核中', '审核通过', '审核不通过'];

const dealData = (params: [any]) => {
	params.map((i: any) => {
		// i.auditStatus = status[i.auditStatus];
		i.putaway = i.putaway ? '上架' : '下架';
		i.verificationTypeName = i.verificationType === 1 ? '多点核销' : i.verificationType === 0 ? '单点核销' : '';
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
