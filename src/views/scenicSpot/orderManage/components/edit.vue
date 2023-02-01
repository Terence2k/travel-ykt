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
					<a-form-item label="入园日期">
						{{ formData.data.orderInfo.schoolDate ? shijiancTOYMD(formData.data.orderInfo.schoolDate) : '-' }}
					</a-form-item>
					<a-form-item label="预定时间"> {{ formData.data.orderInfo.bookDate ? shijianc(formData.data.orderInfo.bookDate) : '-' }}</a-form-item>
					<!-- 两边环境的时间格式不一致，先以甲方为准 ⬆ -->
					<a-form-item label="核销时间">
						{{ formData.data.orderInfo.verificationTime ? shijianc(formData.data.orderInfo.verificationTime) : '-' }}
					</a-form-item>
					<a-form-item label="行程人数"> {{ formData.data.orderInfo.itineraryCount }} 人</a-form-item>
					<a-form-item label="订票人数"> {{ formData.data.orderInfo.bookCount }} 人</a-form-item>
					<a-form-item label="核销人数"> {{ formData.data.orderInfo.verificationCount }} 人</a-form-item>
					<a-form-item label="订单金额"> {{ formData.data.orderInfo.orderCountAmount / 100 }} 元 </a-form-item>
					<a-form-item label="订单编号"> {{ formData.data.orderInfo.orderNo }} </a-form-item>
					<a-form-item label="门票"> {{ formData.data.orderInfo.ticketName }} </a-form-item>
					<!-- <a-form-item label="门票分类"> {{ formData.data.orderInfo.ticketType }} </a-form-item> -->

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
						<template v-if="column.key === 'certificateType'">
							{{ certificateTypeList[record.certificateType] }}
						</template>
						<template v-if="column.key === 'gender'">
							{{ record.gender ? '男' : '女' }}
						</template>
						<template v-if="column.key === 'specialPic'">
							<a-image v-if="record.specialPic" :width="100" :height="70" :src="record.specialPic" :fallback="error" />
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
import { shijianc, shijiancTOYMD } from '@/utils/formatTimes';

// import { useTravelStore } from '@/stores/modules/travelManagement';
// const travelStore = useTravelStore();
// const IDCard = computed(() => travelStore.IDCard);
const route = useRouter();

const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
const scenicSpotOptions = useScenicSpotOption();

const activeStatus = ref('1');
//图片报错显示
const error =
	'data:image/png;base64,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';
//证件枚举
const certificateTypeList = {
	PASSPORT: '护照',
	IDENTITY_CARD: '身份证',
};

interface formDataType {
	name: string;
	sub: any;
	data: {
		orderInfo: {
			travelType: string | null;
			itineraryNo: string | null;
			sendTravelName: string | null;
			localTravelName: string | null;
			sendTravelPhone: string | null;
			schoolTime: string | null;
			verificationTime: string | null;
			bookTime: string | null;
			travelCount: number | null;
			bookCount: number | null;
			verificationCount: number | null;
			orderAmount: number | null;
			settleAmount: number | null;
			orderNo: string | null;
			ticketName: string | null;
			ticketType: string | null;
		};
		orderPersonInfoList: [
			{
				certificateType: string;
				certificateNo: string;
				gender: string;
				personName: string;
				sourceAddress: string;
				specialNo: string;
				specialPic: string;
				specialType: string;
				verificationStatus: boolean;
			}
		];
	};
}

// 数据
const formData = reactive<formDataType>({
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
				certificateType: 'IDENTITY_CARD', //证件类型名称
				certificateNo: '证件号', //证件号
				gender: '性别', //性别: true 男 false 女
				personName: '人员名称', //人员名称
				sourceAddress: '客源地', //客源地
				specialNo: '特殊证件号', //特殊证件号
				specialPic:
					'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F8%2F55402f62682e3.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670745661&t=9a04e58c6f2167fb66bbc889e666f8a4', //特殊证件图片.jpg/png...
				specialType: '特殊证件类型名称', //特殊证件类型(按照字典175)
				verificationStatus: true,
			},
		],
	},
});

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

//合并错误提示
const errorInfos = computed(() => {
	return mergeValidateInfo(toArray(validateInfos).splice(0, 4));
});

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

// 重置
const reset = (): void => {
	resetFields();
};

//初始化页面
const initPage = async (): Promise<void> => {
	let res = await api.getViewOrderDetails(route.currentRoute.value?.query?.oid);
	formData.data = res;
	// formData.data.oid = parseInt(route.currentRoute.value?.query?.oid);
};

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

const save = async (params: object) => {
	let res = await api.changeScenicSpotInformation(params);
	if (res) {
		message.success('保存成功');
		route.push({ path: '/scenic-spot/information/list' });
	}
};

// 自定义面包屑
onMounted(async () => {
	navigatorBar.setNavigator(['景区管理', '订单管理']);
	await initPage();
	// await initOpeion();
});

onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
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
