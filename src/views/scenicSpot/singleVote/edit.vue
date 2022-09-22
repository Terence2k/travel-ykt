<template>
	<div class="editWrapper">
		<header>基本信息</header>
		<a-form class="" ref="formRef" :label-col="{ span: 3 }" labelAlign="left" :wrapper-col="{ span: 6 }" :scrollToFirstError="true">
			<a-form-item label="企业名称" v-bind="validateInfos[`data.name`]">
				<a-input v-model:value="formData.data.name" placeholder="请填写景区名字" />
			</a-form-item>
			<a-form-item label="企业类型" v-bind="validateInfos[`data.businessType`]">
				<a-select allowClear v-model:value="formData.data.businessType" placeholder="请选择企业类型">
					<a-select-option v-for="o in businessTypeOption" :key="o.name" :value="o.oid">{{ o.name }}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="景区等级" v-bind="validateInfos[`data.scenicLevel`]">
				<a-select allowClear v-model:value="formData.data.scenicLevel" placeholder="请选择景区名字">
					<a-select-option v-for="o in 10" :key="o.name" :value="o">{{ o }}A</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="所属地区" class="area" v-bind="errorInfos" :wrapper-col="{ span: 18 }">
				<a-select allowClear v-model:value="formData.data.provinceId" placeholder="请选择省" style="width: 120px" @change="selectCity">
					<a-select-option v-for="item in proviceList" :key="item.oid" :value="item.oid">{{ item.name }}</a-select-option>
				</a-select>
				&nbsp;
				<a-select allowClear v-model:value="formData.data.cityId" placeholder="请选择市" style="width: 120px" @change="selectArea">
					<a-select-option v-for="item in cityList" :key="item.oid" :value="item.oid">{{ item.name }}</a-select-option>
				</a-select>
				&nbsp;
				<a-select allowClear v-model:value="formData.data.areaId" placeholder="请选择辖区" style="width: 120px">
					<a-select-option v-for="item in areaList" :key="item.oid" :value="item.oid">{{ item.name }}</a-select-option>
				</a-select>
				&nbsp;
				<a-input v-model:value="formData.data.addressDetail" placeholder="请输入详细地址" style="width: 150px" />
			</a-form-item>
			<a-form-item label="统一社会信用代码" v-bind="validateInfos[`data.creditCode`]">
				<a-input v-model:value="formData.data.creditCode" placeholder="请填写" />
			</a-form-item>
			<a-form-item label="营业执照" v-bind="validateInfos[`data.businessLicenseUrl`]"> </a-form-item>
			<a-form-item label="联系人姓名" v-bind="validateInfos[`data.contactName`]">
				<a-input v-model:value="formData.data.contactName" placeholder="请填写" />
			</a-form-item>
			<a-form-item label="联系人电话" v-bind="validateInfos[`data.phone`]">
				<a-input v-model:value="formData.data.phone" placeholder="请填写" />
			</a-form-item>
			<a-form-item label="企业状态" v-bind="validateInfos[`data.unitStatus`]">
				<a-radio-group v-model:value="formData.data.unitStatus">
					<a-radio :value="true">开业</a-radio>
					<a-radio :value="false">停业</a-radio>
				</a-radio-group>
			</a-form-item>

			<div class="title">减免属性</div>
			<a-form-item label="是否支持减免" v-bind="validateInfos[`data.derate`]">
				<a-radio-group v-model:value="formData.data.derate">
					<a-radio :value="true">是</a-radio>
					<a-radio :value="false">否</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="减免规则" v-bind="formData.data.derate ? validateInfos[`data.derateRule`] : {}">
				<a-input
					:disabled="formData.data.derate ? false : true"
					v-model:value="formData.data.derateRule"
					placeholder="减免规则详情，逗号隔开满16-9 ：16,9"
				/>
			</a-form-item>
			<div class="title">结算（收款）账户信息</div>
			<a-form-item label="账户类型" v-bind="validateInfos[`data.accountType`]">
				<a-radio-group v-model:value="formData.data.accountType">
					<a-radio :value="1">对公账号</a-radio>
					<a-radio :value="2">个人账号</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="收款账号" v-bind="validateInfos[`data.bankAccount`]">
				<a-input v-model:value="formData.data.bankAccount" placeholder="银行账号" />
			</a-form-item>
			<a-form-item label="账户名" v-bind="validateInfos[`data.bankAccountName`]">
				<a-input v-model:value="formData.data.bankAccountName" placeholder="请填写" />
			</a-form-item>
			<a-form-item label="开户行地址" v-bind="validateInfos[`data.accountAddress`]">
				<a-input v-model:value="formData.data.accountAddress" placeholder="请填写" />
			</a-form-item>
			<a-form-item label="还款行" v-bind="validateInfos[`data.bank`]">
				<a-input v-model:value="formData.data.bank" placeholder="请填写" />
			</a-form-item>
			<div class="footer">
				<div class="tooter-btn">
					<a-button type="primary" @click.prevent="onSubmit">保存</a-button>
					<a-button type="primary" @click="reset">提交审核</a-button>
				</div>
			</div>
		</a-form>
	</div>
