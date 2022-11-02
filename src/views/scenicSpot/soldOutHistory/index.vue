<template>
	<a-spin size="large" :spinning="state.tableData.loading" style="min-height: 50vh">
		<div>
			<CommonSearch>
				<search-item label="输入搜索">
					<a-input v-model:value="state.tableData.param.name" placeholder="请输入" />
				</search-item>
				<search-item label="门票分类">
					<a-select ref="select" style="width: 200px" placeholder="请选择门票分类" v-model:value="state.tableData.param.auditStatus">
						<a-select-option value="0">联票</a-select-option>
						<a-select-option value="1">单票</a-select-option>
						<a-select-option value="2">演出票</a-select-option>
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
				<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }">
					<template #bodyCell="{ column, record }">
						<template v-if="column.key === 'ticketDataType'">
							{{ ticketDataTypeList[record.ticketDataType] }}
						</template>
						<template v-if="column.key === 'ticketType'">
							{{ ticketTypeList[record.ticketType] }}
						</template>
						<template v-if="column.key === 'endDateTime'">
							{{ shijianc(record.endDateTime) }}
						</template>
						<template v-if="column.key === 'startDateTime'">
							{{ shijianc(record.startDateTime) }}
						</template>
						<template v-if="column.key === 'auditResult'">
							{{ record.auditResult === 1 ? '生效' : record.auditResult === 0 ? '不生效' : '' }}
						</template>
						<template v-if="column.key === 'auditStatus'">
							{{ commonEnum.auditStatus[record.auditStatus] }}
						</template>
						<template v-if="column.key === 'auditDate'">
							<span v-if="record.auditDate">{{ shijianc(record.auditDate) }} </span></template
						>
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
		</div>
	</a-spin>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { shijianc, shijiancTOYMD } from '@/utils/formatTIme';
import { useCommonEnum } from '@/stores/modules/commonEnum';
import api from '@/api';

const commonEnum = useCommonEnum();

const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();
const router = useRoute();

const ticketDataTypeList = ['联票', '单票', '演出票'];
const ticketTypeList = {
	UNITE: '联票',
	ONE: '单票',
	SHOW: '演出票',
};

const modelValue = ref<boolean>(false);

const columns = [
	{
		title: '门票名称',
		dataIndex: 'ticketName',
		key: 'ticketName',
		width: 120,
	},
	{
		title: '票种',
		dataIndex: 'ticketDataType',
		key: 'ticketDataType',
		width: 120,
	},
	{
		title: '归属景区',
		dataIndex: 'scenicNames',
		key: 'scenicNames',
		width: 120,
	},

	{
		title: '门票分类',
		dataIndex: 'ticketType',
		key: 'ticketType',
		width: 120,
	},
	{
		title: '下架开始时间',
		dataIndex: 'startDateTime',
		key: 'startDateTime',
		width: 120,
	},
	{
		title: '下架结束时间',
		dataIndex: 'endDateTime',
		key: 'endDateTime',
		width: 120,
	},
	{
		title: '原因',
		dataIndex: 'downReason',
		key: 'downReason',
		width: 120,
	},
	// {
	// 	title: '申请时间',
	// 	dataIndex: 'derateRule',
	// 	key: 'derateRule',
	// 	width: 120,
	// },
	// {
	// 	title: '审核时间',
	// 	dataIndex: 'auditDate',
	// 	key: 'auditDate',
	// 	width: 120,
	// },
	// {
	// 	title: '审核状态',
	// 	key: 'auditStatus',
	// 	width: 120,
	// },
	// {
	// 	title: '审核结果',
	// 	key: 'auditResult',
	// 	width: 120,
	// },
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
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
	initList();
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
	let res = await api.scenicTicketDownList(state.tableData.param);
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

const dealData = (params: [any]) => {
	let res = params.filter((i: any) => {
		return !i.putaway;
	});
	res.map((i: any) => {
		// i.ticketType = ticketType[i.ticketType];
		// i.auditStatus = status[i.auditStatus];
		i.putaway = i.putaway ? '上架' : '下架';
		i.verificationType = i.verificationType === 'MANY' ? '多点核销' : i.verificationType === 'ONE' ? '单点核销' : '';
		return i;
	});

	return res;
};
const isSearch = () => {
	console.log(router.query);
	route.push('/scenic-spot/sold-out-history');
	state.tableData.param.name = router.query.name;
	initList();
};
onMounted(() => {
	if (router.query?.name) {
		isSearch();
	} else {
		initList();
	}
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
