<template>
	<div>
		<h3 class="header">基本信息</h3>
		<div class="body">
			<a-form ref="formRef" :model="formValidate" :rules="rules" :label-col="{ span: 2 }" :wrapper-col="{ span: 8, offset: 1 }" labelAlign="left">
				<a-form-item label="演出票名称" name="username">
					<a-input  disabled placeholder="无需填写"/>
				</a-form-item>
				<a-form-item label="演出节目选择" name="roleIds">
					<a-input  disabled placeholder="无需填写"/>
				</a-form-item>
				<a-form-item label="演出描述" name="account">
					<a-textarea :rows="4" placeholder="请输入内容" :maxlength="6" />
				</a-form-item>
				<a-form-item label="归属景区" name="mobile">
					<a-input  disabled placeholder="无需填写"/>
				</a-form-item>
				<a-form-item label="分区" name="mobile">
					<a-input  disabled placeholder="无需填写"/>
				</a-form-item>
				<a-form-item label="库存" name="mobile">
					<a-input  disabled placeholder="无需填写"/>
				</a-form-item>
				<a-form-item label="价格" name="mobile">
					<a-input  disabled placeholder="无需填写"/>
				</a-form-item>
				<a-form-item label="开始时间" name="mobile">
					<a-input  disabled placeholder="无需填写"/>
				</a-form-item>
				<a-form-item label="结束时间" name="mobile">
					<a-input  disabled placeholder="无需填写"/>
				</a-form-item>
				<div class="footer">
					<div class="tooter-btn">
						<a-button type="primary" @click.prevent="onSubmit">保存</a-button>
						<a-button type="primary" @click="reset">提交审核</a-button>
					</div>
				</div>
			</a-form>
		</div>
		<BaseModal title="审核" v-model="dialogVisible" :onOk="handleOk">
			<div>
				<p class="price">*票价</p>
			</div>
			<CommonTable :dataSource="state.tableDate.data" :columns="columns" :scrollY="false">
				<template #bodyCell="{ column, record, text }">
					<template v-if="column.key === 'partition'">
						{{ record.partition }}
					</template>
					<template v-if="column.key === 'stock'">
						<a-input v-model:value="record.stock" style="width: 150px"  :placeholder="record.stockMax" @change="aa" oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')" />
					</template>
					<template v-if="column.key === 'price'">
						<a-input v-model:value="record.price" style="width: 150px" :placeholder="record.priceMax" />
					</template>
				</template>
			</CommonTable>
			<template v-slot:footer>
				<a-button type="primary" @click="save">保存</a-button>
				<a-button @click="dialogVisible = false">取消</a-button>
			</template>
		</BaseModal>
	</div>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import BaseModal from '@/components/common/BaseModal.vue';
import CommonTable from '@/components/common/CommonTable.vue';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
	roleList: Array,
});
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const formValidate: Ref<Record<string, any>> = ref({});
const options = reactive({ title: '新增用户' });
const rules: any = {
	username: [{ required: true, trigger: 'blur', message: '请输入演出票名称' }],
	mobile: [{ required: true, trigger: 'blur', message: '请选择演出节目' }],
	account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
	roleIds: [{ required: true, trigger: 'blur', message: '请选择归属景区' }],
};
const state = reactive({
	tableDate: {
		data: [
			{
				partition: '普通座',
				stock: '',
				price: '',
				stockMax:'最大2000',
				priceMax:'200元'
			},
			{
				partition: 'VIP座',
				stock: '',
				price: '',
				stockMax:'最大1000',
				priceMax:'200元'
			},
			{
				partition: 'SVIP座',
				stock: '',
				price: '',
				stockMax:'最大500',
				priceMax:'200元'
			},
		],
	},
});
const columns = [
	{
		title: '分区',
		dataIndex: 'partition',
		key: 'partition',
	},
	{
		title: '库存',
		dataIndex: 'stock',
		key: 'stock',
	},
	{
		title: '价格',
		dataIndex: 'price',
		key: 'price',
	},
];
const save=()=>{
	console.log(state.tableDate.data,'111111')
}
const aa=()=>{
	if(Number(state.tableDate.data[0].stock)>2000)
	{
		state.tableDate.data[0].stock='2000'
	}
	if(Number(state.tableDate.data[1].stock)>1000)
	{
		state.tableDate.data[1].stock='1000'
	}
	if(Number(state.tableDate.data[2].stock)>500)
	{
		state.tableDate.data[2].stock='500'
	}
}
const handleOk = async (callback: Function) => {};
const edit = () => {
	dialogVisible.value = true;
};
</script>

<style lang="scss" scoped>
.header {
	margin-left: 30px;
	font-weight: bold;
	margin-top: 10px;
}
.body {
	padding: 10px 20px;
}
.span {
	font-size: 12px;
	margin-left: 20px;
	color: rgb(235, 235, 235);
}
.footer {
	position: fixed;
	bottom: 12px;
	line-height: 64px;
	height: 64px;
	width: calc(100% - 288px);
	border-top: 1px solid #f1f2f5;
	margin-left: -16px;
	margin-right: 24px;
	background-color: #fff;
	z-index: 99;
	.tooter-btn {
		width: 60%;
		margin-left: 16px;
	}
	button:first-of-type {
		margin-right: 16px;
	}
}
.aa {
	width: 100px;
	height: 100px;
	border: 1px solid red;
}
.price{
	margin-left: 20px;
}
</style>
