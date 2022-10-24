<template>
	<BaseModal v-model="dialogVisible" title="选择预定酒店" :width="900" :onOk="handleOk">
		<a-form ref="formRef" :model="formState" autocomplete="off" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
			<a-form-item label="选择星级" name="travelOperatorOid" :rules="[{ required: true, message: '请选择星级' }]">
				<a-select v-model:value="formState.travelOperatorOid" placeholder="请选择星级" @change="handleChange">
					<a-select-option :value="item.oid" v-for="item in hotelData.hotelStart" :price="item.price" :key="item.oid">{{ item.starCode }}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="选择酒店" name="hotelId" :rules="[{ required: true, message: '请选择酒店' }]">
				<a-select v-model:value="formState.hotelId" placeholder="请选择酒店">
					<a-select-option :value="item.oid" v-for="item in hotelData.hotel" :key="item.oid">{{ item.hotelName }}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="行程人数">
				<span>{{travelStore.touristList.length}}人</span>
			</a-form-item>
			<a-form-item label="诚信指定价">
				<span>{{formState.honestyGuidePrice / 100}}元</span>
			</a-form-item>

			<a-form-item label="入住日期" name="arrivalDate" :rules="[{ required: true, message: '请选择入住日期' }]">
				<a-date-picker style="width: 100%"
					:show-time="{ format: 'HH:mm:ss' }" 
					format="YYYY-MM-DD HH:mm:ss" 
					value-format="YYYY-MM-DD HH:mm:ss" 
					v-model:value="formState.arrivalDate" />
			</a-form-item>

			<a-form-item label="离店日期"
				name="departureDate" 
				:rules="[{ required: true, message: '请选择离店日期' }]">
				<a-date-picker style="width: 100%" 
					:show-time="{ format: 'HH:mm:ss' }"  
					format="YYYY-MM-DD HH:mm:ss" 
					value-format="YYYY-MM-DD HH:mm:ss" 
					v-model:value="formState.departureDate" />
			</a-form-item>
			<div v-for="(room, index) in formState.roomTypeList" :key="index">
				<h3>房型{{ index + 1 }}</h3>
				<a-form-item label="预定房型" :name="['roomTypeList', index, 'hotelRoomTypeId']" :rules="[{ required: true, message: '请选择预定房型' }]">
					<a-select v-model:value="room.hotelRoomTypeId" placeholder="请选择组团社做团人">
						<a-select-option :value="item.oid" v-for="item in hotelData.roomType" :name="item.roomTypeName" :key="item.oid">{{ item.roomTypeName }}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="订房数量" :name="['roomTypeList', index, 'reserveNumber']" :rules="[{ required: true, message: '请选择订房数量' }]">
					<a-input v-model:value="room.reserveNumber" />
				</a-form-item>
				<a-form-item
					label="入住总人数"
					:name="['roomTypeList', index, 'checkInNumber']"
					:rules="[{ required: true, message: '请选择入住人数' }]"
				>
					<div class="d-flex">
						<a-input v-model:value="room.checkInNumber" />
					</div>
				</a-form-item>
				<a-form-item
					label="单价"
					:name="['roomTypeList', index, 'orderAmount']"
					:wrapper-col="{ span: 16 }"
					:rules="[{ required: true, message: '请输入您与酒店线下协商好的价格' }]"
				>
					<div class="d-flex">
						<a-input v-model:value="room.orderAmount" placeholder="请输入您与酒店线下协商好的价格" />
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
				<a-input v-model:value="formState.enterTime" disabled placeholder="无需填写，填写房间数量后自动计算" />
				<span class="gary">如果符合满16减1标准，则自动优惠减扣。</span>
			</a-form-item>

			<a-form-item label="订单编号">
				<a-input v-model:value="formState.enterTime" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>

			<a-form-item label="订单生成时间">
				<a-input v-model:value="formState.enterTime" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>
		</a-form>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { debounce } from 'lodash';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { message } from 'ant-design-vue/es';
const roomList = {
	checkInNumber: '', //入住人数
	hotelRoomTypeId: '', //房型id
	orderAmount: '', //房型单价
	reserveNumber: '', //订房数量
	roomTypeName: "" //房型名称
};
const travelStore = useTravelStore()
const formRef = ref();
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
});
// 酒店数据
const hotelData = reactive({
	hotelStart: [],
	hotel: [],
	roomType: [],
});
// 表单填写数据
const formState = reactive<{[k: string]: any}>({
	travelOperatorOid: '',
	hotelId: '',
	leaveTime: '',
	enterTime: '',
	roomTypeList: [{ ...roomList }],
	honestyGuidePrice: ''
});

const addRoom = () => {
	formState.roomTypeList.push({ ...roomList });
};
const delRoom = (index: number) => {
	formState.roomTypeList.splice(index, 1);
};

const getHotelStarList = async () => {
	hotelData.hotelStart = await api.getHotelStarList();
};

const handleChange = async (id: number, option: any) => {
	formState.honestyGuidePrice = option.price
	hotelData.hotel = await api.getHotelInfoByRated(id);
};

const handleOk = async (callback: Function) => {
	try {
		await formRef.value.validateFields();
		await api.travelManagement.reserveHotel(formState);
		message.success('新增成功');
		callback();
	} catch (errorInfo) {
		callback(false);
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
	if (!newVal) {
		formRef.value.resetFields();
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
