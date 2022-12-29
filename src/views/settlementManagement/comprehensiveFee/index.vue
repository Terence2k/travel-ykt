<template>
	<CommonSearch>
		<search-item label="综费产品">
			<a-input v-model:value="state.tableData.param.comprehensiveFeeProductName" placeholder="请输入费用名称" />
		</search-item>
		<search-item label="启用状态">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.status" style="width: 200px" placeholder="请选择状态">
				<a-select-option :value="1">启用</a-select-option>
				<a-select-option :value="0">禁用 </a-select-option>
			</a-select>
		</search-item>
		<template #button>
			<a-button @click="initList" v-permission="'查询'">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="toAdd" v-permission="'新增'">新增</a-button>
			<a-button style="margin-left: 8px" @click="del" v-permission="'删除'">删除</a-button>
		</div>
	</div>
	<div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :scroll="{ x: '100%',y: '100%' }" :columns="columns" rowKey="oid" :row-selection="rowSelection" >
				<template #bodyCell="{ column, record }">
					<!-- 费用归属 -->
					<template v-if="column.key === 'belongCompany'">
						<span>{{ getBelongCompanyName(record.belongCompany) }}</span>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toCheck(record)" v-permission="'查看'">查看</a>
							<a href="javascript:;" @click="toEditPage(record)" v-permission="'编辑'">编辑</a>
							<a href="javascript:;" @click="toDisable(record)" v-if="record?.status === 0" v-permission="'启用'">启用</a>
							<a href="javascript:;" @click="toDisable(record)" v-if="record?.status !== 0" v-permission="'禁用'">禁用</a>
							<a href="javascript:;" @click="toDelete(record)" v-permission="'删除'">删除</a>
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
	<DelModal :params="modalData.params" v-model="modalData.show" @submit="tipSubmit" @cancel="tipCancel" />
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { message } from 'ant-design-vue';
import api from '@/api';
import DelModal from '@/components/common/DelModal.vue';
import { settlementOptions } from '@/stores/modules/settlement';
const navigatorBar = useNavigatorBar();
const route = useRouter();
const useOptions = settlementOptions();
const initOption = async () => {
	await useOptions.getBusinessTypeOptionList();
};
import { accDiv } from '@/utils/compute';

// 计算属性 匹配费用归属企业类型
const getBelongCompanyName = computed(() => (value: any) => {
	if (useOptions.businessTypeOptionList) {
		const idx = useOptions.businessTypeOptionList.findIndex((item) => item.codeValue === value);
		if (idx !== -1) {
			return useOptions.businessTypeOptionList[idx]['name'];
		}
		return '';
	}
	return ''
})
const columns = [
	{
		title: '综费产品',
		dataIndex: 'comprehensiveFeeProductName',
		key: 'comprehensiveFeeProductName',
	},
	{
		title: '费用归属',
		dataIndex: 'belongCompany',
		key: 'belongCompany',
	},
	{
		title: '费用说明',
		dataIndex: 'feeExplanation',
		key: 'feeExplanation',
	},
	{
		title: '收费金额',
		dataIndex: 'feeText',
		key: 'feeText',
	},
	{
		title: '是否按天收费',
		dataIndex: 'confirmDailyChargeName',
		key: 'confirmDailyChargeName',
	},
	{
		title: '状态',
		dataIndex: 'statusName',
		key: 'statusName',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];
const modalData = ref({
	show: false,
	params: {},
	data: {}, // 传参对象
	type: '',
	status: 0,
	
});
// 缓存编辑表格模态框数据
const transferData = ref({
	show: false,
	modalParams: {},
});
const tipSubmit = async () => {
	// 删除
	if (modalData.value.type == 'delete') {
		api.comprehensiveFeeDelete(modalData.value.data).then((res: any) => {
			message.success('删除成功');
			initList();
		})
		.catch((err: any) => {
			message.error(err || '删除失败');
		});
		tipCancel();
	}
	// 禁用 启用
	if (modalData.value.type == 'disable') {
		let statusText = modalData.value.status === 0 ? '启用' : '禁用';
		let apiFun = modalData.value.status === 0 ? api.comprehensiveFeeEnable : api.comprehensiveFeeDisenable;
		apiFun(modalData.value.data)
			.then((res: any) => {
				message.success(`${statusText}成功`);
				initList();
			})
			.catch((err: any) => {
				message.error(err || `${statusText}失败`);
			});
		tipCancel();
	}
};
const tipCancel = () => {
	modalData.value.data = {};
	modalData.value.type = '';
	modalData.value.show = false;
};
const state = reactive({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			comprehensiveFeeProductName: null, //综费产品名称
			status: null, //启用状态：0-启用  1-禁用
		},
	},
	selectedRowKeys: [], //当前选择的标识
});

