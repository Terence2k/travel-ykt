<template>
	<a-spin size="large" :spinning="state.tableData.loading" style="min-height: 50vh">
		<CommonSearch>
			<search-item label="审核状态">
				<a-select allowClear ref="select" v-model:value="state.tableData.param.auditStatus" style="width: 200px" placeholder="请选择景区等级">
					<a-select-option :value="-1">未提交</a-select-option>
					<a-select-option :value="0">待审核 </a-select-option>
					<a-select-option :value="1"> 审核通过</a-select-option>
					<a-select-option :value="2"> 审核未通过</a-select-option>
				</a-select>
			</search-item>
			<search-item label="景区等级">
				<a-select allowClear ref="select" v-model:value="state.tableData.param.scenicLevel" style="width: 200px" placeholder="请选择景区等级">
					<a-select-option :value="num" v-for="num in 10" :key="num">{{ num }}</a-select-option>
				</a-select>
			</search-item>
			<search-item label="景区名称">
				<a-input v-model:value="state.tableData.param.name" placeholder="请选择审核状态" />
			</search-item>
			<template #button>
				<a-button @click="initList">查询</a-button>
			</template>
		</CommonSearch>
		<div class="table-area">
			<div class="list-btn">
				<a-button type="primary" class="success">导出</a-button>
			</div>

			<CommonTable :dataSource="state.tableData.data" :columns="columns">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toCheck(record)">查看</a>
							<a href="javascript:;" @click="toEditPage(record)">审核</a>
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

const columns = [
	{
		title: '景区等级',
		dataIndex: 'scenicLevel',
		key: 'scenicLevel',
	},
	{
		title: '景区名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '企业信用代码',
		dataIndex: 'creditCode',
		key: 'creditCode',
	},
	{
		title: '联系电话',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '所在地址',
		dataIndex: 'addressDetail',
		key: 'addressDetail',
	},
	{
		title: '审核状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	},
	{
		title: '提供减免',
		dataIndex: 'derateRule',
		key: 'derateRule',
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
// const onSearch = () => {
// 	userList(state.tableData.param).then((res) => {
// 		console.log(res);
// 	});
// };
const initList = async () => {
	state.tableData.loading = true;
	let res = await api.getScenicSpotInformationList(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	const list: [any] = dealData(content);
	state.tableData.data = list;
	state.tableData.loading = false;
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
onMounted(() => {
	initList();
	navigatorBar.setNavigator(['景区信息管理']);
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
