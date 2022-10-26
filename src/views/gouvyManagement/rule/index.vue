<template>
	<div class="table-area">
		<p class="top-p">基本信息设置</p>
		<a-form ref="formRef" :rules="rules" model="formValidate.data" :label-col="{ span: 2}" :wrapper-col="{ flex: 12 }" labelAlign="left">
			<a-form-item label="购买价格" name="price">
				<a-input v-model:value="state.tableData.data.price" placeholder="请输入缴纳费用价格（单位，元）" style="width:600px"></a-input>
			</a-form-item>
			<a-form-item label="政策说明" name="price">
				<a-textarea v-model:value="state.tableData.data.policyExplain" placeholder="请输入古维政策说明" :rows="4" style="width:600px" />
			</a-form-item>
			<a-row>
				<a-col :span="12"></a-col>
				<a-col :span="10"></a-col>
				<a-col :span="2"> <a-button type="primary" @click="save">保存</a-button></a-col>
			</a-row>
		</a-form>
		<p class="top-p">减免规则</p>
		<a-row>
			<a-col :span="12"></a-col>
			<a-col :span="10"></a-col>
			<a-col :span="2"> <a-button type="primary" class="btn" @click="add({ handle: 'add' })">添加</a-button></a-col>
		</a-row>
		<CommonTable :dataSource="state.tableData.data" :columns="columns">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'status'">
					<a-span v-if="record.status == 1">启用</a-span>
					<a-span v-else>禁用</a-span>
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="add({ row: record, handle: 'update' })">编辑</a>
						<a href="javascript:;" @click="disable" v-if="record.status == 1">禁用</a>
						<a href="javascript:;" @click="enable" v-else>启用</a>
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import Edit from './edit.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
const route = useRouter();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const columns = [
	{
		title: '规则名称',
		dataIndex: 'ruleName',
		key: 'ruleName',
	},
	{
		title: '减免模式',
		dataIndex: 'discountType',
		key: 'discountType',
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
		dataIndex: 'status',
		key: 'status',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		widthmin: 350,
	},
];
const rules: any = {
	price: [{ required: true, trigger: 'blur', message: '请输入价格' }],
	policyExplain: [{ required: true, trigger: 'blur', message: '请输入古维政策说明' }],
};
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
	params: {},
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
const cancel = () => {
	dialogVisible.value = false;
};
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
};
const add = (param: any) => {
	const { row, handle } = param;
	state.params = {};
	if (handle === 'update') {
		state.params = row;
	}
	state.operationModal.isEditdate = true;
};
const disable = () => {
	message.error('已禁用');
};
const enable = () => {
	message.success('已启用');
};
const save = () => {
	console.log(state.tableData.data, '111111111111111');
	message.success('保存成功');
};
const onSearch = () => {
	api.getBasicInfo().then((res) => {
		console.log(res, '111111111111');
	});
};

onMounted(() => {
	onSearch();
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
