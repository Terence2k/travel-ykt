<template>
	<BaseModal v-model="dialogVisible" title="选择预定酒店" :width="1100" :onOk="handleOk">
		<a-form ref="formRef" :model="formState" autocomplete="off" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
			<a-form-item label="选择星级" name="hotelStarId" :rules="[{ required: true, message: '请选择星级' }]">
				<a-select
					:disabled="productRow.productId && productRow.productId.toString() ? true : false"
					v-model:value="formState.hotelStarId"
					placeholder="请选择星级"
					@change="handleChange"
				>
					<a-select-option :value="item.oid" v-for="item in hotelData.hotelStart" :price="item.price" :key="item.oid" :name="item.starCode">{{
						item.starCode
					}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="选择酒店" name="hotelId" :rules="[{ required: true, message: '请选择酒店' }]">
				<a-select
					:disabled="productRow.productId && productRow.productId.toString() ? true : false"
					v-model:value="formState.hotelId"
					placeholder="请选择酒店"
					@change="handleHotel"
				>
					<a-select-option :value="item.oid" v-for="item in hotelData.hotel" :key="item.oid" :name="item.hotelName">{{
						item.hotelName
					}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="行程人数">
				<span>{{ travelStore.touristList.length }}人</span>
			</a-form-item>
			<a-form-item label="诚信指定价">
				<span>{{ honestyGuidePrice }}元</span>
			</a-form-item>

			<a-form-item label="入住日期" name="arrivalDate" :rules="[{ required: true, message: '请选择入住日期' }]">
				<picker
					style="width: 100%"
					placeholder="请选择入住时间"
					:disabled-date="travelStore.setDisabled"
					@change="handleChangCheckIn"
					value-format="YYYY-MM-DD HH:mm:ss"
					v-model="formState.arrivalDate"
				/>
			</a-form-item>

			<a-form-item label="离店日期" name="departureDate" :rules="[{ required: true, message: '请选择离店日期' }]">
				<picker
					style="width: 100%"
					:disabled-date="disLeave"
					placeholder="请先选择入住时间"
					value-format="YYYY-MM-DD HH:mm:ss"
					v-model="formState.departureDate"
				/>
			</a-form-item>
			<div v-for="(room, index) in formState.roomTypeList" :key="index">
				<h3>房型{{ index + 1 }}</h3>
				<a-form-item label="预定房型" :name="['roomTypeList', index, 'hotelRoomTypeId']" :rules="[{ required: true, message: '请选择预定房型' }]">
					<a-select
						@change="(e: any, option: any) => changeRoomType(e, option, index)"
						v-model:value="room.hotelRoomTypeId"
						placeholder="请选择预定房型"
					>
						<a-select-option
							:value="item.oid"
							v-for="item in hotelData.roomType"
							:name="item.roomTypeName"
							:key="item.oid"
							:stockNum="item.stockNum"
							:num="item.roomOccupancyNum"
							>{{ item.roomTypeName }}</a-select-option
						>
					</a-select>
				</a-form-item>
				<a-form-item
					label="订房数量"
					:name="['roomTypeList', index, 'roomCount']"
					:rules="[{ required: true, validator: (_rule: Rule, value: string) => validateCheckNum(_rule, value, index) }]"
				>
					<a-input v-model:value="room.roomCount" />
				</a-form-item>
				<!-- <a-form-item
					label="入住总人数"
					:name="['roomTypeList', index, 'checkInNumber']"
					:rules="[{ required: true, validator: (_rule: Rule, value: string) => validateCheckIn(_rule, value, index) }]"
				>
					<div class="d-flex">
						<a-input v-model:value="room.checkInNumber" />
					</div>
				</a-form-item> -->
				<a-form-item
					label="单价"
					:name="['roomTypeList', index, 'unitPrice']"
					:wrapper-col="{ span: 16 }"
					:rules="[{ required: true, message: '请输入您与酒店线下协商好的价格' }]"
				>
					<div class="d-flex align-item-center">
						<div style="width: 500px">诚信指导价：{{ honestyGuidePrice }}元 +</div>
						<a-input @change="handleMoeny(index, room.unitPrice)" v-model:value="room.unitPrice" placeholder="请输入您与酒店线下协商好的价格" />
						<div style="width: 200px; text-align: right; margin-right: 30px">{{ formState.roomTypeList[index].orderAmount }}元</div>
						<div class="d-flex" style="margin-left: 32px">
							<a-button @click="delRoom(index)" :class="{ visable: formState.roomTypeList.length === 1 }">删除</a-button>
							<a-button
								:class="{ visable: formState.roomTypeList.length - 1 !== index }"
								type="primary"
								style="margin-left: 16px; margin-right: 12px"
								@click="addRoom"
								>增加房型</a-button
							>
						</div>
					</div>
				</a-form-item>
			</div>

			<a-form-item label="订单金额">
				<a-input v-model:value="formState.orderFee" disabled placeholder="无需填写，填写房间数量后自动计算" />
				<span class="gary">如果符合满16减1标准，则自动优惠减扣。</span>
			</a-form-item>

			<a-form-item label="订单编号">
				<a-input v-model:value="formState.hotelOrderNo" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>

			<a-form-item label="订单生成时间">
				<a-input v-model:value="formState.createTime" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>
		</a-form>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { cloneDeep, debounce } from 'lodash';
import { useTravelStore } from '@/stores/modules/travelManagementDetail';
import { message } from 'ant-design-vue/es';
import { Rule } from 'ant-design-vue/es/form';
import dayjs, { Dayjs } from 'dayjs';
import { selectSpecialDateRange } from '@/utils';
import { accDiv, accMul } from '@/utils/compute';
import { validateRules, validateFields, generateGuid } from '@/utils';
import picker from '@/components/common/datePicker.vue'

const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
const route = useRoute();
const roomList = {
	checkInNumber: '', //入住人数
	hotelRoomTypeId: '', //房型id
	unitPrice: 0, //房型单价
	roomCount: '', //订房数量
	roomTypeName: '', //房型名称
	orderAmount: 0,
};
const travelStore = useTravelStore();
const formRef = ref();

let disLeave = ref((current: Dayjs) => {
	return (current && current < dayjs().subtract(1, 'day')) || current > dayjs().startOf('day');
});

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	hotelId: {
		type: String,
		default: '',
	},
	productRow: {
		type: Object,
		default: {},
	},
});
// 酒店数据
const hotelData = reactive<{ [k: string]: any }>({
	hotelStart: [],
	hotel: [],
	roomType: [],
});
// 表单填写数据
let formState = reactive<{ [k: string]: any }>({
	hotelStarId: '',
	hotelId: '',
	arrivalDate: '',
	leaveTime: '',
	enterTime: '',
	roomTypeList: [{ ...roomList }],
	honestyGuidePrice: '',
});
let contrastdata = reactive({} as any);
const honestyGuidePrice = computed(() => accDiv(formState.honestyGuidePrice, 100));