</template>

<script setup lang="ts">
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { useScenicSpotOption } from '@/stores/modules/scenicSpot';
import { Form } from 'ant-design-vue';
import { RadioGroupProps } from 'ant-design-vue';
import { toArray } from 'lodash';
import api from '@/api';
import { message } from 'ant-design-vue';

const route = useRouter();

const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
const scenicSpotOptions = useScenicSpotOption();

// 数据
const formData = reactive({
	name: '',
	sub: {
		name: '',
	},
	data: {
		oid: 1, //oid

		// name: '测试景点编辑', //景区名称
		// scenicLevel: 1, //景区等级(字典序号)

		// creditCode: 'abc123', //统一社会行用代码
		// phone: '18756235566', //手机号
		// contactName: '张三', //联系人姓名
		// provinceId: 1, //省id
		// cityId: 2, //市id
		// areaId: 3, //县区id
		// addressDetail: '昆明市官渡区', //详细地址
		// businessLicenseUrl: '/jpg/img.jpg', //营业执照图片地址

		// derate: true, //是否支持减免: true支持，false不支持
		// derateRule: '16,9', //减免规则详情，逗号隔开满16-9 ：16,9

		// accountType: 1, //账户类型，具体类型未确定
		// bankAccount: 12312124124, //银行账号
		// accountAddress: '广东省', //开户地址
		// businessType: 117, //企业业态（注册时，根据字典配置，景区、酒店、旅行社等）
		// bankAccountName: 'zhangdawei', //银行账户名
		// unitStatus: true, //企业状态 true-开业 false-停业

		// bank: null, //收款行
		name: null,
		scenicLevel: null,

		creditCode: null,
		phone: null,
		contactName: null,
		provinceId: null,
		cityId: null,
		areaId: null,
		addressDetail: null,
		businessLicenseUrl: null,
		derate: null,
		derateRule: null,
		accountType: null,
		bankAccount: null,
		accountAddress: null,
		businessType: null,
		bankAccountName: null,
		unitStatus: null,
		bank: null,
		managementRange: null,
		legalPerson: null,
		establishTime: null,
		registeredCapital: null,
	},
});
// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formData,
	reactive({
		'data.provinceId': [{ required: true, message: '请选择省份' }],
		'data.cityId': [{ required: true, message: '请选择市' }],
		'data.areaId': [{ required: true, message: '请选择县区' }],
		'data.addressDetail': [{ required: true, message: '请填写详细地址' }],
		'data.name': [{ required: true, message: '请输入景区名字' }],
		'data.scenicLevel': [{ required: true, message: '请选择景区等级' }],
		'data.creditCode': [{ required: true, message: '请填写统一社会行用代码' }],
		'data.phone': [{ required: true, message: '请填写手机号码' }],
		'data.contactName': [{ required: true, message: '请填写联系人姓名' }],
		'data.businessLicenseUrl': [{ required: true, message: '请上传图片' }],
		'data.derate': [{ required: true, message: '请选择' }],
		'data.derateRule': [{ required: true, message: '请填写规则' }],
		'data.accountType': [{ required: true, message: '请选择账户类型' }],
		'data.bankAccount': [{ required: true, message: '请填写银行账号' }],
		'data.accountAddress': [{ required: true, message: '请填写开户地址' }],
		'data.businessType': [{ required: true, message: '请选择企业业态' }],
		'data.bankAccountName': [{ required: true, message: '请填写银行账户名' }],
		'data.unitStatus': [{ required: true, message: '请选择企业状态' }],
		'data.bank': [{ required: true, message: '请填写还款行' }],
	})
);

