<template>
	<div class="editWrapper">
		<header>基本信息</header>
		<a-form class="" ref="formRef" :label-col="{ span: 4 }" labelAlign="left" :wrapper-col="{ span: 6 }" :scrollToFirstError="true">
			<a-form-item label="企业名称" v-bind="validateInfos[`data.name`]">
				<!-- <a-input v-model:value="formData.data.name" placeholder="请填写景区名字" /> -->
				{{ formData.data.name }}
			</a-form-item>
			<a-form-item label="企业类型" v-bind="validateInfos[`data.businessType`]">
				<!-- <a-select allowClear v-model:value="formData.data.businessType" :options="options" placeholder="请选择景区名字"></a-select> -->
				{{ formData.data.businessType }}
			</a-form-item>
			<a-form-item label="景区等级" v-bind="validateInfos[`data.scenicLevel`]">
				{{ formData.data.scenicLevel }}
				<!-- <a-select allowClear v-model:value="formData.data.scenicLevel" :options="options" placeholder="请选择景区名字"></a-select> -->
			</a-form-item>
			<a-form-item label="所属地区" class="area" v-bind="errorInfos" :wrapper-col="{ span: 14 }">
				{{ formData.data.provinceId }}
				{{ formData.data.cityId }}
				{{ formData.data.areaId }}
				{{ formData.data.addressDetail }}
				<!-- <a-select allowClear v-model:value="formData.data.provinceId" :options="options" placeholder="请选择景区名字" style="width: 100px"></a-select>
				&nbsp;
				<a-select allowClear v-model:value="formData.data.cityId" :options="options" placeholder="请选择景区名字" style="width: 100px"></a-select>
				&nbsp;
				<a-select allowClear v-model:value="formData.data.areaId" :options="options" placeholder="请选择景区名字" style="width: 100px"></a-select>
				&nbsp;
				<a-input v-model:value="formData.data.addressDetail" placeholder="请输入详细地址" style="width: 150px" /> -->
			</a-form-item>
			<a-form-item label="统一社会信用代码" v-bind="validateInfos[`data.creditCode`]">
				<!-- <a-input v-model:value="formData.data.creditCode" /> -->
				{{ formData.data.creditCode }}
			</a-form-item>
			<a-form-item label="营业执照" v-bind="validateInfos[`data.businessLicenseUrl`]">
				<!-- <a-input v-model:value="formData.data.businessLicenseUrl" /> -->
				{{ formData.data.businessLicenseUrl }}
			</a-form-item>
			<a-form-item label="联系人姓名" v-bind="validateInfos[`data.contactName`]">
				<!-- <a-input v-model:value="formData.data.contactName" /> -->
				{{ formData.data.contactName }}
			</a-form-item>
			<a-form-item label="联系人电话" v-bind="validateInfos[`data.phone`]">
				<!-- <a-input v-model:value="formData.data.phone" /> -->
				{{ formData.data.phone }}
			</a-form-item>
			<a-form-item label="企业状态" v-bind="validateInfos[`data.unitStatus`]">
				{{ formData.data.unitStatus ? '开业' : '停业' }}
			</a-form-item>

			<div class="title">减免属性</div>
			<a-form-item label="是否支持减免" v-bind="validateInfos[`data.derate`]">
				{{ formData.data.derate ? '是' : '否' }}
			</a-form-item>
			<a-form-item label="减免规则" v-bind="validateInfos[`data.derateRule`]" v-show="formData.data.derate">
				{{ formData.data.derateRule }}
				{{ '满' + formData.data.derateRule?.split(',')[0] + '减' + formData.data.derateRule?.split(',')[1] }}
				<!-- <a-input
					:disabled="formData.data.derate ? false : true"
					v-model:value="formData.data.derateRule"
					placeholder="减免规则详情，逗号隔开满16-9 ：16,9"
				/> -->
			</a-form-item>
			<div class="title">结算（收款）账户信息</div>
			<a-form-item label="账户类型" v-bind="validateInfos[`data.accountType`]">
				{{ formData.data.accountType }}
				<!-- <a-select allowClear v-model:value="formData.data.accountType" :options="options" placeholder="请选择账户类型"></a-select> -->
			</a-form-item>
			<a-form-item label="收款账号" v-bind="validateInfos[`data.bankAccount`]">
				{{ formData.data.bankAccount }}
				<!-- <a-input v-model:value="formData.data.bankAccount" placeholder="银行账号" /> -->
			</a-form-item>
			<a-form-item label="账户名" v-bind="validateInfos[`data.bankAccountName`]">
				{{ formData.data.bankAccountName }}
				<!-- <a-input v-model:value="formData.data.bankAccountName" /> -->
			</a-form-item>
			<a-form-item label="开户行地址" v-bind="validateInfos[`data.accountAddress`]">
				{{ formData.data.accountAddress }}
				<!-- <a-input v-model:value="formData.data.accountAddress" /> -->
			</a-form-item>
			<a-form-item label="还款行" v-bind="validateInfos[`data.bank`]">
				{{ formData.data.bank }}
				<!-- <a-input v-model:value="formData.data.bank" /> -->
			</a-form-item>

			<footer>
				<a-button type="primary" htmlType="{submit}" @click.prevent="onSubmit">编辑</a-button>
			</footer>
			<!-- <a-form-item :wrapper-col="{ span: 14, offset: 4 }"> </a-form-item> -->
		</a-form>
	</div>
