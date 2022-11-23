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
			<div v-for="(room, index) in formState.roomTypeList" :key="index">
				<h3>房型{{ index + 1 }}</h3>
				<a-form-item label="预定房型" :name="['roomTypeList', index, 'roomTypeId']" :rules="[{ required: true, message: '请选择预定房型' }]">
					<a-select
						@change="(e: any, option: any) => changeRoomType(e, option, index)"
						v-model:value="room.roomTypeId"
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
					label=""
					:name="['roomTypeList', index]"
					:wrapper-col="{ span: 16 }"
					:rules="[{ required: true, message: '请输入您与酒店线下协商好的价格' }]"
				>
					<div class="d-flex align-item-center">
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
		</a-form>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { cloneDeep, debounce } from 'lodash';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { message } from 'ant-design-vue/es';
import { Rule } from 'ant-design-vue/es/form';
import dayjs, { Dayjs } from 'dayjs';
import { selectSpecialDateRange } from '@/utils';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
const route = useRoute();
const roomList = {
	roomTypeName: '', //房型名称
	roomTypeId:'',
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
	honestyGuidePrice: '',
	hotelId: '',
	hotelName:'',
	hotelStarId:'',
	itineraryId:'',
	roomTypeList: [{ ...roomList }],
});
const honestyGuidePrice = computed(() => formState.honestyGuidePrice / 100);

const addRoom = () => {
	formState.roomTypeList.push({ ...roomList });
};
const delRoom = (index: number) => {
	formState.roomTypeList.splice(index, 1);
};

const handleHotel = async (e: any, option: any) => {
	console.log(e, option);

	formState.hotelName = option.name;
	hotelData.roomType = await api.getRoomDetailInfo({}, formState.hotelId);
};

const changeRoomType = (e: any, option: any, index: number) => {
	// formState.roomTypeList[index].roomTypeId = option.key;	
	formState.roomTypeList[index].roomTypeName = option.name;
};

const getHotelStarList = async () => {
	hotelData.hotelStart = await api.commonApi.getHotelStarList();
};

const handleChange = async (id: number, option: any) => {
	formState.honestyGuidePrice = option.price;
	formState.hotelStar = option.name;
	formState.hotelStarId = option.key;
	hotelData.hotel = await api.getHotelInfoByRated(id);
};

/**
 *
 * @param data 数据源
 * @param startDate 开始
 * @param endDate 结束
 * @return amount 总价
 */

const submit = async () => {
	try {
		// formState.scheduledRooms = formState.roomTypeList.map((it: any) => Number(it.reserveNumber)).reduce((prev: any, current: any) => prev + current);
		formState.itineraryId = route.query.oid || traveListData.oid;

		const newFormState = cloneDeep(formState);
		console.log(newFormState);
		
		// newFormState.hotelStar = newFormState.hotelStarCode;
		// newFormState.reservePeopleCount = newFormState.roomTypeList
		// 	.map((it: any) => Number(it.checkInNumber))
		// 	.reduce((prev: number, next: number) => prev + next);
		// newFormState.roomCount = newFormState.roomTypeList.map((it: any) => Number(it.reserveNumber)).reduce((prev: number, next: number) => prev + next);
		console.log(formState);
		
		const res = await api.travelManagement.templateaddHotel(formState);

		// message.success('新增成功');

		travelStore.setHotels(newFormState, res, props.productRow.productId);
		// callback()
	} catch (errorInfo) {
		// callback(false);
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

const getRoomType = async (hotelId: number) => {
	hotelData.roomType = await api.getRoomDetailInfo({}, hotelId);
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
		formRef.value.resetFields();
		for (let k in formState) {
			if (k === 'roomTypeList') {
				formState[k] = [{ ...roomList }];
			} else {
				formState[k] = '';
			}
		}
		console.log(formState);
	} else {
		!props.productRow.productId &&
			props.hotelId &&
			api.travelManagement.hotelDetail(props.hotelId).then((res: any) => {
				for (let k in res) {
					formState[k] = res[k];
				}
				formState.arrivalDate = res.startDate;
				formState.departureDate = res.endDate;
				let price = hotelData.hotelStart.filter((it: any) => it.oid == res.hotelStarId)[0].price;
				handleChange(res.hotelStarId, { name: res.hotelStar, price: price });
				formState.roomTypeList = formState.roomTypeList.map((it: any) => {
					it.reserveNumber = it.roomCount;
					it.roomTypeLimitPeople = it.limitPeople;
					// it.checkInNumber = it.roomCount
					it.oid = it.roomTypeId;
					return it;
				});
			});
		formState.hotelId = props.productRow.productId;
		formState.hotelName = props.productRow.hotelName;

		props.productRow.productId &&
			api.travelManagement.getGuidePriceStarCodeByHotelId(props.productRow.productId).then((res: any) => {
				formState.hotelStarId = res.oid;
				handleChange(res.oid, { price: res.price, name: res.starCode });
			});
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
