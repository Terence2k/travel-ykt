<template>
	<div class="editWrapper">
		<a-tabs v-model:activeKey="activeStatus">
			<a-tab-pane key="1" tab="订单信息">
				<a-form class="" ref="formRef" :label-col="{ span: 3 }" labelAlign="left" :wrapper-col="{ span: 6 }" :scrollToFirstError="true">
					<a-form-item label="行程类型"> 标准团 </a-form-item>
					<a-form-item label="行程单号"> YNLJ1569374 </a-form-item>
					<a-form-item label="发团旅行社"> 黑白水旅行社 </a-form-item>
					<a-form-item label="地接旅行社"> 白鹿旅行社 </a-form-item>
					<a-form-item label="联系电话"> 18101235678 </a-form-item>
					<a-form-item label="入园日期"> 2022.7.14 </a-form-item>
					<a-form-item label="预定时间"> 2022.7.15 15:30:30 </a-form-item>
					<a-form-item label="核销时间"> 2022.7.15 15:30:30 </a-form-item>
					<a-form-item label="行程人数"> 30人 </a-form-item>
					<a-form-item label="订票人数"> 30人 </a-form-item>
					<a-form-item label="核销人数"> 25人 </a-form-item>
					<a-form-item label="订单金额"> 2000元 </a-form-item>
					<a-form-item label="订单编号"> 619351806191367230 </a-form-item>
					<a-form-item label="门票"> 千古情演出 </a-form-item>
					<a-form-item label="门票分类">演出票 </a-form-item>
					<!-- 
					<div class="footer">
						<div class="tooter-btn">
							<a-button type="primary" @click.prevent="onSubmit">保存</a-button>
							<a-button type="primary" @click="reset">提交审核</a-button>
						</div>
					</div> -->
				</a-form>
			</a-tab-pane>

			<a-tab-pane key="2" tab="人员信息">
				<CommonTable :dataSource="dataSource" :columns="columns" :scrollY="false">
					<template #bodyCell="{ column }">
						<template v-if="column.key === 'action'">
							<div class="action-btns">
								<a>申请改刷</a>
								<a>查看</a>
							</div>
						</template>
					</template>
				</CommonTable>
			</a-tab-pane>
		</a-tabs>
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
import Pic from '@/components/common/imageWrapper.vue';
import CommonTable from '@/components/common/CommonTable.vue';
const route = useRouter();

const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
const scenicSpotOptions = useScenicSpotOption();

const activeStatus = ref('1');

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

const dataSource = [
	{
		key: '1',
		name: '王某某',
		age: 32,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '2',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '3',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '1',
		name: '王某某',
		age: 32,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '2',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '2',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '3',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '1',
		name: '王某某',
		age: 32,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '2',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '3',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
];
const columns = [
	{
		title: '序号',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '证件类型',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '证件号码',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '身份类型',
		dataIndex: 'address1',
		key: 'address1',
	},
	{
		title: '姓名',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '性别',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '健康状态',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '门票类型',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '核销情况',
		dataIndex: 'address3',
		key: 'address3',
	},
];

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
		// 'data.businessLicenseUrl': [{ required: true, message: '请上传图片' }],
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

const selectCity = async (id: any) => {
	if (id) {
		await scenicSpotOptions.getAllAreaCity(id);
	} else {
		scenicSpotOptions.cleanCity();
		formData.data.cityId = null;
		formData.data.areaId = null;
	}
};
const selectArea = async (id: any) => {
	if (id) {
		await scenicSpotOptions.getAllArea(id);
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
	// formData.data.cityId && selectCity(formData.data.cityId);
	// formData.data.areaId && selectArea(formData.data.areaId);
};

// 自定义面包屑
onMounted(async () => {
	navigatorBar.setNavigator(['景区信息管理', '编辑']);
	await initOpeion();
	await initPage();
	await selectCity(formData.data.provinceId);
	await selectArea(formData.data.cityId);
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

.table-area {
	padding: 0;
}
</style>
