<template>
	<div class="editWrapper">
		<header class="title">基本信息</header>
		<a-form class="" ref="formRef" :model="formData" :label-col="{ span: 3 }" labelAlign="left" :wrapper-col="{ span: 7 }" :scrollToFirstError="true">
			<a-form-item label="演出名称">
				<a-input v-model:value="formData.data.ticketName" placeholder="请填写演出名字" />
			</a-form-item>
			<a-form-item label="演出场馆">
				<a-input v-model:value="formData.data.ticketName" />
			</a-form-item>

			<a-form-item label="开始时间" v-bind="validateInfos[`data.ticketName`]">
				<a-input v-model:value="formData.data.ticketName" placeholder="请填写门票名称" />
			</a-form-item>
			<a-form-item label="结束时间" v-bind="validateInfos[`data.ticketName`]">
				<a-input v-model:value="formData.data.ticketName" placeholder="请填写门票名称" />
			</a-form-item>
			<a-form-item label="归属景区">
				<!-- <a-input v-model:value="formData.data.scenicId" placeholder="请填写景区名字" /> -->
				<a-select allowClear v-model:value="formData.data.scenicId" placeholder="请选择">
					<a-select-option :value="vlItem.old" v-for="vlItem in viewList" :key="vlItem.ticketId">{{ vlItem.ticketName }}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="演出描述">
				<a-textarea v-model:value="formData.data.ticketDesc" placeholder="演出描述" :rows="4" />
			</a-form-item>
			<a-form-item label="周期设定" v-bind="validateInfos[`data.ticketType`]">
				<a-radio-group v-model:value="formData.data.orderTimeRule">
					<a-radio :value="1">每天</a-radio>
					<a-radio :value="2">每周</a-radio>
					<a-radio :value="3">每月</a-radio>
				</a-radio-group>
				<div>
					<a-form-item v-bind="validateInfos[`data.ticketType`]" v-if="formData.data.orderTimeRule === 2">
						<a-checkbox-group v-model:value="formData.data.orderTimeRul" name="checkboxgroup" :options="optionsWeek" />
					</a-form-item>
					<a-form-item v-bind="validateInfos[`data.ticketType`]" v-if="formData.data.orderTimeRule === 3">
						<a-checkbox-group v-model:value="formData.data.orderTimeRul" name="checkboxgroup" :options="options" />
					</a-form-item>
				</div>
			</a-form-item>

			<div class="footer">
				<div class="tooter-btn">
					<a-button type="primary" @click.prevent="onSubmit">提交审核</a-button>
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

import api from '@/api';
import { message } from 'ant-design-vue';

const route = useRouter();
const options = ref([]);
const optionsWeek = [
	{ label: '周一', value: '1' },
	{ label: '周二', value: '2' },
	{ label: '周三', value: '3' },
	{ label: '周四', value: '4' },
	{ label: '周五', value: '5' },
	{ label: '周六', value: '6' },
	{ label: '周日', value: '7' },
];
const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
// 数据
const formData = reactive({
	data: {
		oid: null, //新增时需要传主键
		verificationType: null, //核销类型
		scenicId: null, //关联景区id
		ticketName: null, //门票名称
		ticketType: null, //门票类型:0-儿童,1-成人,2-老人
		orderTime: null, //预约时间 单位:时分
		orderTimeRule: null, //预约时间规则:0-当日,1-次日
		validTime: null, //有效期 1~7
		optionalVerificationCount: null, //有效期 1~7
		assistId: null, //辅助核销id
		dayStock: null, //门票日库存
		wateryPrice: null, //水牌价
		price: null, //售价
		ticketDesc: null, //单票说明
		restsExplain: null, //其他说明
		itemList: [
			{
				itemId: 1, //itemId
				verificationNumber: 30, //核销数
				ifVerification: true, //是否必须核销
			},
		], //核销项目
		discountList: [
			// {
			// 	ruleName: '军官半价', //规则名称
			// 	certifId: [141], //证件id
			// 	discount: 5, //打折比
			// },
		], //折扣集合
	},
});

// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formData,
	reactive({
		'data.orderTime': [{ required: true, message: '请选择当日最晚可定票时间' }],
		'data.orderTimeRule': [{ required: true, message: '请选择可预定时间' }],
		'data.wateryPrice': [{ required: true, message: '请输入降水价' }],
		'data.price': [{ required: true, message: '请输入价格' }],
		'data.verificationType': [{ required: true, message: '请选择市' }],
		'data.scenicId': [{ required: true, message: '请选择归属景区' }],
		'data.ticketName': [{ required: true, message: '请输入门票名称' }],
		'data.ticketType': [{ required: true, message: '请选择门票分类' }],

		'data.validTime': [{ required: true, message: '请选择有效时间' }],
		// 'data.optionalVerificationCount': [{ required: true, message: '请选择有效期' }],
		// 'data.assistId': [{ required: true, message: '请选择市' }],
		'data.dayStock': [{ required: true, message: '请输入门票库存' }],

		'data.ticketDesc': [{ required: true, message: '请输入' }],
		'data.restsExplain': [{ required: true, message: '请输入' }],
	})
);
//合并错误提示
const errorInfos = computed(() => {
	return mergeValidateInfo(toArray(validateInfos).splice(0, 2));
});
const errorPriceInfos = computed(() => {
	return mergeValidateInfo(toArray(validateInfos).splice(2, 3));
});
//类型
const type = computed(() => {
	return route.currentRoute.value?.query?.t;
});

const tickerType = computed(() => (route.currentRoute.value?.query?.t === '1' ? '单票：单点核销' : '单票：多点核销'));
// 提交
const onSubmit = async () => {
	validate()
		.then((res) => {
			console.log(toRaw(formData.data), 'psss');
			// save(toRaw(formData.data));
			save(toRaw(formData.data));
			// route.currentRoute.value?.query?.s ? save(toRaw(formData.data)) : editInfo(toRaw(formData.data));
		})
		.catch((err) => {
			console.log('error', err);
		});
};
interface interfaceType {
	wateryPrice: null | number;
	price: null | number;
}

const changePrice = (val: interfaceType) => {
	const { wateryPrice, price } = val;
	console.log('emit get ', val);
	formData.data.wateryPrice = wateryPrice;
	formData.data.price = price;
};
// 保存
const save = async (params: object) => {
	let res = await api.saveSingleVoteInfo(params);
	message.success(res);
	route.push({ path: '/scenic-spot/singleVote/list' });
};
// const editInfo = async (params: any) => {};
//删除
const delRuleObj = (index: number) => {
	formData.data.discountList.splice(index, 1);
};
const addRuleObj = (obj: object) => {
	console.log(obj);

	formData.data.discountList.push(obj);
};
const delVerificationObj = (index: number) => {
	formData.data.itemList.splice(index, 1);
};
const addVerificationObj = (obj: object) => {
	console.log(obj, 'addVerificationObj');
	formData.data.itemList.push(toRaw(obj));
};
// 重置
const reset = (): void => {
	resetFields();
};
const viewList = ref(null);
//初始化页面
const initPage = async (): Promise<void> => {
	route.currentRoute.value?.query?.s ? initCreatePage() : initEditPage();
	let res = await api.getViewList();
	viewList.value = res;
};

const initEditPage = async () => {
	navigatorBar.setNavigator(['景区信息管理', '编辑']);
	let res = await api.getScenicSpotSignleDetail(route.currentRoute.value?.query?.oid);
	formData.data = res;
};

const initCreatePage = () => {
	navigatorBar.setNavigator(['景区信息管理', '新增']);
	formData.data.verificationType = route.currentRoute.value?.query?.t === '1' ? 'ONE' : 'MANY';
};
const initOption = () => {
	for (let i = 1; i < 32; i++) {
		options.value.push({ value: i, label: i + '号' });
	}
};
onMounted(() => {
	// initPage();
	initOption();
	// 自定义面包屑
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style scoped lang="less">
.editWrapper {
	padding: 0 16px;
	padding-bottom: 64px;
	position: relative;
	.btn {
		position: relative;
		// top: 10px;
		left: 940px;
		margin-bottom: 10px;
	}
	.title {
		height: 56px;
		line-height: 56px;
		font-weight: bold;
		color: #1e2226;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
	}
	.tips {
		margin-left: 10px;
		color: #c8c9cc;
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
}

.table-area {
	margin: 0;
	padding: 0;
}
.table-wrapper {
	width: 420px;
}
.table-wrapper-long {
	width: 970px;
}
</style>