const addRoom = () => {
	const room = cloneDeep(roomList);
	room.orderAmount = honestyGuidePrice.value;
	formState.roomTypeList.push({ ...room });
};
const delRoom = (index: number) => {
	formState.roomTypeList.splice(index, 1);
};

const handleHotel = (e: any, option: any) => {
	formState.hotelName = option.name;
};

const handleChangCheckIn = () => {
	disLeave.value = (current: Dayjs): any =>
		(current && current < dayjs(formState.arrivalDate).add(1, 'day')) || (dayjs(travelStore.teamTime[1]).add(1, 'day') < current && current);
	const isAfter = dayjs(dayjs(formState.arrivalDate)).isAfter(dayjs(formState.departureDate).subtract(1, 'day'));
	if (formState.departureDate && isAfter) {
		formState.departureDate = '';
	}
};

const changeRoomType = (e: any, option: any, index: number) => {
	formState.roomTypeList[index].roomOccupancyNum = option.num;
	formState.roomTypeList[index].roomTypeLimitPeople = option.num;
	formState.roomTypeList[index].stockNum = option.stockNum;
	formState.roomTypeList[index].roomTypeName = option.name;
	formState.roomTypeList[index].roomTypeId = option.key;
};

const getHotelStarList = async () => {
	hotelData.hotelStart = await api.commonApi.getHotelStarList();
};
const handleMoeny = (i: number, e: string) => {
	formState.roomTypeList[i].orderAmount = honestyGuidePrice.value + parseFloat(e) || honestyGuidePrice.value;
};

