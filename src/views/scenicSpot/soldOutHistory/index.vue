<template>
	<Audit ref="auditRef" />
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
			<a-spin size="large" :spinning="state.tableData.loading">
				<div class="list-btn">
					<!-- <a-button type="primary" class="success">导出</a-button> -->
				</div>
				<CommonTable :dataSource="state.tableData.data" :columns="columns"> </CommonTable>
			</a-spin>
			<CommonPagination
				:current="state.tableData.param.pageNo"
				:page-size="state.tableData.param.pageSize"
				:total="state.tableData.total"
				@change="onHandleCurrentChange"
				@showSizeChange="pageSideChange"
			/>
		</div>
	</div>
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
		dataIndex: 'scenicLevel',
		key: 'scenicLevel',
	},
	{
		title: '票种',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '归属景区',
		dataIndex: 'creditCode',
		key: 'creditCode',
	},
	{
		title: '门票管理',
		dataIndex: 'phone',
		key: 'phone',
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
