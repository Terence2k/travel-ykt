<template>
	<CommonSearch>
		<search-item label="行程单号">
			<a-input v-model:value="state.tableData.param.feeName" placeholder="请输入费用名称" allowClear style="width: 180px" />
		</search-item>
        <search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.teamTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item,index) in options.teamTypesLists" :value="item.oid" :key=index>{{ item.name }}
				</a-select-option>
			</a-select>
		</search-item>
        <search-item label="组团社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item,index) in options.groupSocietyList" :value="item.travelAgencyId" :key=index>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item,index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key=index>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="发团时间">
			<a-date-picker 
                v-model:value="state.tableData.param.date1" 
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm" 
                value-format="YYYY-MM-DD HH:mm:ss" 
                style="width: 180px" 
            />
		</search-item>
	    <search-item label="散团时间">
			<a-date-picker 
                v-model:value="state.tableData.param.date2" 
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm" 
                value-format="YYYY-MM-DD HH:mm:ss" 
                style="width: 180px" 
            />
		</search-item>
        <search-item label="结算时间">
			<a-date-picker 
                v-model:value="state.tableData.param.date3" 
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm" 
                value-format="YYYY-MM-DD HH:mm:ss" 
                style="width: 180px" 
            />
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
            <CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x:4000,y:'100%'}">
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'action'">
                        <div class="action-btns">
                            <a href="javascript:;" @click="toDetail(record)">结算详情</a>
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
import CommonSearch from '@/components/common/CommonSearch.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import api from '@/api';
import type { TableColumnsType } from 'ant-design-vue';
import { settlementOptions } from '@/stores/modules/settlement';
const options = settlementOptions();
const route = useRouter();
const columns: TableColumnsType = [
  {
		title: '行程单号',
		dataIndex: 'comprehensiveFeeProductName',
		key: 'comprehensiveFeeProductName',
	},
	{
		title: '团队类型',
		dataIndex: 'belongCompanyName',
		key: 'belongCompanyName',
	},
	{
		title: '组团社',
		dataIndex: 'feeExplanation',
		key: 'feeExplanation',
	},
	{
		title: '地接社',
		dataIndex: 'feeText',
		key: 'feeText',
	},
	{
		title: '发团时间',
		dataIndex: 'confirmDailyChargeName',
		key: 'confirmDailyChargeName',
	},
	{
		title: '散团时间',
		dataIndex: 'statusName',
		key: 'statusName',
	},
    {
		title: '游客人数',
		dataIndex: 'statusName',
		key: 'statusName',
	},
    {
		title: '结算时间',
		dataIndex: 'statusName',
		key: 'statusName',
	},
    {
		title: '行程总费用(元)',
		dataIndex: 'statusName',
		key: 'statusName',
	},
    {
		title: '核销总费用(元)',
		dataIndex: 'statusName',
		key: 'statusName',
	},
    {
		title: '未消费总费用(元)',
		dataIndex: 'statusName',
		key: 'statusName',
	},
    {
        title: '古维费用',
        children: [
            {
                title: '小计(元)',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
            },
            {
                title: '扣除费用(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '实收(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
        ],
    },
    {
        title: '酒店费用',
        children: [
            {
                title: '未消费费用(元)',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
            },
            {
                title: '核销金额(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '扣除费用(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '实收(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
        ],
    },
    {
        title: '餐饮费用',
        children: [
            {
                title: '未消费费用(元)',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
            },
            {
                title: '核销金额(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '扣除费用(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '实收(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
        ],
    },
    {
        title: '景区费用',
        children: [
            {
                title: '未消费费用(元)',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
            },
            {
                title: '核销金额(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '扣除费用(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '实收(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
        ],
    },
    {
        title: '导服费',
        children: [
            {
                title: '小计(元)',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
            },
            {
                title: '扣除费用(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '实收(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
        ],
    },
    {
        title: '标餐费',
        children: [
            {
                title: '小计(元)',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
            },
            {
                title: '扣除费用(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '实收(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
        ],
    },
    {
        title: '监理费',
        children: [
            {
                title: '小计(元)',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
            },
            {
                title: '扣除费用(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '实收(元)',
                dataIndex: 'companyName',
                key: 'companyName',
            },
        ],
    },
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];
const data = [...Array(100)].map((_, i) => ({
  key: i,
  name: 'John Brown',
  age: i + 1,
  street: 'Lake Park',
  building: 'C',
  number: 2035,
  companyAddress: 'Lake Street 42',
  companyName: 'SoftLake Co',
  gender: 'M',
}));
const state = reactive({
	tableData: {
		param: {
			feeName: '',
            teamTypeId: null,
            travelId: null,
            subTravelId: null,
            date1: "",
            date2: "",
            date3: "",
			pageSize: 10,
			pageNo: 1,
		},
		data: [
			{
				name: 123456,
			},
		],
		total: 20,
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
// 跳转详情
const toDetail = (record: any) => {
	// route.push({
	// 	path: '/reportManagement/scenicSpotTransferReport/tripList',
	// });
};
onMounted(() => {
    options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
})
</script>
<style scoped lang="less">
::v-deep(.ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td){
    padding: 16px 0;
}
::v-deep(.ant-table-thead > tr > th) {
    text-align: center;
}
::v-deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0 !important;
}
</style>
