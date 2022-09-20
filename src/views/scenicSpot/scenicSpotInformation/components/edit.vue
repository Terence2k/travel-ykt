<template>
	<div class="editWrapper">
		<header>基本信息</header>
		<a-form class="" :label-col="{ span: 3 }" labelAlign="left" :wrapper-col="{ span: 6 }">
			<a-form-item label="景区名称" v-bind="validateInfos['sub.name']">
				<a-select allowClear v-model:value="modelRef.sub.name" :options="options" placeholder="请选择景区名字"></a-select>
			</a-form-item>
			<a-form-item label="景区类型" v-bind="validateInfos['sub.name']">
				<a-select allowClear v-model:value="modelRef.sub.name" :options="options" placeholder="请选择景区名字"></a-select>
			</a-form-item>
			<a-form-item label="景区等级" v-bind="validateInfos['sub.name']">
				<a-select allowClear v-model:value="modelRef.sub.name" :options="options" placeholder="请选择景区名字"></a-select>
			</a-form-item>
			<a-form-item label="所属地区" v-bind="validateInfos['sub.name']" :wrapper-col="{ span: 9 }">
				<a-select allowClear v-model:value="modelRef.sub.name" :options="options" placeholder="请选择景区名字" style="width: 100px"></a-select>
				&nbsp;
				<a-select allowClear v-model:value="modelRef.sub.name" :options="options" placeholder="请选择景区名字" style="width: 100px"></a-select>
				&nbsp;
				<a-select allowClear v-model:value="modelRef.sub.name" :options="options" placeholder="请选择景区名字" style="width: 100px"></a-select>
				&nbsp;
				<a-input v-model:value="modelRef.sub.name" placeholder="请输入详细地址" style="width: 150px" />
			</a-form-item>
			<a-form-item label="统一社会信用代码" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>
			<a-form-item label="营业执照" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>
			<a-form-item label="联系人姓名" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>
			<a-form-item label="联系人电话" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>
			<a-form-item label="企业状态" v-bind="validateInfos['sub.name']">
				<a-radio-group v-model:value="modelRef.data.countType">
					<a-radio :value="1">开通</a-radio>
					<a-radio :value="2">关闭</a-radio>
				</a-radio-group>
			</a-form-item>

			<div class="title">减免属性</div>
			<a-form-item label="企业状态" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>
			<a-form-item label="减免规则" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>
			<div class="title">结算（收款）账户信息</div>
			<a-form-item label="账户类型" v-bind="validateInfos['sub.name']">
				<a-radio-group v-model:value="modelRef.data.countType">
					<a-radio :value="1">开通</a-radio>
					<a-radio :value="2">关闭</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="收款账号" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>
			<a-form-item label="账户名" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>
			<a-form-item label="开户行地址" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>
			<a-form-item label="还款行" v-bind="validateInfos['sub.name']">
				<a-input v-model:value="modelRef.sub.name" />
			</a-form-item>

			<footer>
				<a-button type="primary" @click.prevent="onSubmit">保存</a-button>
				<a-button style="margin-left: 10px" @click="reset">提交审核</a-button>
			</footer>
			<!-- <a-form-item :wrapper-col="{ span: 14, offset: 4 }"> </a-form-item> -->
		</a-form>
	</div>
</template>

<script setup lang="ts">
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { Form } from 'ant-design-vue';
import { RadioGroupProps } from 'ant-design-vue';

const plainOptions = ['Apple', 'Pear', 'Orange'];
const options = [
	{ label: 'Apple', value: 'Apple' },
	{ label: 'Pear', value: 'Pear' },
	{ label: 'Orange', value: 'Orange' },
];
const optionsWithDisabled: RadioGroupProps['options'] = [
	{ label: '开通', value: 'open' },
	{ label: '关闭', value: 'close' },
	// { label: '其他', value: 'other', disabled: true },
];
const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
// 下拉选择
const popupScroll = () => {
	console.log('popupScroll');
};

// 数据
const modelRef = reactive({
	name: '',
	sub: {
		name: '',
	},
	data: {
		countType: 'open',
	},
});
// 表单
const { resetFields, validate, validateInfos } = useForm(
	modelRef,
	reactive({
		name: [
			{
				required: true,
				message: 'Please input name',
			},
		],
		'sub.name': [
			{
				required: true,
				message: 'Please input sub name',
			},
		],
	})
);
// 提交
const onSubmit = () => {
	validate()
		.then((res) => {
			console.log(res, toRaw(modelRef));
		})
		.catch((err) => {
			console.log('error', err);
		});
};
// 重置
const reset = () => {
	resetFields();
};

// 自定义面包屑
onMounted(() => {
	navigatorBar.setNavigator(['景区信息管理', '编辑']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="scss" scoped>
.editWrapper {
	padding: 0 16px;
}
header {
	// width: 64px;
	// margin-bottom: 8px;
	height: 56px;
	line-height: 56px;
	font-weight: bold;
	color: #1e2226;
	// margin: 0 8px 16px;
	margin-bottom: 16px;
	border-bottom: 1px solid #f1f2f5;
}
.title {
	height: 56px;
	line-height: 56px;
	font-weight: bold;
	color: #1e2226;
	// margin: 0 8px 16px;
	margin-bottom: 16px;
	border-bottom: 1px solid #f1f2f5;
}
footer {
	border-top: 1px solid #f1f2f5;
	padding: 16px;
	margin: -16px;
}
</style>
