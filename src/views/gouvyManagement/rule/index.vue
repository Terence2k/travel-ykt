<template>
	<div class="table-area">
		<p class="top-p">古维费规则配置</p>
		<a-form ref="formRef" :rules="formRules" model="formValidate.data" :label-col="{ span: 4 }" :wrapper-col="{ flex: 12 }" labelAlign="left">
			<a-row>
				<a-col :span="2" class="span-buy">购买后可生效时间</a-col>
				<a-col :span="8"><a-input placeholder="请输入购买生效时间（单位，天）"></a-input></a-col>
			</a-row>
			<a-row class="top">
				<a-col :span="2" class="span-title">政策说明</a-col>
				<a-col :span="8"><a-textarea placeholder="请输入古维政策说明" :rows="4" /></a-col>
			</a-row>
			<a-row>
				<a-col :span="12"></a-col>
				<a-col :span="10"></a-col>
				<a-col :span="2"> <a-button type="primary">保存</a-button></a-col>
			</a-row>
		</a-form>
		<p class="top-p">减免规则</p>
		<a-row>
			<a-col :span="12"></a-col>
			<a-col :span="10"></a-col>
			<a-col :span="2"> <a-button type="primary" class="btn" @click="add({handle: 'add'})">添加</a-button></a-col>
		</a-row>
		<CommonTable :dataSource="dataSource" :columns="columns">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="add({  row: record,  handle: 'update'})">编辑</a>
						<a href="javascript:;">禁用</a>
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
	<Edit v-model="state.operationModal.isEditdate" :params="state.params"></Edit>
</template>

<script setup lang="ts">
import { ref,reactive} from 'vue';
import { useRouter } from 'vue-router'
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import Edit from './edit.vue';
const route = useRouter();
const dialogVisible = ref(false);
const value = ref<string>('1');
const value2 = ref<string>('1');
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const dataSource = [
	{
		key: '1',
		name: '1',
		age: '军人减免规则',
		address: '特殊证件',
		address2: '军官证、士官证',
		address3: '0.5',
		address4: '启用',
	},
];
const columns = [
	{
		title: '规则名称',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '减免模式',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '详细信息',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '减免折扣',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '状态',
		dataIndex: 'address4',
		key: 'address4',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		widthmin: 350,
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
		},
		status: '1',
		pattern: '1',
	},
	params:{},
	operationModal: {
		isEditdate: false,
	},
});
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	onSearch();
};
const auditRef = ref();
const cancel=()=>{
    dialogVisible.value=false
}
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
};
const add = (param: any) => {
	const {row,  handle}=param
	state.params={};
	if(handle==='update')
	{
		state.params=row
	}
	state.operationModal.isEditdate = true;
};
const onSearch = () => {
	// userList(state.tableData.param).then((res) => {
	// 	console.log(res);
	// });
};
onMounted(() => {
	// navigatorBar
	// 重新定义面包屑
	// navigatorBar.clearNavigator();
	// navigatorBar.setNavigator(['演出票']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less" scoped>
.top {
	margin-top: 20px;
}
.span-title {
	font-size: 13px;
	text-align: center;
}
.top-p {
	padding: 10px 5px;
	color: rgb(215, 215, 215);
	border-bottom: 1px solid rgb(215, 215, 215);
}
.span-buy {
	font-size: 13px;
	text-align: center;
}
.btn {
	margin-bottom: 20px;
}
.input {
	margin-left: -6px;
	width: 100px;
}
.d-span {
	margin-left: 20px;
	line-height: 32px;
}
.select {
	margin-left: -6px;
	width: 367px;
}
</style>
