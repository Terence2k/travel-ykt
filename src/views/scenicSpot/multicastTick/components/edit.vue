<template>
	<div class="editWrapper">
		<header>基本信息</header>
		<a-form class="" ref="formRef" :label-col="{ span: 3 }" labelAlign="left" :wrapper-col="{ span: 8 }">
			<a-form-item label="联票名称" name="data.ticketName" v-bind="validateInfos[`data.ticketName`]">
				<a-input v-model:value="formData.data.ticketName" placeholder="请填写景区名字" />
			</a-form-item>
			<a-form-item label="子票选择" name="scenicTicketListId" v-bind="validateInfos[`scenicTicketListId`]">
				<a-select
					v-model:value="formData.scenicTicketListId"
					:allowClear="true"
					mode="multiple"
					placeholder="请选择"
					@change="changeOption"
					:options="childrenTicketOption"
				>
				</a-select>
			</a-form-item>
			<a-form-item label="联票描述" v-bind="validateInfos[`data.ticketDesc`]">
				<a-textarea v-model:value="formData.data.ticketDesc" placeholder="请输入其他说明" :rows="4" />
			</a-form-item>
			<a-form-item label="联票减扣规则" name="data.discountList" v-bind="validateInfos[`data.discountList`]">
				<TableRule :tableList="formData.data.discountList" @del-rule-obj="delRuleObj" @add-rule-obj="addRuleObj" />
			</a-form-item>
			<a-form-item label="设置价格" v-bind="validateInfos[`data.scenicTicketList`]">
				<TablePrice
					:tableList="formData.data.scenicTicketList"
					:settlementModelList="settlementModelList"
					@set-calendar="setCalendar"
					@del-rule-obj="delRuleObj"
					@add-rule-obj="addRuleObj"
				/>
			</a-form-item>
			<a-form-item label="库存" name="data.dayStock" v-bind="validateInfos[`data.dayStock`]">
				<a-input v-model:value="formData.data.dayStock" placeholder="请填写库存" style="width: 200px; margin-right: 20px" />
				<a-button type="primary" @click.prevent="calendarInventory">编辑库存日历</a-button>
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
					<a-button type="primary" @click.prevent="route.back()">取消</a-button>
					<!-- <a-button type="primary" @click="onSubmit">提交审核</a-button> -->
				</div>
			</div>
		</a-form>
	</div>
	<InventoryCalendar ref="calendarRef" @set-calendar-invetory="setCalendarInvetory" />
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
import InventoryCalendar from './calendarInvetory.vue';

const route = useRouter();

const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
const scenicSpotOptions = useScenicSpotOption();

interface forDataType {
	name: string;
	scenicTicketListId: any[] | null;
	data: {
		oid: null | number;
		discountList: any[] | null;
		ticketName: null | string;
		scenicTicketList: any[];
		dayStock: string | number | null;
		ticketDesc: string | null;
		dateStockList: any[];
	};
}

// 数据
const formData = reactive<forDataType>({
	name: '',
	scenicTicketListId: [],
	data: {
		oid: null, //oid
		discountList: [],
		ticketName: null,
		scenicTicketList: [],
		dayStock: null,
		dateStockList: [],
		ticketDesc: null,
	},
});

// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formData,
	reactive({
		'data.ticketName': [{ required: true, message: '请填写联票名称' }],
		'data.dayStock': [{ required: true, message: '请填设置库存' }],

		'data.discountList': [{ required: true, message: '请填写联票规则' }],
		'data.ticketDesc': [{ required: true, message: '请填写联票描述' }],
		scenicTicketListId: [{ required: true, message: '请选择子票' }],
	})
);

//删除
const delRuleObj = (index: number) => {
	formData.data.discountList?.splice(index, 1);
};
const addRuleObj = (obj: any) => {
	if (String(formData.data.discountList) === 'null') {
		formData.data.discountList = [];
	}
	formData.data.discountList?.push(obj);
};

//库存日历
const calendarRef = ref();
const setCalendarInvetory = (value: any) => {
	formData.data.dateStockList = value;
};
//库存部分
const calendarInventory = (value: any) => {
	// InventoryIndex.value = index;
	calendarRef.value.open(formData.data.oid);
};

//新增-设置日历
const setCalendar = (val: any) => {
	console.log('获取日历信息', val);
	console.log('获取日历信息', val.index);
	formData.data.scenicTicketList[val.index].dateStockList = val.data;
	console.log(formData.data, 'save');
};