</template>

<script setup lang="ts">
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { Form } from 'ant-design-vue';
import { RadioGroupProps } from 'ant-design-vue';
import { toArray } from 'lodash-es';
import api from '@/api';
const route = useRouter();

const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
// 下拉选择
const popupScroll = () => {
	console.log('popupScroll');
};
const options = [];
// 数据
const formData = reactive({
	data: {
		oid: 1, //oid

		name: '测试景点编辑', //景区名称
		scenicLevel: 1, //景区等级(字典序号)

		creditCode: 'abc123', //统一社会行用代码
		phone: '18756235566', //手机号
		contactName: '张三', //联系人姓名
		provinceId: 1, //省id
		cityId: 2, //市id
		areaId: 3, //县区id
		addressDetail: '昆明市官渡区', //详细地址
		businessLicenseUrl: '/jpg/img.jpg', //营业执照图片地址

		derate: true, //是否支持减免: true支持，false不支持
		derateRule: '16,9', //减免规则详情，逗号隔开满16-9 ：16,9

		accountType: 1, //账户类型，具体类型未确定
		bankAccount: 12312124124, //银行账号
		accountAddress: '广东省', //开户地址
		businessType: 117, //企业业态（注册时，根据字典配置，景区、酒店、旅行社等）
		bankAccountName: 'zhangdawei', //银行账户名
		unitStatus: true, //企业状态 true-开业 false-停业

		bank: null, //收款行
		managementRange: null, //经营范围
		legalPerson: null, //法人
		establishTime: null, //成立时间
		registeredCapital: null, //注册资本（单位：万）
		// name: '',
		// scenicLevel: '',

		// creditCode: '',
		// phone: '',
		// contactName: '',
		// provinceId: '',
		// cityId: '',
		// areaId: '',
		// addressDetail: '',
		// businessLicenseUrl: '',
		// derate: '',
		// derateRule: '',
		// accountType: '',
		// bankAccount: '',
		// accountAddress: '',
		// businessType: '',
		// bankAccountName: '',
		// unitStatus: '',
		// bank: '',
		// managementRange: '',
		// legalPerson: '',
		// establishTime: '',
		// registeredCapital: '',
	},
});
// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(formData);
// 提交
const onSubmit = async () => {
	route.push({ path: '/scenic-spot/information/edit', query: { oid: encodeURIComponent(formData.data.oid) } });
};

//初始化页面
const initPage = async (): Promise<void> => {
	formData.data.oid = route.currentRoute.value?.query?.oid;
	let res = await api.getScenicById(formData.data.oid);
	console.log(res, 'res');
	formData.data = res;
	formData.data.oid = route.currentRoute.value?.query?.oid;
};

// 自定义面包屑
onMounted(() => {
	initPage();
	navigatorBar.setNavigator(['基础信息管理']);
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
.area {
	margin-bottom: 20px;
}
footer {
	border-top: 1px solid #f1f2f5;
	padding: 16px;
	margin: -16px;
}
</style>