//初始化下拉列表
const initOpeion = async () => {
	await scenicSpotOptions.getBusinessTypeOption();
	await scenicSpotOptions.getAllAreaProvice(0);
};
// 下拉选择
const popupScroll = () => {
	console.log('popupScroll');
};

//下拉列表
const businessTypeOption = computed(() => scenicSpotOptions.businessTypeOption);
const proviceList = computed(() => scenicSpotOptions.proviceList);
const cityList = computed(() => scenicSpotOptions.cityList);
const areaList = computed(() => scenicSpotOptions.areaList);

const selectCity = async (id: number) => {
	if (id) {
		await scenicSpotOptions.getAllAreaCity(id);
	} else {
		scenicSpotOptions.cleanCity();
		formData.data.cityId = null;
		formData.data.areaId = null;
	}
};
const selectArea = async (id: any) => {
	await scenicSpotOptions.getAllArea(id);
	if (id) {
		await scenicSpotOptions.getAllAreaCity(id);
	} else {
		scenicSpotOptions.cleanArae();
		formData.data.areaId = null;
	}
};

// 提交
const onSubmit = async () => {
	validate()
		.then((res) => {
			console.log(toRaw(formData.data), 'psss');
			save(toRaw(formData.data));
		})
		.catch((err) => {
			console.log('error', err);
		});

	// try {
	// 	const values = await validate();
	// 	console.log('Success:', values);
	// } catch (errorInfo) {
	// 	//返回报错信息，滚动到第一个报错的位置
	// 	formRef.scrollToField(errorInfo.errorFields[0].name.toString());
	// }
};
const save = async (params: object) => {
	let res = await api.changeScenicSpotInformation(params);
	if (res) {
		message.success('保存成功');
		route.push({ path: '/scenic-spot/information/list' });
	}
};
//合并错误提示
const errorInfos = computed(() => {
	return mergeValidateInfo(toArray(validateInfos).splice(0, 4));
});
// 重置
const reset = (): void => {
	resetFields();
};
//初始化页面
const initPage = async (): Promise<void> => {
	let res = await api.getScenicById(route.currentRoute.value?.query?.oid);
	formData.data = res;
	formData.data.oid = parseInt(route.currentRoute.value?.query?.oid);
	formData.data.cityId && selectCity(formData.data.cityId);
	formData.data.areaId && selectArea(formData.data.areaId);
};

// 自定义面包屑
onMounted(() => {
	initOpeion();
	initPage();
	navigatorBar.setNavigator(['景区信息管理', '编辑']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="scss" scoped>
.editWrapper {
	padding: 0 16px;
	padding-bottom: 64px;
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
// footer {
// 	border-top: 1px solid #f1f2f5;
// 	padding: 16px;
// 	margin: -16px;
// 	// position: fixed;
// 	// bottom: 16px;
// 	// width: 500%;
// 	// background-color: #fff;
// 	// background-color: red;
// }
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
		// background-color: #fff;
		margin-left: 16px;
	}
	button:first-of-type {
		margin-right: 16px;
	}
}
</style>
