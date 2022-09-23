<template>
	<div class="editWrapper">
		<header>基本信息</header>
		<a-form class="" ref="formRef" :label-col="{ span: 3 }" labelAlign="left" :wrapper-col="{ span: 7 }" :scrollToFirstError="true">
			<a-form-item label="归属景区">
				<a-input v-model:value="formData.data.scenicName" placeholder="请填写景区名字" />
			</a-form-item>
			<a-form-item label="票种分类" v-bind="validateInfos[`data.businessType`]">
				<a-select allowClear v-model:value="formData.data.businessType" placeholder="请选择企业类型">
					<a-select-option v-for="o in businessTypeOption" :key="o.name" :value="o.oid">{{ o.name }}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="门票名称" v-bind="validateInfos[`data.scenicLevel`]">
				<a-input v-model:value="formData.data.name" placeholder="请填写门票名称" />
			</a-form-item>
			<a-form-item label="门票分类" v-bind="validateInfos[`data.scenicLevel`]">
				<a-input v-model:value="formData.data.name" placeholder="请填写门票名称" />
			</a-form-item>
			<a-form-item label="可预定时间" v-bind="validateInfos[`data.unitStatus`]">
				<a-radio-group v-model:value="formData.data.accountType">
					<a-radio :value="1">当日可定</a-radio>
					<a-radio :value="2">次日可定</a-radio>
				</a-radio-group>
				<br />
				<br />
				当日最晚可定票时间：
				<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formData.data.time" style="width: 140px" />
			</a-form-item>

			<a-form-item label=" 有效期" v-bind="validateInfos[`data.creditCode`]" :wrapper-col="{ span: 12 }">
				指定入园时间起 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formData.data.time" style="width: 140px" placeholder="一日内有效" />
				<span class="tips"> 说明 ： 超过当日24时算一日结束 </span>
			</a-form-item>

			<div class="title">核销规则</div>
			<a-form-item label="核销项目" :wrapper-col="{ span: 12 }">
				<div class="table-wrapper-long">
					<EditProjectTable :tableList="formData.data.data" />
					<!-- <CommonTable :dataSource="formData.data.data" :columns="columns" :scrollY="false" bordered :scroll="{ x: '10vw' }">
						<template #bodyCell="{ column, record }">
							<template v-if="column.key === 'action'">
								<div class="action-btns">
									<a href="javascript:;" @click="toEdit(record)">编辑</a>
									<a href="javascript:;">删除</a>
									<a href="javascript:;" v-if="record.putaway === '上架'" @click="open"> 下架申请</a>
								</div>
							</template>
						</template>
					</CommonTable> -->
				</div>
				<span class="tips"> <span style="color: red">*</span>其中，非必核销项目数量为3项，可核销总数（不包括必核销项）不超过（） 次</span>
			</a-form-item>
			<a-form-item label="可核销账号" :wrapper-col="{ span: 12 }">
				<div class="table-wrapper">
					<CommonTable :dataSource="formData.data.data" :columns="columnsCount" :scrollY="false" bordered>
						<template #bodyCell="{ column, record }">
							<template v-if="column.key === 'action'">
								<div class="action-btns">
									<a href="javascript:;" @click="toEdit(record)">编辑</a>
									<a href="javascript:;">删除</a>
									<a href="javascript:;" v-if="record.putaway === '上架'" @click="open"> 下架申请</a>
								</div>
							</template>
						</template>
					</CommonTable>
				</div>
			</a-form-item>

			<div class="title">票价</div>
			<a-form-item label="门票库存" v-bind="validateInfos[`data.derate`]">
				<a-input v-model:value="formData.data.creditCode" placeholder="输入每日库存" />
			</a-form-item>
			<a-form-item label="票价" :wrapper-col="{ span: 12 }">
				<div class="table-wrapper">
					<CommonTable :dataSource="formData.data.data" :columns="columnsCount" :scrollY="false" bordered>
						<template #bodyCell="{ column, record }">
							<template v-if="column.key === 'action'">
								<div class="action-btns">
									<a href="javascript:;" @click="toEdit(record)">编辑</a>
									<a href="javascript:;">删除</a>
									<a href="javascript:;" v-if="record.putaway === '上架'" @click="open"> 下架申请</a>
								</div>
							</template>
						</template>
					</CommonTable>
				</div>
			</a-form-item>
			<a-form-item label="费用包含">
				<a-textarea v-model:value="formData.data.reason" placeholder="请输入费用包含" :rows="4" />
			</a-form-item>
			<a-form-item label="其他说明">
				<a-textarea v-model:value="formData.data.reason" placeholder="请输入其他说明" :rows="4" />
			</a-form-item>
			<div class="title">减免规则</div>
			<a-form-item label="减免规则" :wrapper-col="{ span: 12 }">
				<div class="table-wrapper-long">
					<CommonTable :dataSource="formData.data.data" :columns="columns" :scrollY="false" bordered style-maxWidth="400">
						<template #bodyCell="{ column, record }">
							<template v-if="column.key === 'action'">
								<div class="action-btns">
									<a href="javascript:;" @click="toEdit(record)">编辑</a>
									<a href="javascript:;">删除</a>
									<a href="javascript:;" v-if="record.putaway === '上架'" @click="open"> 下架申请</a>
								</div>
							</template>
						</template>
					</CommonTable>
				</div>
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
import CommonTable from '@/components/common/CommonTable.vue';

