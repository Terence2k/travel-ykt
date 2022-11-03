<template>
	<div class="editWrapper">
		<a-tabs v-model:activeKey="activeStatus">
			<a-tab-pane key="1" tab="订单信息">
				<a-form class="" ref="formRef" :label-col="{ span: 3 }" labelAlign="left" :wrapper-col="{ span: 6 }" :scrollToFirstError="true">
					<a-form-item label="行程类型"> {{ formData.data.orderInfo.travelType }} </a-form-item>
					<a-form-item label="行程单号"> {{ formData.data.orderInfo.itineraryNo }} </a-form-item>
					<a-form-item label="发团旅行社"> {{ formData.data.orderInfo.sendTravelName }} </a-form-item>
					<a-form-item label="地接旅行社"> {{ formData.data.orderInfo.localTravelName }} </a-form-item>
					<a-form-item label="联系电话"> {{ formData.data.orderInfo.sendTravelPhone }} </a-form-item>
					<a-form-item label="入园日期"> {{ formData.data.orderInfo.schoolDate || '-' }} </a-form-item>
					<a-form-item label="预定时间"> {{ formData.data.orderInfo.bookDate || '-' }}</a-form-item>
					<a-form-item label="核销时间"> {{ formData.data.orderInfo.verificationTime || '-' }} </a-form-item>
					<a-form-item label="行程人数"> {{ formData.data.orderInfo.itineraryCount }} </a-form-item>
					<a-form-item label="订票人数"> {{ formData.data.orderInfo.bookCount }} </a-form-item>
					<a-form-item label="核销人数"> {{ formData.data.orderInfo.verificationCount }} </a-form-item>
					<a-form-item label="订单金额"> {{ formData.data.orderInfo.orderAmount }} </a-form-item>
					<a-form-item label="订单编号"> {{ formData.data.orderInfo.orderNo }} </a-form-item>
					<a-form-item label="门票"> {{ formData.data.orderInfo.ticketName }} </a-form-item>
					<a-form-item label="门票分类"> {{ formData.data.orderInfo.ticketType }} </a-form-item>

					<div class="footer">
						<div class="tooter-btn">
							<a-button type="primary" @click.prevent="route.back()">后退</a-button>
						</div>
					</div>
				</a-form>
			</a-tab-pane>

			<a-tab-pane key="2" tab="人员信息">
				<CommonTable :dataSource="formData.data.orderPersonInfoList" :columns="columns" :scrollY="false">
					<template #bodyCell="{ column, index, record }">
						<template v-if="column.key === 'index'">
							{{ index + 1 }}
						</template>
						<template v-if="column.key === 'verificationStatus'"> {{ record.verificationStatus ? '已核销' : '未核销' }} </template>
						<template v-if="column.key === 'action'">
							<div class="action-btns">
								<a>申请改刷</a>
								<a>查看</a>
							</div>
						</template>
					</template>
				</CommonTable>
				<div class="footer">
					<div class="tooter-btn">
						<a-button type="primary" @click.prevent="route.back()">后退</a-button>
					</div>
				</div>
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

// import { useTravelStore } from '@/stores/modules/travelManagement';
// const travelStore = useTravelStore();
// const IDCard = computed(() => travelStore.IDCard);
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
		orderInfo: {
			travelType: '行程类型', //行程类型名称
			itineraryNo: '行程单号', //行程单号
			sendTravelName: '发团社名称', //发团旅行社
			localTravelName: '地接社名称', //地接旅行社
			sendTravelPhone: '联系电话', //联系电话
			schoolTime: '2022-7-14', //入园日期(yyyy-MM-dd)
			verificationTime: '2022-7-12 17:50:45', //核销时间(yyyy-MM-dd HH:mm:ss)
			bookTime: '2022-7-12 17:50:45', //预定时间
			travelCount: 50, //行程人数
			bookCount: 35, //订票人数
			verificationCount: 20, //核销人数
			orderAmount: 25061, //订单金额: 250.61
			settleAmount: 20000, //结算金额: 200.00
			orderNo: '订单号', //订单号
			ticketName: '门票名称', //门票名称
			ticketType: '门票分类名称', //门票类型:0-儿童,1-成人,2-老人
		}, //订单详情信息
		orderPersonInfoList: [
			{
				certificateType: '证件类型名称', //证件类型名称
				certificateNo: '证件号', //证件号
				gender: '性别', //性别: true 男 false 女
				personName: '人员名称', //人员名称
				sourceAddress: '客源地', //客源地
				specialNo: '特殊证件号', //特殊证件号
				specialPic: '特殊证件图片', //特殊证件图片.jpg/png...
				specialType: '特殊证件类型名称', //特殊证件类型(按照字典175)
				verificationStatus: true,
			},
		],
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
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '证件类型',
		dataIndex: 'certificateType',
		key: 'certificateType',
	},
	{
		title: '证件号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '姓名',
		dataIndex: 'personName',
		key: 'personName',
	},
	{
		title: '性别',
		dataIndex: 'gender',
		key: 'gender',
	},
	{
		title: '客源地',
		dataIndex: 'sourceAddress',
		key: 'sourceAddress',
	},

	{
		title: '特殊证件号',
		dataIndex: 'specialNo',
		key: 'specialNo',
	},
	{
		title: '特殊证件图片',
		dataIndex: 'specialPic',
		key: 'specialPic',
	},
	{
		title: '核销情况',
		dataIndex: 'verificationStatus',
		key: 'verificationStatus',
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
	let res = await api.getViewOrderDetails(route.currentRoute.value?.query?.oid);
	// formData.data = res;
	// formData.data.oid = parseInt(route.currentRoute.value?.query?.oid);
};

// 自定义面包屑
onMounted(async () => {
	// navigatorBar.setNavigator(['景区信息管理', '编辑']);
	await initPage();
	// await initOpeion();
});
onBeforeUnmount(() => {
	// navigatorBar.clearNavigator();
});
</script>

<style scoped lang="less">
.editWrapper {
	padding: 0 16px;
	padding-bottom: 64px;
}

.table-area {
	padding: 0;
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
</style>
