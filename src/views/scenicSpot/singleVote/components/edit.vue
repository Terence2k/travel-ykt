<template>
	<div class="editWrapper">
		<header class="title">基本信息</header>
		<a-form class="" ref="formRef" :model="formData" :label-col="{ span: 3 }" labelAlign="left" :wrapper-col="{ span: 7 }" :scrollToFirstError="true">
			<a-form-item label="归属景区" v-if="type === '1'">
				<a-input v-model:value="formData.data.scenicId" placeholder="请填写景区名字" />
				<a-select allowClear Fv-model:value="formData.data.scenicId" placeholder="请选择">
					<a-select-option :value="vlItem.old" v-for="vlItem in viewList" :key="vlItem.old">{{ vlItem }}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="票种分类">
				<a-input disabled v-model:value="tickerType" />
			</a-form-item>

			<a-form-item label="门票名称" v-bind="validateInfos[`data.ticketName`]">
				<a-input v-model:value="formData.data.ticketName" placeholder="请填写门票名称" />
			</a-form-item>
			<a-form-item label="门票分类" v-bind="validateInfos[`data.ticketType`]">
				<a-select allowClear ref="select" v-model:value="formData.data.ticketType" placeholder="请选择">
					<a-select-option :value="0">儿童</a-select-option>
					<a-select-option :value="1">成人</a-select-option>
					<a-select-option :value="2">老人</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="可预定时间" v-bind="errorInfos" style="margin-bottom: 10px">
				<a-radio-group v-model:value="formData.data.orderTimeRule">
					<a-radio :value="false">当日可定</a-radio>
					<a-radio :value="true">次日可定</a-radio>
				</a-radio-group>
				<br />
				<br />
				当日最晚可定票时间：
				<a-time-picker
					v-model:value="formData.data.orderTime"
					valueFormat="HH:mm"
					format="HH:mm"
					:placeholder="formData.data.orderTime"
					style="width: 120px"
				/>
			</a-form-item>

			<a-form-item label=" 有效期" v-bind="validateInfos[`data.optionalVerificationCount`]" :wrapper-col="{ span: 12 }">
				指定入园时间起 ,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<a-select allowClear ref="select" v-model:value="formData.data.optionalVerificationCount" placeholder="请选择" style="width: 120px">
					<a-select-option :value="day" v-for="day in 7" :key="day">{{ day }}日内有效</a-select-option>
				</a-select>
				<span class="tips"> 说明 ： 超过当日24时算一日结束 </span>
			</a-form-item>

			<div class="title">核销规则</div>

			<a-form-item label="核销项目" :wrapper-col="{ span: 12 }">
				<div :class="type === '2' ? 'table-wrapper-long' : 'table-wrapper'">
					<EditProjectTable
						@del-verification-obj="delVerificationObj"
						@add-verification-obj="addVerificationObj"
						:tableList="formData.data.itemList"
					/>
				</div>
			</a-form-item>
			<a-form-item label="可核销账号" :wrapper-col="{ span: 12 }">
				<div class="table-wrapper">
					<EditCountTable :tableList="[{ assistId: formData.data.assistId }]" />
				</div>
			</a-form-item>

			<div class="title">票价</div>
			<a-form-item label="门票库存" v-bind="validateInfos[`data.dayStock`]">
				<a-input v-model:value="formData.data.dayStock" placeholder="输入每日库存" />
			</a-form-item>
			<a-form-item label="票价" :wrapper-col="{ span: 12 }" v-bind="errorPriceInfos" style="margin-bottom: 10px">
				<div class="table-wrapper">
					<EditPriceTable :tableList="[{ wateryPrice: formData.data.wateryPrice, price: formData.data.price }]" @change-price="changePrice" />
				</div>
			</a-form-item>
			<a-form-item label="费用包含">
				<a-textarea v-model:value="formData.data.oneExplain" placeholder="请输入费用包含" :rows="4" />
			</a-form-item>
			<a-form-item label="其他说明">
				<a-textarea v-model:value="formData.data.restsExplain" placeholder="请输入其他说明" :rows="4" />
			</a-form-item>
			<div class="title">减免规则</div>
			<a-form-item label="减免规则" :wrapper-col="{ span: 12 }">
				<div class="table-wrapper-long">
					<EditRuleTable :tableList="formData.data.discountList" @del-rule-obj="delRuleObj" @add-rule-obj="addRuleObj" />
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
import EditCountTable from './editCountTable.vue';
import EditPriceTable from './editPriceTable.vue';
import EditRuleTable from './editRuleTable.vue';
import api from '@/api';
import { message } from 'ant-design-vue';

const route = useRouter();

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
		oneExplain: null, //单票说明
		restsExplain: null, //其他说明
		itemList: [
			// {
			// 	itemId: 1, //itemId
			// 	verificationNumber: 30, //核销数
			// 	ifVerification: true, //是否必须核销
			// },
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
		'data.optionalVerificationCount': [{ required: true, message: '请选择有效期' }],
		'data.assistId': [{ required: true, message: '请选择市' }],
		'data.dayStock': [{ required: true, message: '请输入门票库存' }],

		'data.oneExplain': [{ required: true, message: '请输入' }],
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
			route.currentRoute.value?.query?.s ? createInfo(toRaw(formData.data)) : editInfo(toRaw(formData.data));
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
const createInfo = (params: object) => {
	console.log(params);
};
const editInfo = async (params: any) => {
	let res = await api.saveSingleVoteInfo(params);
	message.success(res);
	route.push({ path: '/scenic-spot/singleVote/list' });
};
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

onMounted(() => {
	initPage();
	// 自定义面包屑
});
onBeforeUnmount(() => {
	// navigatorBar.clearNavigator();
});
</script>

<style lang="scss" scoped>
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