const handleChange = async (id: number, option: any) => {
	formState.honestyGuidePrice = option.price;
	formState.hotelStarCode = option.name;
	hotelData.hotel = await api.getHotelInfoByRated(id);
	for (let i = 0; i < formState.roomTypeList?.length; i++) {
		formState.roomTypeList[i].orderAmount = honestyGuidePrice.value + parseFloat(formState.roomTypeList[i].unitPrice);
	}
};

// 订房数量校验
const validateCheckNum = async (_rule: Rule, value: string, index: number) => {
	if (value === '') {
		return Promise.reject('请输入预定房间数量');
	} else if (Number(value) > formState.roomTypeList[index].stockNum) {
		return Promise.reject('预定房间数量超过最大库存');
	} else {
		return Promise.resolve();
	}
};

// 入住总人数校验
const validateCheckIn = async (_rule: Rule, value: string, index: number) => {
	if (value === '') {
		return Promise.reject('请输入入住总人数');
	} else if (Number(value) < formState.roomTypeList[index].roomCount) {
		return Promise.reject('入住人数不能低于房间数量');
	} else if (Number(value) > formState.roomTypeList[index].roomCount * formState.roomTypeList[index].roomOccupancyNum) {
		return Promise.reject('入住人数不能大于预定房间可住人数');
	} else {
		return Promise.resolve();
	}
};
/**
 *
 * @param data 数据源
 * @param startDate 开始
 * @param endDate 结束
 * @return amount 总价
 */
const getOrderAmount = (data: Array<{ [k: string]: any }>, startDate: string, endDate: string) => {
	const day = dayjs(endDate).diff(startDate, 'day');
	const amount = [];
	for (let k = 0; k < data.length; k++) {
		amount[k] = data[k].orderAmount * data[k].roomCount * day;
	}
	return amount.reduce((prev, next) => prev + next);
};

const submit = async () => {
	try {
		let traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
		console.log('formState.roomTypeList:', formState.roomTypeList);
		formState.roomTypeList = formState.roomTypeList.map((it: any) => {
			it.unitPrice = it.unitPrice * 100;
			it.orderAmount = it.orderAmount * 100;
			it.reserveNumber = it.roomCount
			return it;
		});
		formState.scheduledNumber = formState.roomTypeList.map((it: any) => Number(it.checkInNumber)).reduce((prev: any, current: any) => prev + current);
		formState.scheduledRooms = formState.roomTypeList.map((it: any) => Number(it.roomCount)).reduce((prev: any, current: any) => prev + current);
		formState.tripNumber = travelStore.touristList.length;
		formState.itineraryId = route.query.oid || traveListData.oid;
		formState.orderAmount = getOrderAmount(formState.roomTypeList, formState.arrivalDate, formState.departureDate);
		const key = generateGuid();
		if (!formState.oid) {
			formState.key = key;
		}
		if (
			(formState.oid && contrastdata.hotelStarId != formState.hotelStarId) ||
			contrastdata.hotelId != formState.hotelId ||
			contrastdata.arrivalDate != formState.arrivalDate ||
			contrastdata.departureDate != formState.departureDate ||
			contrastdata.hotelRoomTypeId != formState.hotelRoomTypeId ||
			contrastdata.roomCount != formState.roomCount ||
			contrastdata.unitPrice != formState.unitPrice
		) {
			formState.edit = true;
		}
		const newFormState = cloneDeep(formState);
		newFormState.startDate = newFormState.arrivalDate;
		newFormState.endDate = newFormState.departureDate;
		newFormState.hotelStar = newFormState.hotelStarCode;
		newFormState.orderFee = newFormState.orderAmount;
		newFormState.editstatus = true;
		newFormState.reservePeopleCount = newFormState.roomTypeList
			.map((it: any) => Number(it.checkInNumber))
			.reduce((prev: number, next: number) => prev + next);
		newFormState.roomCount = newFormState.roomTypeList.map((it: any) => Number(it.roomCount)).reduce((prev: number, next: number) => prev + next);
		console.log('newFormState.roomTypeList:', newFormState.roomTypeList);

		travelStore.SetHotels(newFormState, formState.oid || null, props.productRow.key);
	} catch (errorInfo) {
	}
};

