<template>
	<div class="editWrapper">
		<header class="title">基本信息</header>
		<a-form class="" ref="formRef" :model="formData" :label-col="{ span: 2 }" labelAlign="left" :wrapper-col="{ span: 7 }" :scrollToField="true">
			<a-form-item label="归属景区" name="data.scenicId" v-bind="validateInfos[`data.scenicId`]">
				<a-select allowClear v-model:value="formData.data.scenicId" placeholder="请选择">
					<a-select-option :value="vlItem.old" v-for="vlItem in viewList" :key="vlItem.ticketId">{{ vlItem.ticketName }}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="票种分类">
				<a-input disabled v-model:value="tickerType" />
			</a-form-item>
			<a-form-item label="门票名称" name="data.ticketName" v-bind="validateInfos[`data.ticketName`]">
				<a-input v-model:value="formData.data.ticketName" placeholder="请填写门票名称" />
			</a-form-item>
			<!-- <a-form-item label="门票分类" v-bind="validateInfos[`data.ticketType`]">
				<a-select allowClear ref="select" v-model:value="formData.data.ticketType" placeholder="请选择">
					<a-select-option :value="0">儿童</a-select-option>
					<a-select-option :value="1">成人</a-select-option>
					<a-select-option :value="2">老人</a-select-option>
				</a-select>
			</a-form-item> -->
			<a-form-item label="可预定时间" name="data.orderTimeRule" v-bind="errorInfos" style="margin-bottom: 10px">
				<a-radio-group v-model:value="formData.data.orderTimeRule">
					<a-radio :value="false">当日可定</a-radio>
					<a-radio :value="true">次日不可定</a-radio>
				</a-radio-group>
				<br />
				<br />
				当日最晚可定票时间：
				<!-- <a-time-picker
					v-model:value="formData.data.orderTime"
					valueFormat="HH:mm"
					format="HH:mm"
					:placeholder="formData.data.orderTime"
					style="width: 120px"
				/> -->

				<timePicker
					style="width: 120px"
					v-model="formData.data.orderTime"
					valueFormat="HH:mm"
					format="HH:mm"
					:placeholder="formData.data.orderTime"
				></timePicker>
			</a-form-item>

			<a-form-item label="有效期" name="data.validTime" v-bind="validateInfos[`data.validTime`]" :wrapper-col="{ span: 12 }">
				指定入园时间起 ,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<a-select allowClear ref="select" v-model:value="formData.data.validTime" placeholder="请选择" style="width: 120px">
					<a-select-option :value="day" v-for="day in 7" :key="day">{{ day }}日内有效</a-select-option>
				</a-select>
				<span class="tips"> 说明 ： 超过当日24时算一日结束 </span>
			</a-form-item>

			<div class="title">核销规则</div>
			<a-form-item label="核销项目" name="data.itemList" v-bind="validateInfos[`data.itemList`]" :wrapper-col="{ span: 12 }">
				<EditProjectTable
					ref="editProjectTableRef"
					@del-verification-obj="delVerificationObj"
					@add-verification-obj="addVerificationObj"
					:tableList="formData.data.itemList"
					@add-verification-obj-sign="addVerificationObjSign"
					@change-iv="changeIv"
					:viewId="formData.data.scenicId"
				/>
				<!-- <span v-if="isShow" class="ant-form-item-explain-error">请填写可核销次数</span> -->
			</a-form-item>

			<!-- <a-form-item label="可核销账号" :wrapper-col="{ span: 12 }">
				<EditCountTable :tableList="[{ assistId: formData.data.assistId }]" />
			</a-form-item> -->

			<div class="title">票价</div>
			<a-form-item label="门票库存" name="data.dayStock" v-bind="validateInfos[`data.dayStock`]">
				<a-input v-model:value="formData.data.dayStock" placeholder="输入每日库存" />
			</a-form-item>
			<a-form-item label="票价" name="data.wateryPrice" :wrapper-col="{ span: 12 }" v-bind="errorPriceInfos" style="margin-bottom: 10px">
				<EditPriceTable
					:tableList="[
						{
							wateryPrice: formData.data.wateryPrice ? formData.data.wateryPrice / 100 : null,
							price: formData.data.price ? formData.data.price / 100 : null,
						},
					]"
					@change-price="changePrice"
				/>
			</a-form-item>
			<a-form-item label="费用包含">
				<a-textarea v-model:value="formData.data.ticketDesc" placeholder="请输入费用包含" :rows="4" />
			</a-form-item>
			<a-form-item label="其他说明">
				<a-textarea v-model:value="formData.data.restsExplain" placeholder="请输入其他说明" :rows="4" />
			</a-form-item>
			<div class="title">减免规则</div>
			<a-form-item label="减免规则" name="data.discountList" v-bind="validateInfos[`data.discountList`]" :wrapper-col="{ span: 12 }">
				<EditRuleTable :tableList="formData.data.discountList" @del-rule-obj="delRuleObj" @add-rule-obj="addRuleObj" />
			</a-form-item>

			<div class="footer">
				<div class="tooter-btn">
					<a-button type="primary" @click.prevent="onSubmit">保存</a-button>
					<a-button type="primary" @click.prevent="route.back()">取消</a-button>
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
import timePicker from '@/components/common/timePicker.vue';

