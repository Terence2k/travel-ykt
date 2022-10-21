<template>
	<div class="editWrapper">
		<header>基本信息</header>
		<a-form class="" ref="formRef" :label-col="{ span: 3 }" labelAlign="left" :wrapper-col="{ span: 8 }" :scrollToFirstError="true">
			<a-form-item label="联票名称" v-bind="validateInfos[`data.ticketName`]">
				<a-input v-model:value="formData.data.ticketName" placeholder="请填写景区名字" />
			</a-form-item>
			<a-form-item label="子票选择" v-bind="validateInfos[`data.scenicTicketListId`]">
				<a-select mode="multiple" allowClear v-model:value="formData.data.scenicTicketListId" placeholder="子票选择">
					<a-select-option v-for="o in formData.data.scenicTicketList" :key="o.ticketSonName" :value="o.ticketId">
						{{ o.ticketSonName }}
					</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="联票描述" v-bind="validateInfos[`data.ticketDesc`]">
				<a-textarea v-model:value="formData.data.ticketDesc" placeholder="请输入其他说明" :rows="4" />
			</a-form-item>
			<a-form-item label="联票减扣规则" v-bind="validateInfos[`data.businessLicenseUrl`]">
				<TableRule :tableList="formData.data.discountList" @del-rule-obj="delRuleObj" @add-rule-obj="addRuleObj" />
			</a-form-item>
			<a-form-item label="设置价格" v-bind="validateInfos[`data.businessLicenseUrl`]">
				<TablePrice :tableList="formData.data.priceList" @del-rule-obj="delRuleObj" @add-rule-obj="addRuleObj" />
			</a-form-item>
			<a-form-item label="联票价格说明" v-bind="validateInfos[`data.businessLicenseUrl`]" :wrapper-col="{ span: 14 }">
				<div class="tips">
					<p>1、联票的“库存”每日动态调整，以预定当日所有子票中的最低库存量为准；</p>
					<p>2、联票的“票价”每日动态调整，以预定当日所有子票中的价格总和为准，故会产生浮动区间；</p>
					<p>3、联票中的每张子票，其可核销项目、次数、可核销时间段、是否含必核项，以子票本身的规定为准；</p>

					<p>
						4、联票中所包含的子票如果包含有必核销项，则该子票一经核销即视为已被使用，不可退票退款；如该子票
						未发生实际核销，或者只核销了部分游客，则结算时以实际核销数量为准，未核销的有系统自动退款；
					</p>
					<p>
						5、联票预定时先按原价进行资金计算、预冻结，如符合减免条件，则由核销人员在验票时进行减免结算。联
						票可能会涉及到多个景区的门票，则每张子票均由所属的景区工作人员进行核销，不可越权核销。
					</p>
				</div>
			</a-form-item>

			<div class="footer">
				<div class="tooter-btn">
					<a-button type="primary" @click.prevent="onSubmit">保存</a-button>
					<a-button type="primary" @click="onSubmit">提交审核</a-button>
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
import Pic from '@/components/common/imageWrapper.vue';
import TableRule from './tableRule.vue';
import TablePrice from './tablePrice.vue';
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
		discountList: [],
		priceList: [
			{
				sonName: '入园',
				reckon: '200',
			},
			{
				sonName: '游戏机',
				reckon: '200',
			},
		],
	},
});
// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formData,
	reactive({
		'data.provinceId': [{ required: true, message: '请选择省份' }],
	})
);

//删除
const delRuleObj = (index: number) => {
	formData.data.discountList.splice(index, 1);
};
const addRuleObj = (obj: object) => {
	if (String(formData.data.discountList) === 'null') {
		formData.data.discountList = [];
	}
	formData.data.discountList.push(obj);
};
//初始化下拉列表
const initOption = async () => {
	// await scenicSpotOptions.getBusinessTypeOption();
	// await scenicSpotOptions.getAllAreaProvice(0);
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
			// save(toRaw(formData.data));
			route.push('/scenic-spot/multicast/list');
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
	let statisStatus = route.currentRoute.value?.query?.t === '1';
	if (statisStatus) {
		let res = await api.getMultipleDetail(route.currentRoute.value?.query?.o);
		formData.data = res;
	}
};

// 自定义面包屑
onMounted(async () => {
	// navigatorBar.setNavigator(['景区信息管理', '编辑']);
	await initOption();
	await initPage();
});
onBeforeUnmount(() => {
	// navigatorBar.clearNavigator();
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
.tips {
	color: #71747a;
}
</style>