const enCluNumList = ref<number[]>([]);

const settlementModelList = ref<any>([]);
const changeOption = (arr: any) => {
	settlementModelList.value = [];
	console.log(arr, '22');
	let delId = enCluNumList.value.filter((speId) => !arr.includes(speId));
	console.log(delId, 'delId');
	let list = childrenTicketOption.value.filter((item: any) => arr.includes(item.ticketId));

	console.log(list, 'asda');
	formData.data.scenicTicketList = list.map((i: any, index: number) => {
		let isHad = settlementModelList.value?.filter((item: any) => item.value == i.scenicId);
		if (isHad.length === 0) {
			settlementModelList.value.push({ label: i.scenicName || `企业${index}`, value: i.scenicId });
		}

		return {
			sonOid: i.sonOid || i.oid, //子票id
			ticketId: i.ticketId, //被关联的票id
			ticketType: i.ticketType, //门票类型:0-联票，1-单票，2-演出票
			price: i.price || i.ticketPrice,
			ticketName: i.ticketName,
			settlementModel: i.settlementModel || null,
		};
	});

	childrenTicketOption.value = childrenTicketOption.value.filter((item) => {
		if (!delId.includes(item.value)) {
			return item;
		}
	});
	// console.log(res, 'oList');
};

const childrenTicketOption = ref<any>([]);
//初始化下拉列表
const initOption = async () => {
	let res = await api.getChildOption();
	childrenTicketOption.value = res.map((item: any) => {
		return {
			value: item.ticketId,
			label: item.ticketName,
			...item,
		};
	});
};
const formRef = ref();
// 提交
const onSubmit = async () => {
	validate()
		.then((res) => {
			console.log(toRaw(formData.data), 'psss', res);
			save(toRaw(formData.data));
		})
		.catch((err) => {
			//滚动跳转
			formRef.value.scrollToField(err.errorFields[0].name.toString());
		});
};
const save = async (params: object) => {
	let res = await api.createMultiple(params);
	if (res) {
		message.success('保存成功');
		route.push({ path: '/scenic-spot/multicast/list' });
		reset();
	}
};
const dealEditData = (value: any) => {
	// formData.data = value;
	let newOption: any[] = [],
		arr = value.scenicTicketList?.map((item: any) => {
			formData.scenicTicketListId?.push(item.ticketId);
			return {
				sonOid: item.sonOid, //子票id
				ticketId: item.ticketId, //被关联的票id
				ticketType: item.ticketType, //门票类型:0-联票，1-单票，2-演出票
				price: item.price,
				ticketName: item.ticketSonName,
				settlementModel: item.settlementModel || null,
			};
		});

	newOption = childrenTicketOption.value.map((option: any) => {
		let index = formData.scenicTicketListId?.indexOf(option.ticketId);
		if (Number(index) > -1) {
			return { ...arr[Number(index)], ...option, price: arr[Number(index)].price };
		} else {
			return option;
		}
	});

	let cIdArr = childrenTicketOption.value.map((o: any) => o.ticketId);

	let enCluArr = formData.scenicTicketListId?.filter((id) => cIdArr.indexOf(id) === -1);

	console.log(enCluArr, 'enCluArr');
	console.log(arr, 'arr');

	arr.map((option: any) => {
		if (enCluArr?.includes(option.ticketId)) {
			enCluNumList.value.push(option.ticketId);

			console.log(option.ticketId, 'had enClu');

			[].push.call(newOption, {
				// disabled: true,
				value: option.ticketId,
				label: option.ticketName,
				isCreate: true,
				...option,
			});
		}
	});
	console.log(newOption, 'newOption');

	childrenTicketOption.value = newOption;
	formData.data = value;
	formData.data.scenicTicketList = arr;
	changeOption(formData.scenicTicketListId);
};
// 重置
const reset = (): void => {
	resetFields();
};
//初始化页面
const initPage = async (): Promise<void> => {
	let statisStatus = route.currentRoute.value?.query?.t === '1';
	if (statisStatus) {
		let res = await api.getMultipleDetail(route.currentRoute.value?.query?.o);

		dealEditData(res);
	} else {
		navigatorBar.setNavigator(['景区管理', '票仓服务-联票', '新增']);
	}
};

// 自定义面包屑
onMounted(async () => {
	await initOption();
	await initPage();
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