const route = useRouter();

const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
interface formDataType {
	data: {
		oid: null | string;
		verificationType: null | number;
		scenicId: null | string;
		ticketName: null | string;
		orderTime: null | string;
		orderTimeRule: null | string;
		validTime: null | string;
		optionalVerificationCount: any;
		assistId: null | string;
		dayStock: null | string;
		wateryPrice: any;
		price: any;
		ticketDesc: null | string;
		restsExplain: null | string;
		itemList: any[];
		discountList: any[];
	};
}
// 数据
const formData = reactive<formDataType>({
	data: {
		oid: null, //新增时需要传主键
		verificationType: null, //核销类型
		scenicId: null, //关联景区id
		ticketName: null, //门票名称
		orderTime: null, //预约时间 单位:时分
		orderTimeRule: null, //预约时间规则:0-当日,1-次日
		validTime: null, //有效期 1~7
		// optionalVerificationCount: null, //非必核销次数【多点核销必传】
		assistId: null, //辅助核销id
		dayStock: null, //门票日库存
		wateryPrice: null, //水牌价
		price: null, //售价
		ticketDesc: '', //单票说明
		restsExplain: '', //其他说明
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
//类型
const type = computed(() => {
	return route.currentRoute.value?.query?.t;
});
const pageStatus = computed(() => {
	return route.currentRoute.value?.query?.s;
});
const first = ref(false);

// const isShow = computed(() => {
// 	return first.value && type.value == '1' && typeof formData.data.optionalVerificationCount !== 'number';
// });
const validItemList = (rule: any, value: any) => {
	if (first.value) {
		let isCreateSignle = value[0]?.init || false;
		if (value.length > 0 && isCreateSignle) {
			return Promise.reject('请选择核销项目并填写可核销次数');
		}

		if (value.length === 0 && !isCreateSignle) {
			return Promise.reject('请选择核销项目并填写可核销次数');
		}

		let verificationNumberSub = value.filter((i: any) => typeof i.verificationNumber !== 'number'),
			len = verificationNumberSub.length;
		// console.log(verificationNumberSub, len, 'len', this, !isCreateSignle && len > 0 && formData.data.optionalVerificationCount);

		if (isCreateSignle && len > 0) {
			return Promise.reject('请选择核销项目并填写可核销次数');
		}

		if (!isCreateSignle && len) {
			return Promise.reject('请填写可核销次数');
		}

		return Promise.resolve();
	}
	return Promise.resolve();
};

// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(
	formData,
	reactive({
		'data.scenicId': [{ required: true, message: '请选择归属景区' }],
		'data.orderTimeRule': [{ required: true, message: '请选择可预定时间' }],
		'data.orderTime': [{ required: true, message: '请选择当日最晚可定票时间' }],
		'data.wateryPrice': [{ required: true, message: '请输入水牌价' }],
		'data.price': [{ required: true, message: '请输入价格' }],
		'data.ticketName': [{ required: true, message: '请输入门票名称' }],
		'data.validTime': [{ required: true, message: '请选择有效时间' }],
		'data.dayStock': [{ required: true, message: '请输入门票库存' }],
		'data.discountList': [{ required: true, message: '请填写减免规则' }],
		'data.itemList': [{ required: true, validator: validItemList }],
	})
);
//合并错误提示
const errorInfos = computed(() => {
	return mergeValidateInfo(toArray(validateInfos).splice(1, 2));
});
const errorPriceInfos = computed(() => {
	return mergeValidateInfo(toArray(validateInfos).splice(3, 2));
});

const tickerType = computed(() => (route.currentRoute.value?.query?.t === '0' ? '单票：单点核销' : '单票：多点核销'));
const formRef = ref();
// 提交
const onSubmit = async () => {
	// scrollToField((name: any, options: [any]) => {
	// 	console.log(name, options, 'asdasd');
	// });
	first.value = true;
	validate()
		.then(() => {
			// if (isShow.value) {
			// 	return;
			// }

			console.log(toRaw(formData.data), 'psss');
			// save(toRaw(formData.data));
			save(toRaw(formData.data));
			// route.currentRoute.value?.query?.s ? save(toRaw(formData.data)) : editInfo(toRaw(formData.data));
		})
		.catch((err) => {
			console.log('error', err, err.errorFields[0].name);
			//滚动跳转
			formRef.value.scrollToField(err.errorFields[0].name);
		});
};

const changePrice = (val: any) => {
	const { wateryPrice, price } = val;
	console.log('emit get ', val);

	formData.data.wateryPrice = wateryPrice ? Number((Number(wateryPrice.toFixed(2)) * 100).toFixed(2)) : null;
	formData.data.price = price ? Number((Number(price.toFixed(2)) * 100).toFixed(2)) : null;
};

// const getOptionalVerificationCount = (val: any) => {
// 	formData.data.optionalVerificationCount = val;
// 	// console.log('getOptionalVerificationCount', val, formData.data.optionalVerificationCount);
// };
// 保存
const save = async (params: object) => {
	let res = await api.saveSingleVoteInfo(params);
	message.success(res);
	route.push({ path: '/scenic-spot/singleVote/list' });
};
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

const delVerificationObj = (index: number) => {
	formData.data.itemList.splice(index, 1);
};

const addVerificationObj = (obj: any) => {
	if (!formData.data.itemList) {
		formData.data.itemList = [];
	}
	console.log(obj, 'addVerificationObj');

	formData.data.itemList = obj;

	// formData.data.itemList.push(obj);
};

const changeIv = (index: number) => {
	formData.data.itemList[index].ifVerification = !formData.data.itemList[index].ifVerification;
};

const addVerificationObjSign = (obj: any) => {
	formData.data.itemList = obj;
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
const editProjectTableRef = ref();
const initEditPage = async () => {
	navigatorBar.setNavigator(['景区信息管理', '编辑']);
	let res = await api.getScenicSpotSignleDetail(route.currentRoute.value?.query?.oid);
	formData.data = res;
	// type && editProjectTableRef.value.setValue(formData.data.optionalVerificationCount);
};

const initCreatePage = () => {
	navigatorBar.setNavigator(['景区信息管理', '新增']);
	formData.data.verificationType = route.currentRoute.value?.query?.t === '0' ? 0 : 1;
};

onMounted(() => {
	initPage();
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
		position: absolute;
		top: 10px;
	}
	.btn {
		position: absolute;
		right: -126px;
		bottom: -10px;
		margin-bottom: 10px;
		// top: 12px;
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
.iv-error-tips {
}
</style>