// 当前选择列
const rowSelection = computed(() => {
	return {
		onChange: (selectedRowKeys: [], selectedRows: any) => {
			state.selectedRowKeys = selectedRowKeys;
			console.log(state.selectedRowKeys);
		},
	}
})
const onSelect = (selectedRowKeys: [],record: any, selected: boolean, selectedRows: any[]) => {
		console.log(selectedRowKeys);
	}
// 新增按钮
const toAdd = () => {
	route.push({ path: '/settlementManagement/comprehensiveFee/edit' });
	// route.push({ path: '/settlementManagement/comprehensiveFee/add' });
};
// 批量删除按钮
const del = () => {
	if (state.selectedRowKeys.length == 0) {
		message.warn('请先选择删除项');
		return;
	}
	deleteFun(state.selectedRowKeys);
};
//搜索
const onHandleCurrentChange = (val: number) => {
	if(typeof val == 'number') {
		state.tableData.param.pageNo = val;
		initList();
	}
};
//翻页
const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	initList();
};
//编辑
const toEditPage = (record: any) => {
	route.push({ path: '/settlementManagement/comprehensiveFee/edit', query: { edit: 1, oid: encodeURIComponent(record.oid) } });
};
//禁用 & 启用 (启用状态：1-启用  0-禁用)
const toDisable = (record: any) => {
	let statusText = record.status === 0 ? '启用' : '禁用';
	modalData.value.params = { title: statusText, content: `确定是否${statusText}` }
	modalData.value.type = 'disable'
	modalData.value.data = record.oid
	modalData.value.show = true,
	modalData.value.status = record.status
};
//单项删除
const toDelete = (record: any) => {
	deleteFun([record.oid]);
};
// 统一删除方法
const deleteFun = (id: any) => {
	modalData.value.params = { title: '删除确认', content: '是否确定删除所选数据，删除会影响已支付本项费用的行程单结算' }
	modalData.value.type = 'delete'
	modalData.value.data = id
	modalData.value.show = true
};
//查看
const toCheck = (record: any) => {
	route.push({ path: '/settlementManagement/comprehensiveFee/info', query: { oid: encodeURIComponent(record.oid) } });
};
// 初始化列表
const initList = async () => {
	state.tableData.loading = true;
	api
		.getcomprehensiveFeeList(state.tableData.param)
		.then((res) => {
			console.log(res);
			const { total, content } = res;
			state.tableData.total = total;
			const list: [any] = dealData(content);
			state.tableData.data = list;
			state.tableData.loading = false;
		})
		.catch((err) => {
			state.tableData.loading = false;
		});
		
};
// 数据处理
const dealData = (params: [any]) => {
	params.map((i: any) => {
		// feeModel 收费模式: 0-人数 1-价格
		// feeNumber 收费数量
		i.feeText = i.feeModel == 0 ? `${accDiv(i.feeNumber, 100)} 元/人` : `${accDiv(i.feeNumber, 100)} 元`;	
		return i;
	});

	return params;
};
onMounted(() => {
	initOption();
	initList();
	navigatorBar.setNavigator(['结算管理', '综费产品']);
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
