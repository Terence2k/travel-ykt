<template>
	<a-spin size="large" :spinning="state.tableData.loading" style="min-height: 50vh">
		<CommonSearch>
			<SearchItem label="输入搜索">
				<!-- <a-input v-model:value="state.tableData.itineraryNo" placeholder="请输入行程单号" style="width: 200px" /> -->
				<a-input v-model:value="state.tableData.param.ticketName" placeholder="门票名称/关键词" style="width: 200px" />
			</SearchItem>
			<SearchItem label="上架状态">
				<a-select v-model:value="state.tableData.param.putaway" :allowClear="true" ref="select" style="width: 200px" placeholder="门票名称/关键词">
					<a-select-option label="下架" :value="false">下架</a-select-option>
					<a-select-option label="上架" :value="true">上架</a-select-option>
				</a-select>
			</SearchItem>
			<!-- <SearchItem label="归属景区">
				<a-select
					v-model:value="state.tableData.param.scenicId"
					:allowClear="true"
					ref="select"
					style="width: 200px"
					placeholder="请选择"
					:options="scenicSpotOptions"
				>
				</a-select>
			</SearchItem> -->
			<template #button>
				<a-button @click="reset" style="margin-right: 30px">重置</a-button>
				<a-button @click="search">查询</a-button>
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
							<a href="javascript:;" v-permission="'编辑'" @click="toEditPage(record)">编辑</a>
							<a href="javascript:;" v-permission="'下架'" v-if="record.putaway" @click="outDown(record)">
								{{ !record.putaway ? '上架' : '下架' }}
							</a>
							<a href="javascript:;" v-permission="'联票库存日历'" @click="invetory(record)"> 联票库存日历</a>
							<a href="javascript:;" v-permission="'下架'" v-if="!record.putaway" @click="register(record)"> 上架</a>
							<a href="javascript:;" v-permission="'下架'" v-if="!record.putaway" @click="changeDownTicket(record)"> 下架修改</a>
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
			<Audit ref="auditRef" @down-page="downPage" />
		</div>
		<CalendarInvetory ref="calendarInvetoryRef" />
	</a-spin>
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
import Audit from './components/audit.vue';
import CalendarInvetory from './components/calendarInvetory.vue';
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
	// {
	// 	title: '审核状态',
	// 	dataIndex: 'auditStatus',
	// 	key: 'auditStatus',
	// },
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
interface stateType {
	tableData: {
		data: any[];
		total: number;
		loading: boolean;
		param: {
			pageNo: number;
			pageSize: number;
			ticketName: string;
			putaway: boolean | null;
		};
	};
}
const state = reactive<stateType>({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			ticketName: '',
			putaway: null,
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
const calendarInvetoryRef = ref();
const invetory = (value: any) => {
	calendarInvetoryRef.value.open(value.oid);
};
//编辑
const toEditPage = (value: any) => {
	route.push({ path: '/scenic-spot/multicast/edit', query: { t: 1, o: value.oid } });
};
//下架
const auditRef = ref();
const outDown = (value: any) => {
	auditRef.value.open(value.oid, '', value.ticketName);

	// route.push({ path: '/scenic-spot/multicast/edit' });
};
const changeDownTicket = (value: any) => {
	auditRef.value.open(value.oid, 'edit', value.ticketName);
};

//上架
const register = async (value: any) => {
	await api.resigerScenicTicketDetail(value.oid);
	downPage();
};

const downPage = () => {
	state.tableData.loading = true;
	setTimeout(() => {
		initPage();
	}, 300);
};
//新增
const add = () => {
	route.push({ path: '/scenic-spot/multicast/edit', query: { t: 0 } });
};
const scenicSpotOptions = ref([]);
const initOption = async () => {
	let res = await api.getViewList();
	scenicSpotOptions.value = res.map((item: any) => {
		return {
			value: item.ticketId,
			label: item.ticketName,
		};
	});
};
//重置
const reset = () => {
	state.tableData.param.ticketName = '';
	state.tableData.param.putaway = null;
	state.tableData.param.pageNo = 1;
	search();
};
const search = () => {
	state.tableData.param.pageNo = 1;
	initPage();
};

const initPage = async () => {
	state.tableData.loading = true;
	let res = await api.getMultipleList(state.tableData.param);
	state.tableData.data = res.content || dataSource;
	state.tableData.total = res.total;
	console.log('res', res);
	state.tableData.loading = false;
};

onMounted(() => {
	initPage();
	initOption();
	// navigatorBar
	// 重新定义面包屑
	// navigatorBar.clearNavigator();
	// navigatorBar.setNavigator(['演出票']);
});

onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style scoped lang="less"></style>
