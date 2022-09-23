<template>
	<div class="editWrapper">
		<header>基本信息</header>
		<a-form class="" ref="formRef" :label-col="{ span: 4 }" labelAlign="left" :wrapper-col="{ span: 6 }" :scrollToFirstError="true">
			<a-form-item label="企业名称">
				{{ formData.data.name }}
			</a-form-item>
			<a-form-item label="企业类型">
				{{ businessTypeName }}
			</a-form-item>
			<a-form-item label="景区等级"> {{ formData.data.scenicLevel }}A </a-form-item>
			<a-form-item label="所属地区" class="area" :wrapper-col="{ span: 14 }">
				{{ proviceName }}
				{{ cityName }}
				{{ areaName }}
				{{ formData.data.addressDetail }}
			</a-form-item>
			<a-form-item label="统一社会信用代码">
				{{ formData.data.creditCode }}
			</a-form-item>
			<a-form-item label="营业执照">
				{{ formData.data.businessLicenseUrl }}
			</a-form-item>
			<a-form-item label="联系人姓名">
				{{ formData.data.contactName }}
			</a-form-item>
			<a-form-item label="联系人电话">
				{{ formData.data.phone }}
			</a-form-item>
			<a-form-item label="企业状态">
				{{ formData.data.unitStatus ? '开业' : typeof formData.data.unitStatus === 'number' ? '停业' : '' }}
			</a-form-item>

			<div class="title">减免属性</div>
			<a-form-item label="是否支持减免">
				{{ formData.data.derate ? '是' : '否' }}
			</a-form-item>
			<a-form-item label="减免规则" v-show="formData.data.derate">
				{{ reduceRuleRes }}
			</a-form-item>
			<div class="title">结算（收款）账户信息</div>
			<a-form-item label="账户类型">
				{{ formData.data.accountType === 1 ? '对公账号' : formData.data.accountType === 2 ? '个人账号' : '' }}
			</a-form-item>
			<a-form-item label="收款账号">
				{{ formData.data.bankAccount }}
			</a-form-item>
			<a-form-item label="账户名">
				{{ formData.data.bankAccountName }}
			</a-form-item>
			<a-form-item label="开户行地址">
				{{ formData.data.accountAddress }}
			</a-form-item>
			<a-form-item label="还款行">
				{{ formData.data.bank }}
			</a-form-item>

			<footer>
				<a-button type="primary" htmlType="{submit}" @click.prevent="onSubmit">编辑</a-button>
			</footer>
		</a-form>
	</div>
</template>

<script setup lang="ts">
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { Form } from 'ant-design-vue';
import { RadioGroupProps } from 'ant-design-vue';
import { toArray } from 'lodash-es';
import { useScenicSpotOption } from '@/stores/modules/scenicSpot';
import api from '@/api';

const scenicSpotOptions = useScenicSpotOption();
const navigatorBar = useNavigatorBar();
const route = useRouter();

const useForm = Form.useForm;
// 数据
const formData = reactive({
	data: {
		// oid: 1, //oid

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
		// managementRange: null, //经营范围
		// legalPerson: null, //法人
		// establishTime: null, //成立时间
		// registeredCapital: null, //注册资本（单位：万）
		name: '',
		scenicLevel: '',

		creditCode: '',
		phone: '',
		contactName: '',
		provinceId: '',
		cityId: '',
		areaId: '',
		addressDetail: '',
		businessLicenseUrl: '',
		derate: '',
		derateRule: '',
		accountType: '',
		bankAccount: '',
		accountAddress: '',
		businessType: '',
		bankAccountName: '',
		unitStatus: '',
		bank: '',
		managementRange: '',
		legalPerson: '',
		establishTime: '',
		registeredCapital: '',
	},
});
const reduceRuleRes = computed(() => {
	if (formData.data?.derateRule?.includes(',')) {
		return '满' + formData.data.derateRule?.split(',')[0] + '减' + formData.data.derateRule?.split(',')[1];
	} else if (formData.data?.derateRule?.includes('，')) {
		return '满' + formData.data.derateRule?.split('，')[0] + '减' + formData.data.derateRule?.split('，')[1];
	} else {
		return null;
	}
});
// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(formData);
// 提交
const onSubmit = async () => {
	route.push({ path: '/scenic-spot/information/edit', query: { oid: encodeURIComponent(formData.data.oid) } });
};
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

const businessTypeName = computed(() => {
	let name = null;
	scenicSpotOptions.businessTypeOption.map((i) => {
		if (i.oid === formData.data.businessType) {
			name = i.name;
		}
	});
	return name;
});
const proviceName = computed(() => {
	let name = null;
	scenicSpotOptions.proviceList.map((i) => {
		if (i.oid === formData.data.provinceId) {
			name = i.name;
		}
	});
	return name;
});
const cityName = computed(() => {
	let name = null;
	scenicSpotOptions.cityList.map((i) => {
		if (i.oid === formData.data.cityId) {
			name = i.name;
		}
	});
	return name;
});
const areaName = computed(() => {
	let name = null;
	scenicSpotOptions.areaList.map((i) => {
		if (i.oid === formData.data.areaId) {
			name = i.name;
		}
	});
	return name;
});

const selectCity = async (id: any) => {
	if (id) {
		await scenicSpotOptions.getAllAreaCity(id);
	} else {
		scenicSpotOptions.cleanCity();
	}
};
const selectArea = async (id: any) => {
	if (id) {
		await scenicSpotOptions.getAllArea(id);
	} else {
		scenicSpotOptions.cleanArae();
	}
};

//初始化页面
const initPage = async (): Promise<void> => {
	formData.data.oid = route.currentRoute.value?.query?.oid;
	let res = await api.getScenicById(formData.data.oid);
	console.log(res, 'res');
	formData.data = res;
	formData.data.oid = route.currentRoute.value?.query?.oid;
};

onMounted(async () => {
	await initPage();
	initOpeion();
	selectCity(formData.data.provinceId);
	selectArea(formData.data.cityId);

	// 自定义面包屑
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
