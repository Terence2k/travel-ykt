<template>
	<BaseModal v-model="dialogVisible" title="添加景区门票" :width="1000" :onOk="handleOk">
		<a-form ref="formRef" :model="formState" autocomplete="off" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
			<a-form-item label="选择景区" name="scenicId" :rules="[{ required: true, message: '请选择景区' }]">
				<a-select
					:disabled="productRow.productId && productRow.productId.toString() ? true : false"
					v-model:value="formState.scenicId"
					placeholder="请选择景区"
					@change="handleChange"
				>
					<a-select-option :value="item.ticketId" :name="item.ticketName" v-for="item in ticketData.scenicList" :key="item.ticketId">{{
						item.ticketName
					}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="门票类型" name="ticketType" :rules="[{ required: true, message: '请选择门票类型' }]">
				<a-select @change="handelChangeType" v-model:value="formState.ticketType" placeholder="请先选择景区">
					<a-select-option :value="item.data" :name="item.typeName" v-for="item in ticketData.ticketType" :key="item.data">{{
						item.typeName
					}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="入园日期" name="startDate" :rules="[{ required: true, message: '请选择入园日期' }]">
				<picker
					:disabled-date="travelStore.setDisabledTime()"
					style="width: 100%"
					v-model="formState.startDate"
					value-format="YYYY-MM-DD"
					placeholder="请选择入园日期"
					type="date"
				/>
			</a-form-item>

			<a-form-item label="选择门票" name="ticketId" :rules="[{ required: true, message: '请选择门票' }]">
				<a-select @change="changeTicket" v-model:value="formState.ticketId" placeholder="请选择门票">
					<a-select-option :value="item.oid" :name="item.ticketName" v-for="item in ticketData.ticketList" :key="item.oid">{{
						item.ticketName
					}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="行程人数" name="travelName">
				<span>{{ travelStore.touristList.length }}人</span>
			</a-form-item>

			<a-form-item label="门票价格" name="travelName">
				<span>{{ accDiv(ticketPrice, 100) || '' }}元</span>
			</a-form-item>

			<div v-if="formState.ticketType === TicketType.SHOW || formState.ticketType === TicketType.UNITE">
				<a-form-item label="子票详情" name="ticketId" :rules="[{ required: true, message: '选择座位' }]"> </a-form-item>
				<CommonTable v-if="formState.ticketType === TicketType.UNITE" :columns="columns" :dataSource="ticketData.childTicket" :scrollY="false">
					<template #bodyCell="{ column, text, index, record }">
						<template v-if="column.key === 'action'">
							<a @click="dialogVisibleTicket = true">选择座位分区</a>
						</template>
					</template>
				</CommonTable>
				<selectTicket v-if="formState.ticketType === TicketType.SHOW"></selectTicket>
			</div>
			<a-form-item label="" v-if="formState.ticketType === TicketType.SHOW || formState.ticketType === TicketType.UNITE"> </a-form-item>

			<a-form-item label="订单金额">
				<a-input v-model:value="countMoney" disabled placeholder="无需填写，勾选人员名单后自动计算" />
			</a-form-item>

			<a-form-item label="订单编号">
				<a-input v-model:value="formState.ticketOrderNo" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>

			<a-form-item label="订单生成时间">
				<a-input v-model:value="formState.createTime" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>
		</a-form>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import { useTravelStore } from '@/stores/modules/travelManagementDetail';
import selectTicket from './selectTicket.vue';
import api from '@/api';
import { cloneDeep, debounce } from 'lodash';
import { validateRules, validateFields, generateGuid } from '@/utils';
import { accDiv, accMul } from '@/utils/compute';
import picker from '@/components/common/datePicker.vue';
import { TicketType } from '@/enum';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

// const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any ) || {}
const route = useRoute();
const travelStore = useTravelStore();
const formRef = ref();
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	ticketId: {
		type: String,
		default: '',
	},
	productRow: {
		type: Object,
		default: {},
	},
});

const dialogVisibleTicket = ref(false);
const tableData = ref([]);
const ticketData = reactive<{ [k: string]: any }>({
	scenicList: [],
	ticketList: [],
	ticketType: [],
	childTicket: [],
});
const formState = reactive<{ [k: string]: any }>({
	ticketId: '',
	startDate: '',
	endData: '',
	count: '',
	orderFee: '',
});

const columns: any = [
	{
		title: '子票名称',
		dataIndex: 'subTicketName',
		key: 'subTicketName',
	},
	{
		title: '票种',
		dataIndex: 'subTicketTypeName',
		key: 'subTicketTypeName',
	},
	{
		title: '可用库存',
		dataIndex: 'subTicketStock',
		key: 'subTicketStock',
	},
	{
		title: '单价（元）',
		dataIndex: 'subTicketPrice',
		key: 'subTicketPrice',
	},
	{
		title: '是否有减扣',
		dataIndex: 'isHasDiscountName',
		key: 'isHasDiscountName',
	},
	// {
	//     title: '操作',
	//     dataIndex: 'action',
	//     key: 'action',
	// },
];
let contrastdata = reactive({} as any);
const countMoney = computed(() => accMul(accDiv(ticketPrice.value, 100), travelStore.touristList.length) || 0);
const ticketPrice = ref();

const getScenicList = async () => {
	ticketData.scenicList = await api.travelManagement.getScenicList();
};

// 获取子票详情
const getChildTicket = (ticketId: number | string, schoolDate: string) => {
	api.travelManagement
		.getChildTicket({
			ticketId,
			schoolDate,
		})
		.then((res: any) => {
			ticketData.childTicket = res.map((item: any) => {
				item.subTicketTypeName = ticketData.ticketType.filter((it: any) => it.data === item.subTicketType)[0]?.typeName;
				item.subTicketPrice = item.subTicketPrice / 100;
				item.isHasDiscountName = item.isHasDiscount ? '是' : '否';
				return item;
			});
		});
};

const handelChangeType = async (e: any) => {
	formState.ticketId = '';
	try {
		e && (ticketData.ticketList = await api.travelManagement.getTicketList(formState.scenicId, { ticketType: getTicketInitEnum(e) }));
	} catch (error) {
		ticketData.ticketList = [];
		ticketPrice.value = '';
	}
	if (e === TicketType.UNITE) {
		formState.ticketId && formState.startDate && getChildTicket(formState.ticketId, formState.startDate);
	}
};

const handleOk = async (callback: Function) => {
	try {
		await formRef.value.validateFields();
		formState.unitPrice = ticketPrice.value;
		formState.itineraryId = route.query.oid;
		formState.reservePeopleCount = travelStore.touristList.length;
		formState.orderFee = formState.reservePeopleCount * formState.unitPrice;
		if (formState.ticketType === TicketType.UNITE) {
			formState.childTicketIds = ticketData.childTicket.map((it: any) => it.subTicketId);
		} else {
			formState.childTicketIds = [];
		}
		const key = generateGuid();
		if (!formState.oid) {
			formState.key = key;
		}
		if (
			(formState.oid && contrastdata.ticketId != formState.ticketId) ||
			contrastdata.scenicId != formState.scenicId ||
			contrastdata.startDate != formState.startDate
		) {
			formState.edit = true;
		}
		const newFormState = cloneDeep(formState);
		newFormState.reservePeopleCount = formState.reservePeopleCount;
		travelStore.setTicket(newFormState, formState.oid ? formState.oid : null, props.productRow.key);
		callback();
	} catch (errorInfo) {
		callback(false);
	}
};

const getTicketInitEnum = (key: string) => {
	let data = 0;
	key = key?.toString();
	switch (key) {
		case '1':
			data = 1;
			break;
		case '2':
			data = 0;
			break;
		case '3':
			data = 2;
			break;
	}
	return data;
};

// 获取门票类型
const getTicketType = async () => {
	const res = await api.travelManagement.getTicketType();
	ticketData.initTicketType = res;
	ticketData.ticketType = res.map((item: any) => {
		item.data = getTicketEnum(item.typeName);
		return item;
	});
	ticketData.ticketType = ticketData.ticketType.filter((it: any) => it.data !== TicketType.SHOW);
};

const handleChange = async (event: number, option: any) => {
	formState.ticketId = '';
	formState.scenicName = option.name;
	ticketData.childTicket = [];
	const ticketType = formState.ticketType || option.ticketType;
	event &&
		(ticketType || ticketType === 0) &&
		(ticketData.ticketList = await api.travelManagement.getTicketList(event, { ticketType: getTicketInitEnum(ticketType) }));
};

const getTicketEnum = (key: string) => {
	let data = 0;
	switch (key) {
		case '单票':
			data = 1;
			break;
		case '联票':
			data = 2;
			break;
		case '演出票':
			data = 3;
			break;
	}
	return data;
};

const changeTicket = (event: number, option: any) => {
	formState.ticketName = option.name;
};

const emits = defineEmits(['update:modelValue']);
const dialogVisible = ref(false);
watch(
	() => props.modelValue,
	(newVal) => {
		dialogVisible.value = newVal;
	}
);
watch(dialogVisible, (newVal) => {
	if (!newVal) {
		// formRef.value.resetFields();
		for (let k in formState) {
			formState[k] = '';
		}
		ticketPrice.value = 0;
	} else {
		const data = props.productRow;
		if (props.productRow) {
			contrastdata = props.productRow;
		}
		for (let k in data) {
			formState[k] = data[k];
		}
		if (props.productRow.scenicId) {
			handleChange(data.scenicId, { name: data.scenicName, ticketType: data.ticketType });
			formState.ticketId = data.ticketId;
			formState.price = accDiv(data.unitPrice, 100);
			formState.scenicId = props.productRow.scenicId;
			props.productRow.productId &&
				handleChange(props.productRow.productId, { name: props.productRow.scenicName, ticketType: props.productRow.ticketType });
		}
	}
	emits('update:modelValue', newVal);
});

const getStock = async (ticketId: number | string, endTime: string, startTime: string) => {
	const res = await api.travelManagement.getStock({
		ticketId,
		endTime,
		startTime,
	});
	ticketPrice.value = res[0].ticketPrice;
};
const debounceFun = debounce((ticketId: number | string, endTime: string, startTime: string) => {
	getStock(ticketId, endTime, startTime);
	formState.ticketType === TicketType.UNITE && getChildTicket(ticketId, startTime);
}, 500);

watch(
	() => [formState.ticketId, formState.startDate],
	([newHotelId, newallDate]) => {
		if (newHotelId && newallDate && newallDate) {
			debounceFun(newHotelId, newallDate, newallDate);
		}
	}
);
getTicketType();
getScenicList();
</script>

<style lang="less" scoped>
.visable {
	visibility: hidden;
}
.table-area {
	padding: 0;
}
</style>
>
