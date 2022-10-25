<template>
	<CommonSearch>
		<search-item label="转账单号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.transferAccountsNo" placeholder="请输入转账单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="行程单号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.teamTypeId" style="width: 180px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="组团社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelId" style="width: 180px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.groupSocietyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 180px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="景区名称" style="width: 280px">
			<a-input v-model:value="state.tableData.param.applicationName" placeholder="请输入景区名称" allowClear style="width: 180px" />
		</search-item>
		<search-item label="转账单位" style="width: 280px">
			<!-- <a-input v-model:value="state.tableData.param.applicationName" placeholder="请选择转账单位" allowClear style="width: 180px" /> -->
			<a-select allowClear ref="select" v-model:value="state.tableData.param.applicationName" style="width: 180px" placeholder="请选择转账单位">
				<a-select-option v-for="(item, index) in 5" :value="item" :key="index">{{ item }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="转账时间" style="width: 280px">
			<a-date-picker v-model:value="state.tableData.param.applicationDate" style="width: 180px" />
		</search-item>
		<search-item label="收款单位" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.applicationName" style="width: 180px" placeholder="请选择收款单位">
				<a-select-option v-for="(item, index) in 5" :value="item" :key="index">{{ item }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="银行流水号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.applicationName" placeholder="请输入银行流水号" allowClear style="width: 180px" />
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success">导出</a-button>
		</div>
	</div>
	<div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%' }">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<!-- <a href="javascript:;" @click="toTrip(record)">查看行程单</a> -->
							<a href="javascript:;" @click="toOrder(record)">查看订单</a>
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
</template>

<script setup lang="ts">
import { watch } from 'vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { settlementOptions } from '@/stores/modules/settlement';
import router from '@/router';
import { any } from 'vue-types';
const options = settlementOptions();
const route = useRouter();
const columns = [
	{
		title: '转账单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '行程单号',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '团队类型',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '组团社',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '地接社',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '游客人数',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '结算时间',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '结算金额(元)',
		dataIndex: 'time',
		key: 'time',
		width: 105
	},
	{
		title: '转账单位',
		dataIndex: 'groupTypeStr',
		key: 'groupTypeStr',
	},
	{
		title: '转账金额(元)',
		dataIndex: 'guides',
		key: 'guides',
		width: 105
	},
	{
		title: '转账账户',
		dataIndex: 'guides',
		key: 'guides',
	},
	{
		title: '转账时间',
		dataIndex: 'guides',
		key: 'guides',
	},
	{
		title: '收款单位',
		dataIndex: 'touristCount',
		key: 'touristCount',
	},
	{
		title: '收款账户',
		dataIndex: 'touristCount',
		key: 'touristCount',
	},
	{
		title: '银行流水号',
		dataIndex: 'touristCount',
		key: 'touristCount',
	},
	{
		title: '操作',
		fixed: 'right',
		key: 'action',
	},
];
const state = reactive({
	tableData: {
		param: {
			applicationDate: null,
			applicationName: null,
			productType: 1,
			pageSize: 10,
			pageNo: 1,
			teamTypeId: null,
			travelId: null,
			subTravelId: null,
			transferAccountsNo: null,
			itineraryNo: null,
			type: null,
		},
		data: [
			{
				name: 123456,
			},
		],
		total: 11,
		loading: false,
	},
});
// 查询
const initList = async () => {
	// state.tableData.loading = true;
	// let res = await api.productRuleList(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// const list: [any] = dealData(content);
	// state.tableData.data = list;
	// state.tableData.loading = false;
};
// 清空筛选项
const initOption = () => {
	state.tableData.param = {
		applicationDate: null,
		applicationName: null,
		productType: 1,
		pageSize: 10,
		pageNo: 1,
		teamTypeId: null,
		travelId: null,
		subTravelId: null,
		transferAccountsNo: null,
		itineraryNo: null,
	};
};
// 根据路由更改不同列表枚举
const typeChange = (val: any) => {
	let type = null;
	switch (val) {
		case '景区行程单结算表':
			type = 1;
			break;
		case '酒店行程单结算表':
			type = 2;
			break;
		case '集团行程单结算表':
			type = 3;
			break;
		case '协会行程单结算表':
			type = 4;
			break;
		case '监理行程单结算表':
			type = 5;
			break;
		case '一卡通行程单结算表':
			type = 6;
			break;
	}
	return type;
};
//搜索
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	initList();
};
// 跳转订单详情
const toOrder = (record: any) => {
	// 保存当前路由name
	let routerName = router.currentRoute.value.matched[1].name;
	// 跳转该路由下的订单列表 自动匹配面包屑
	route.push({
		path: `/reportManagement/${String(routerName)}/orderList`,
	});
};
watch(
	// 监听路由信息
	() => router.currentRoute.value.matched[1].meta.title,
	(val) => {
		// 清除筛选项
		initOption();
		// 更改不同路由所需枚举
		state.tableData.param.type = typeChange(val);
		initList();
	}
);
onMounted(() => {
	// 首次渲染需判断 其它未切换公用文件路由进入监听
	state.tableData.param.type = typeChange(router.currentRoute.value.matched[1].meta.title);
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	initList();
});
</script>
<style scoped lang="less"></style>
