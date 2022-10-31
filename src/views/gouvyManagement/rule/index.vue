<template>
	<div class="table-area">
		<p class="top-p">基本信息设置</p>
		<a-form ref="formRef" :rules="rules" :model="state.tableData.infoData" :label-col="{ span: 2 }" :wrapper-col="{ flex: 12 }" labelAlign="left">
			<a-form-item label="购买价格" name="price">
				<a-input v-model:value="state.tableData.infoData.price" placeholder="请输入缴纳费用价格（单位，元）" style="width: 600px"></a-input>
			</a-form-item>
			<a-form-item label="政策说明" name="policyExplain">
				<a-textarea v-model:value="state.tableData.infoData.policyExplain" placeholder="请输入古维政策说明" :rows="4" style="width: 600px" />
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
		<CommonTable :dataSource="state.tableData.Data" :columns="columns">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'discount'">
					<a-span>{{ accDiv(record.discount, 100) }}</a-span>
				</template>
				<template v-if="column.key === 'discountRuleStatus'">
					<a-span v-if="record.discountRuleStatus == 1">启用</a-span>
					<a-span v-else>禁用</a-span>
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="add({ row: record, handle: 'update' })">编辑</a>
						<a href="javascript:;" @click="disable(record.oid)" v-if="record.discountRuleStatus == 1">禁用</a>
						<a href="javascript:;" @click="enable(record.oid)" v-else>启用</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<!-- <CommonPagination
			:current="state.tableData.param.pageNo"
			:page-size="state.tableData.param.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/> -->
	</div>
	<Edit v-model="state.operationModal.isEditdate" :params="state.params" @onSearchList="onSearchList"></Edit>
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
import { accDiv,accMul} from '@/utils/compute';
const formRef = ref<FormInstance>();
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
		dataIndex: 'discountTypeName',
		key: 'discountTypeName',
	},
	{
		title: '可减免条件',
		dataIndex: 'discountConditionName',
		key: 'discountConditionName',
	},
	{
		title: '减免折扣',
		dataIndex: 'discount',
		key: 'discount',
	},
	{
		title: '状态',
		dataIndex: 'discountRuleStatus',
		key: 'discountRuleStatus',
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
		infoData: [],
		Data: [],
		total:'',
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
// const onHandleCurrentChange = (val: number) => {
// 	console.log('change:', val);
// 	state.tableData.param.pageNo = val;
// 	onSearchList();
// };
const auditRef = ref();
const cancel = () => {
	dialogVisible.value = false;
};
// const pageSideChange = (current: number, size: number) => {
// 	console.log('changePageSize:', size);
// 	state.tableData.param.pageSize = size;
// 	onSearchList();
// };
const add = (param: any) => {
	const { row, handle } = param;
	state.params = {};
	if (handle === 'update') {
		state.params = row;
	}
	state.operationModal.isEditdate = true;
};
const enable = (value: any) => {
	api.getEnable(value).then(() => {
		message.success('已启用');
		onSearchList()
	});
};
const disable = (value: any) => {
	api.getDisenable(value).then(() => {
		message.success('已禁用');
		onSearchList()
	});
};
const save = () => {
	formRef.value
		.validateFields()
		.then((i) => {
			let data ={
				oid:state.tableData.infoData.oid,
				price:accMul(Number(state.tableData.infoData.price),100),
				policyExplain:state.tableData.infoData.policyExplain
			}
			api.getBasicEdit(data).then(() => {
					message.success('编辑成功');
					onSearch();
				});
		})
		.catch((info: any) => {
			console.log('Validate Failed:', info);
		});
	// message.success('保存成功');
};
const onSearch = () => {
	api.getBasicInfo().then((res) => {
		state.tableData.infoData = res;
		state.tableData.infoData.price = accDiv(res.price, 100);
	});
};
const onSearchList = () => {
	api.getBasiclist().then((res) => {
		state.tableData.Data = res;
		console.log(res,'1233')
	});
};
onMounted(() => {
	onSearch();
	onSearchList();
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