import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { useScenicSpotOption } from '@/stores/modules/scenicSpot';
import { Form } from 'ant-design-vue';
import { RadioGroupProps } from 'ant-design-vue';
import { toArray } from 'lodash';
import EditProjectTable from './editProjectTable.vue';
import api from '@/api';
import { message } from 'ant-design-vue';

const route = useRouter();

const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
const scenicSpotOptions = useScenicSpotOption();
const columnsCount = ref([
	{
		title: '核销账号',
		dataIndex: 'ticketName',
		key: 'ticketName',
		width: 200,
	},
	{
		title: '姓名',
		dataIndex: 'verificationType',
		key: 'verificationType',
		width: 200,
	},
]);
const columns = ref([
	{
		title: '核销项目',
		dataIndex: 'ticketName',
		width: 200,
		key: 'ticketName',
	},
	{
		title: '可核销次数',
		dataIndex: 'verificationType',
		width: 200,
		key: 'verificationType',
	},
	{
		title: '是否为必核销项',
		dataIndex: 'scenicName',
		width: 200,
		key: 'scenicName',
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 200,
		key: 'action',
	},
]);

// 数据
const formData = reactive({
	data: {
		data: [{ scenicName: '1' }],
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
	})
);

//初始化下拉列表
const initOpeion = async () => {
	await scenicSpotOptions.getBusinessTypeOption();
	await scenicSpotOptions.getAllAreaProvice(0);
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
};
// 保存
const save = async (params: object) => {
	let res = await api.changeScenicSpotInformation(params);
	if (res) {
		message.success('保存成功');
		route.push({ path: '/scenic-spot/information/list' });
	}
};

// 重置
const reset = (): void => {
	resetFields();
};
//初始化页面
const initPage = async (): Promise<void> => {
	route.currentRoute.value?.query?.s ? navigatorBar.setNavigator(['景区信息管理', '新增']) : navigatorBar.setNavigator(['景区信息管理', '编辑']);

	// let res = await api.getScenicById(route.currentRoute.value?.query?.oid);
	// formData.data = res;
	// formData.data.oid = parseInt(route.currentRoute.value?.query?.oid);
	// formData.data.cityId && selectCity(formData.data.cityId);
	// formData.data.areaId && selectArea(formData.data.areaId);
};
//创建
const createInfo = () => {};
// 编辑
const editInfo = () => {};

onMounted(() => {
	initOpeion();
	initPage();
	// 自定义面包屑
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
.tips {
	margin-left: 10px;
	color: #c8c9cc;
}
.table-area {
	margin: 0;
	padding: 0;
}
.table-wrapper {
	width: 420px;
}
.table-wrapper-long {
	width: 820px;
}
</style>
