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
				<a-select @change="handelChangeType" v-model:value="formState.ticketType" placeholder="请选择门票类型">
					<a-select-option :value="item.data" :name="item.typeName" v-for="item in ticketData.ticketType" :key="item.data">{{
						item.typeName
					}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="选择门票" name="ticketId" :rules="[{ required: true, message: '请选择门票' }]">
				<a-select @change="changeTicket" v-model:value="formState.ticketId" placeholder="请选择门票">
					<a-select-option :value="item.oid" :name="item.ticketName" v-for="item in ticketData.ticketList" :key="item.oid">{{
						item.ticketName
					}}</a-select-option>
				</a-select>
			</a-form-item>

			<!-- <a-form-item label="门票价格" name="travelName">
				<span>{{ accDiv(ticketPrice, 100) || 0 }}元</span>
			</a-form-item> -->
		</a-form>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { TicketType } from '@/enum';
import api from '@/api';
import { cloneDeep, debounce } from 'lodash';
import { accDiv, accMul } from '@/utils/compute';
const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
const route = useRoute();
const travelStore = useTravelStore();
const IDCard = computed(() => travelStore.IDCard);
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

const tableData = ref([]);
const ticketData = reactive<{ [k: string]: any }>({
	scenicList: [],
	ticketList: [],
});
const formState = reactive<{ [k: string]: any }>({
	itineraryId: '',
});

const handelChangeType = async (e: any) => {
	formState.ticketId = '';
	try {
		e && (ticketData.ticketList = await api.travelManagement.getTicketList(formState.scenicId, { ticketType: getTicketInitEnum(e) }));
	} catch (error) {
		ticketData.ticketList = [];
	}
	// if (e === TicketType.UNITE) {
	// 	formState.ticketId && getChildTicket(formState.ticketId, formState.startDate);
	// }
};

const ticketPrice = computed(() => {
	return ticketData.ticketList.filter((it: any) => it.oid === formState.ticketId)[0]?.price;
});

const getScenicList = async () => {
	ticketData.scenicList = await api.travelManagement.getScenicList();
};
const submit = async () => {
	try {
		let traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
		await formRef.value.validateFields();
		formState.unitPrice = ticketPrice.value;
		formState.itineraryId = route.query.oid || travelStore.templateOid;
		const newFormState = cloneDeep(formState);
		console.log(newFormState);

		// newFormState.reservePeopleCount = formState.peopleCount
		// newFormState.totalFee = newFormState.peopleCount * newFormState.unitPrice
		const res = await api.travelManagement.templateaddTicket(newFormState);
		// travelStore.setTicket(newFormState)
		travelStore.tempeleteSetTicket(newFormState, res, props.productRow.productId);
		// travelStore.setTicket(newFormState, res, props.productRow.productId);
	} catch (errorInfo) {}
};

const handleOk = async (callback: Function) => {
	try {
		await formRef.value.validateFields();
	} catch (error) {
		return callback(false);
	}
	await submit();
	api.travelManagement.saveChangeTraveldetail(route.query.oid ? route.query.oid : travelStore.templateOid).then((res: any) => {
		travelStore.scenicTickets = res.ticketList;
	});
	callback();
	return;
};

const handleChange = async (event: number, option: any) => {
	// formState.ticketId = '';
	// formState.scenicName = option.name;
	// ticketData.ticketList = await api.travelManagement.getTicketList(event);
	formState.ticketId = ''
		formState.scenicName = option.name;
		ticketData.childTicket = [];
		const ticketType = formState.ticketType || option.ticketType
        event && (ticketType || ticketType === 0) && 
		(ticketData.ticketList = await api.travelManagement.getTicketList(event, {ticketType: getTicketInitEnum(ticketType)}))
};

const getTicketInitEnum = (key: string) => {
		let data = 0
		key = key?.toString()
		switch(key) {
			case '1':
				data = 1
				break;
			case '2':
				data = 0
				break;
			case '3':
				data = 2
				break;
		}
		return data;
	}

const changeTicket = (event: number, option: any) => {
	formState.ticketName = option.name;
};

const getTicketType = async () => {
	const res = await api.travelManagement.getTicketType();
	ticketData.initTicketType = res;
	ticketData.ticketType = res.map((item: any) => {
		item.data = getTicketEnum(item.typeName);
		return item;
	});
	ticketData.ticketType = ticketData.ticketType.filter((it: any) => it.data !== TicketType.SHOW);
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

const emits = defineEmits(['update:modelValue']);
const dialogVisible = ref(false);
watch(
	() => props.modelValue,
	(newVal) => {
		dialogVisible.value = newVal;
	}
);
watch(dialogVisible, (newVal) => {
	console.log(newVal, props.ticketId);
	if (!newVal) {
		formRef.value.resetFields();
		for (let k in formState) {
			formState[k] = '';
		}
	} else {
		!props.productRow.productId &&
			props.ticketId &&
			api.travelManagement.templateTicketDetail(props.ticketId).then((res: any) => {
				handleChange(res.scenicId, { name: res.scenicName });
				for (let k in res) {
					formState[k] = res[k];
				}
			});
		formState.scenicId = props.productRow.productId;
		// props.productRow.productId && handleChange(props.productRow.productId, { name: props.productRow.scenicName });
	}
	emits('update:modelValue', newVal);
});

const getStock = (ticketId: number | string, endTime: string, startTime: string) => {
	api.travelManagement.getStock({
		ticketId,
		endTime,
		startTime,
	});
};
const debounceFun = debounce((ticketId: number | string, endTime: string, startTime: string) => {
	getStock(ticketId, endTime, startTime);
}, 500);

watch(
	() => [formState.ticketId, formState.startDate],
	([newHotelId, newallDate]) => {
		if (newHotelId && newallDate && newallDate) {
			debounceFun(newHotelId, newallDate, newallDate);
		}
	}
);
getScenicList();
getTicketType();
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