const handleOk = async (callback: Function) => {
	try {
		await formRef.value.validateFields();
	} catch (error) {
		return callback(false);
	}
	const res = selectSpecialDateRange(formState.arrivalDate, formState.departureDate, formState.hotelId);
	if (!res) {
		await submit();
		callback();
		return;
	}
};

const getRoomType = async (hotelId: number | string, leaveTime: string, enterTime: string) => {
	hotelData.roomType = await api.getRoomType({
		hotelId,
		leaveTime,
		enterTime,
	});
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
	if (newVal) {
		console.log(props.productRow);

		const data = cloneDeep(props.productRow);
		for (let k in data) {
			formState[k] = data[k];
		}
		if (props.productRow) {
			contrastdata = props.productRow;
		}
		formState.arrivalDate = data.startDate;
		formState.departureDate = data.endDate;
		if (props.productRow.hotelId) {
			let price = hotelData.hotelStart.filter((it: any) => it.oid == data.hotelStarId)[0].price;
			handleChange(data.hotelStarId, { name: data.hotelStar, price: price });
		}
		if (formState.roomTypeList.length) {
			formState.roomTypeList = formState?.roomTypeList?.map((it: any) => {
				it.roomCount = it.roomCount;
				it.roomTypeLimitPeople = it.limitPeople;
				it.roomTypeName = it.roomTypeName;
				it.hotelRoomTypeId = it.roomTypeId;
				it.unitPrice = it.unitPrice / 100;
				return it;
			});
		}

		getRoomType(props.productRow.hotelId, formState.endData, formState.startData);
		formState.orderFee = accDiv(data.orderFee, 100) || '无需填写，提交审核后自动计算';
		formState.roomCount = data.roomCount;
		formState.hotelId = props.productRow.hotelId;
		formState.hotelName = props.productRow.hotelName;
	} else {
		for (let k in formState) {
			if (k === 'roomTypeList') {
				formState[k] = [{ ...roomList }];
			} else {
				formState[k] = '';
			}
		}
	}
	emits('update:modelValue', newVal);
});

const debounceFun = debounce((hotelId: number | string, leaveTime: string, enterTime: string) => {
	getRoomType(hotelId, leaveTime, enterTime);
}, 500);

watch(
	() => [formState.hotelId, formState.arrivalDate, formState.departureDate],
	([newHotelId, newArrivalDate, newDepartureDate]) => {
		if (newHotelId && newDepartureDate && newArrivalDate) {
			debounceFun(newHotelId, newDepartureDate, newArrivalDate);
		}
	}
);

getHotelStarList();
</script>

<style lang="less" scoped>
.visable {
	visibility: hidden;
}
.gary {
	color: #7f7f7f;
	font-size: 12px;
}
</style>
>
