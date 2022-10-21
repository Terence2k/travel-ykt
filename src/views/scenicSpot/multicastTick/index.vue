<template>
	<CommonSearch>
		<SearchItem label="输入搜索">
			<!-- <a-input v-model:value="state.tableData.itineraryNo" placeholder="请输入行程单号" style="width: 200px" /> -->
			<a-input v-model:value="state.tableData.param.ticketName" placeholder="门票名称/关键词" style="width: 200px" />
		</SearchItem>
		<SearchItem label="归属景区">
			<a-select ref="select" style="width: 200px" placeholder="请选择">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</SearchItem>
		<template #button>
			<a-button @click="initPage">查询</a-button>
		</template>
	</CommonSearch>

	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="add()">新增</a-button>
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'index'">
					{{ index + 1 }}
				</template>
				<template v-if="column.key === 'auditStatus'">
					{{ commonEnum.auditStatus[record.auditStatus] }}
				</template>
				<template v-if="column.key === 'putaway'">
					{{ record.putaway ? '上架' : '下架' }}
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="toEditPage(record)">编辑</a>
						<a href="javascript:;" @click="outDown(index)">
							{{ !record.putaway ? '上架' : '下架' }}
						</a>
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
import SearchItem from '@/components/common/CommonSearchItem.vue';
import api from '@/api';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { useCommonEnum } from '@/stores/modules/commonEnum';
import { message } from 'ant-design-vue';
const route = useRouter();
const navigatorBar = useNavigatorBar();
const commonEnum = useCommonEnum();
// import { userList } from '@/api';
const dataSource = ref([
	{
		ticketName: '测试联票1',
		sonCount: 3,
		auditStatus: 2,
		putaway: true,
	},
	{
		ticketName: '测试联票2',
		sonCount: 3,
		auditStatus: 2,
		putaway: true,
	},
	{
		ticketName: '测试联票3',
		sonCount: 3,
		auditStatus: 2,
		putaway: true,
	},
]);
const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '联票名称',
		dataIndex: 'ticketName',
		key: 'ticketName',
	},
	{
		title: '子票数量',
		dataIndex: 'sonCount',
		key: 'sonCount',
	},
	{
		title: '审核状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	},
	{
		title: '平台上下架状态',
		dataIndex: 'putaway',
		key: 'putaway',
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
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			ticketName: '',
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	initPage();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	initPage();
};
//编辑
const toEditPage = (value: any) => {
	route.push({ path: '/scenic-spot/multicast/edit', query: { t: 1, o: value.oid } });
};
//下架
const outDown = (index) => {
	console.log(index);
	state.tableData.data[index].putaway = !state.tableData.data[index].putaway;
	message.success('成功');
	// route.push({ path: '/scenic-spot/multicast/edit' });
};
//新增
const add = () => {
	route.push({ path: '/scenic-spot/multicast/edit', query: { t: 0 } });
};

const initPage = async () => {
	// userList(state.tableData.param).then((res) => {
	// 	console.log(res);
	// });
	let res = await api.getMultipleList(state.tableData.param);
	state.tableData.data = res.content || dataSource;
	state.tableData.total = res.total;
	console.log('res', res);
};
onMounted(() => {
	initPage();
	// navigatorBar
	// 重新定义面包屑
	// navigatorBar.clearNavigator();
	// navigatorBar.setNavigator(['演出票']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="scss" scoped></style>
