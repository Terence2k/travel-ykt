<template>
	<BaseModal v-model="dialogVisible" title="选择预定酒店" :width="1100" :onOk="handleOk">
		<a-form ref="formRef" :model="formState" autocomplete="off" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
			<a-form-item label="选择星级" name="hotelStarId" :rules="[{ required: true, message: '请选择星级' }]">
				<a-select 
					:disabled="productRow.productId &&
								productRow.productId.toString() ? true : false"
					v-model:value="formState.hotelStarId" placeholder="请选择星级" @change="handelChangeStart">
					<a-select-option 
						:value="item.oid" 
						v-for="item in hotelData.hotelStart" 
						:price="item.price" 
						:key="item.oid"
						:name="item.starCode">{{ item.starCode }}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="选择酒店" name="hotelId" :rules="[{ required: true, message: '请选择酒店' }]">
				<a-select 
					:disabled="productRow.productId &&
								productRow.productId.toString() ? true : false"
					v-model:value="formState.hotelId" placeholder="请选择酒店" @change="handleHotel">
					<a-select-option 
						:value="item.oid" v-for="item in hotelData.hotel" 
						:key="item.oid"
						:name="item.hotelName">{{ item.hotelName }}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="行程人数">
				<span>{{travelStore.touristList.length}}人</span>
			</a-form-item>
			<a-form-item label="诚信指定价">
				<span>{{honestyGuidePrice}}元</span>
			</a-form-item>

			<a-form-item label="入住日期" name="arrivalDate" :rules="[{ required: true, message: '请选择入住日期' }]">
				<!-- <a-date-picker style="width: 100%"
					:disabled-date="travelStore.setDisabled"
					@change="handleChangCheckIn"
					:show-time="{
							defaultValue: dayjs(`${travelStore.setStarEndHMS.start.hour} : ${travelStore.setStarEndHMS.start.min} : ${travelStore.setStarEndHMS.start.second}`, 'HH:mm:ss')
						}"
					dropdownClassName="hidden-date-picker"
					:disabled-time="disCheckInTime"
					format="YYYY-MM-DD HH:mm:ss" 
					value-format="YYYY-MM-DD HH:mm:ss" 
					v-model:value="formState.arrivalDate" /> -->
					<datePicker style="width: 100%"
							v-model="formState.arrivalDate"
							@change="handleChangCheckIn"
							placeholder="请选择入住日期"
							popper-class="hidden-date-picker"
							:default-time="travelStore.defaultStartTime"
							:disabled-date="travelStore.setDisabledDate()"
							value-format="YYYY-MM-DD HH:mm:ss"
							:disabled-hours="() => disabledHours(travelStore.teamTime[0], formState.arrivalDate, 'start')"
							:disabled-minutes="() => disabledMinutes(travelStore.teamTime[0], formState.arrivalDate, 'start')"
							:disabled-seconds="() => disabledSeconds(travelStore.teamTime[0], formState.arrivalDate, 'start')"
							type="datetime" />
			</a-form-item>

			<a-form-item label="离店日期"
				name="departureDate" 
				:rules="[{ required: true, message: '请选择离店日期' }]">
				<!-- <a-date-picker style="width: 100%" 
					:disabled-date="disLeave"
					:disabled="formState.arrivalDate === ''"
					dropdownClassName="hidden-date-picker"
					:disabled-time="disLeaveTime"
					placeholder="请先选择离店时间"
					:show-time="{
							defaultValue: dayjs(`${travelStore.setStarEndHMS.end.hour} : ${travelStore.setStarEndHMS.end.min} : ${travelStore.setStarEndHMS.end.second}`, 'HH:mm:ss')
						}"
					format="YYYY-MM-DD HH:mm:ss" 
					value-format="YYYY-MM-DD HH:mm:ss" 
					v-model:value="formState.departureDate" /> -->
					<datePicker style="width: 100%"
							v-model="formState.departureDate"
							placeholder="请选择离店时间"
							popper-class="hidden-date-picker"
							:default-time="travelStore.defaultEndTime"
							:disabled-date="disabeldleave"
							:disabled="formState.arrivalDate === ''"
							value-format="YYYY-MM-DD HH:mm:ss"
							:disabled-hours="() => disabledHours(travelStore.teamTime[1], formState.departureDate)"
							:disabled-minutes="() => disabledMinutes(travelStore.teamTime[1], formState.departureDate)"
							:disabled-seconds="() => disabledSeconds(travelStore.teamTime[1], formState.departureDate)"
							type="datetime" />
			</a-form-item>
			<div v-for="(room, index) in formState.roomTypeList" :key="index">
				<h3>房型{{ index + 1 }}</h3>
				<a-form-item label="预定房型" :name="['roomTypeList', index, 'hotelRoomTypeId']" :rules="[{ required: true, message: '请选择预定房型' }]">
					<a-select 
						@change="(e: any, option: any) => changeRoomType(e, option, index)"
						v-model:value="room.hotelRoomTypeId" 
						placeholder="请选择预定房型">
						<a-select-option 
							:value="item.oid" v-for="item in hotelData.roomType" 
							:name="item.roomTypeName + '-' + item.sysRoomTypeName" 
							:key="item.oid"
							:stockNum="item.stockNum"
							:num="item.roomOccupancyNum">{{ item.roomTypeName + '-' + item.sysRoomTypeName }}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item 
					label="订房数量" 
					:name="['roomTypeList', index, 'reserveNumber']" 
					:rules="[{ required: true, validator: (_rule: Rule, value: string) => validateCheckNum(_rule, value, index) }]">
					<a-input v-model:value="room.reserveNumber" placeholder="请输入订房数量"/>
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
					:rules="[{ required: true, validator: isOneHundred }]"
				>
					<div class="d-flex align-item-center">
						<div style="width: 500px">诚信指导价：{{honestyGuidePrice}}元 + </div>
						<a-input @change="handleMoeny(index, room.unitPrice)" v-model:value="room.unitPrice" placeholder="请输入您与酒店线下协商好的价格" />
						<div style="width: 200px; text-align: right; margin-right: 30px">{{formState.roomTypeList[index].orderAmount}}元</div>
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
				<a-input v-model:value="orderFeeCount" disabled placeholder="无需填写，填写房间数量后自动计算" />
				<!-- <span class="gary">如果符合满16减1标准，则自动优惠减扣。</span> -->
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
import { useTravelStore } from '@/stores/modules/travelManagement';
import { message } from 'ant-design-vue/es';
import { Rule } from 'ant-design-vue/es/form';
import dayjs, { Dayjs } from 'dayjs';
import { disabledRangeTime, range, isPositiveInteger, selectSpecialDateRange, isOneHundred, disabledHours, disabledMinutes, disabledSeconds, getDiffDay } from '@/utils';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {accAdd, accDiv, accMul} from '@/utils/compute.js'
import datePicker from '@/components/common/datePicker.vue';

const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any ) || {}
const route = useRoute()
const roomList = {
	orderAmount: 0,
	checkInNumber: '', //入住人数
	// hotelRoomTypeId: '', //房型id
	unitPrice: 0, //房型单价
	reserveNumber: '', //订房数量
	roomTypeName: "" //房型名称
};
const travelStore = useTravelStore()
const formRef = ref();
const emits = defineEmits(['update:modelValue', 'getTravelDetail']);

const disCheckInTime = computed(() => {
	// const isCurrent = dayjs(travelStore.baseInfo.startDate).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
	// const start = dayjs().isBefore(dayjs(travelStore.baseInfo.startDate))
	
	// const disTime: any = (start || isCurrent) ? travelStore.setStarEndHMS.start : {
	// 	hour: 0,
	// 	min: 0,
	// 	second: 0
	// }
	const disTime: any = travelStore.setStarEndHMS.start;
	return (_: Dayjs) => {
		const current = dayjs(dayjs(_).format('YYYY-MM-DD')).unix()
		const startUnix = dayjs(dayjs(travelStore.baseInfo.startDate).format('YYYY-MM-DD')).unix();
		// const endUnix = dayjs(dayjs(travelStore.baseInfo.endDate).format('YYYY-MM-DD')).unix();
		if (startUnix === current) {
			return {
				disabledHours: () => range(0, 24).splice(0, disTime.hour),
				disabledMinutes: () => range(0, 60).splice(0, disTime.min),
				disabledSeconds: () => range(0, 60).splice(0, disTime.second)
			}
		}

		return {
			disabledHours: () => [],
			disabledMinutes: () => [],
			disabledSeconds: () => [],
		}
		
	};
})
const disLeaveTime = computed(() => {
	return disabledRangeTime(travelStore.setStarEndHMS.start, travelStore.setStarEndHMS.end);
})

let disLeave = ref((current: Dayjs) => {
	return current && current < dayjs().startOf('day') || 
	current > dayjs('').startOf('day');
})

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	hotelId: {
		type: String,
		default: ''
	},
	productRow: {
		type: Object,
		default: {}
	}
});
// 酒店数据
const hotelData = reactive<{[k:string]: any}>({
	hotelStart: [],
	hotel: [],
	roomType: [],
});
// 表单填写数据
let formState = reactive<{[k: string]: any}>({
	hotelId: '',
	arrivalDate:'',
	leaveTime: '',
	enterTime: '',
	roomTypeList: [{ ...roomList }],
	honestyGuidePrice: ''
});
const honestyGuidePrice = computed(() => (accDiv(formState.honestyGuidePrice, 100)) || 0)

const addRoom = () => {
	const room = cloneDeep(roomList)
	room.orderAmount = honestyGuidePrice.value;
	formState.roomTypeList.push({ ...room });
};
const delRoom = (index: number) => {
	formState.roomTypeList.splice(index, 1);
};

const handleHotel = (e: any, option: any) => {
	formState.hotelName = option.name;
}

const handelChangeStart = (id: any, option: any) => {
	formState.hotelId = ''
	for (let i = 0; i < formState.roomTypeList.length; i++) {
		formState.roomTypeList[i].hotelRoomTypeId = ''
	}
	handleChange(id, option)
}

const handleChangCheckIn = () => {
	// disLeave.value = (current: Dayjs): any => current && current < dayjs(formState.arrivalDate).endOf('day') || 
	// (dayjs(travelStore.teamTime[1]).endOf('day') < current && current)
	const isAfter = dayjs(dayjs(formState.arrivalDate)).isAfter(dayjs(formState.departureDate).subtract(1, 'day'))
	if (formState.departureDate && isAfter) {
		formState.departureDate = '';
	}
}

const disabeldleave = (current: Dayjs) => {
	return current && current > dayjs(travelStore.teamTime[1]).endOf('day') || (current && current < dayjs(formState.arrivalDate).endOf('day'));
	
}

const changeRoomType = (e: any, option: any, index: number) => {
	// console.log(12312312312313131)
	formState.roomTypeList[index].roomOccupancyNum = option.num;
	formState.roomTypeList[index].roomTypeLimitPeople = option.num;
	formState.roomTypeList[index].stockNum = option.stockNum
	formState.roomTypeList[index].roomTypeName = option.name
	
}


const getHotelStarList = async () => {
	hotelData.hotelStart = await api.commonApi.getHotelStarList();	
};
const handleMoeny = (i: number, e: string) => {
	
	formState.roomTypeList[i].orderAmount = accAdd(honestyGuidePrice.value, parseFloat(e) || 0);
}

const handleChange = async (id: number, option: any) => {
	// console.log(id, option, 'formState.hotelIdformState.hotelIdformState.hotelId');
	formState.honestyGuidePrice = option.price;
	formState.hotelStarCode = option.name;
	id && (hotelData.hotel = await api.getHotelInfoByRated(id));
	
	if (props.productRow.productId) {
		formState.hotelId = hotelData.hotel.filter((it: any) => it.companyId === props.productRow.productId)[0]?.oid
	}
	for (let i = 0; i < formState.roomTypeList.length; i++) {
		formState.roomTypeList[i].orderAmount = accAdd(honestyGuidePrice.value,
		parseFloat(formState.roomTypeList[i].unitPrice));
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
}



// 入住总人数校验
const validateCheckIn = async (_rule: Rule, value: string, index: number) => {
	if (value === '') {
		return Promise.reject('请输入入住总人数');
	} else if(Number(value) < formState.roomTypeList[index].reserveNumber) {
		return Promise.reject('入住人数不能低于房间数量');
	} else if(Number(value) > (accMul(formState.roomTypeList[index].reserveNumber, formState.roomTypeList[index].roomOccupancyNum))) {
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
const getOrderAmount = (data: Array<{[k:string]:any}>, startDate: string, endDate: string) => {
	
	// const day = getDiffDay(startDate, endDate);
	const day = dayjs(dayjs(endDate).format('YYYY-MM-DD')).diff(dayjs(startDate).format('YYYY-MM-DD'), 'days') 
	console.log(day);
	const amount = []
	for (let k = 0; k < data.length; k++) {
		amount[k] = accMul(accMul(data[k].orderAmount, data[k].reserveNumber), day)
	}
	return amount.reduce((prev, next) => prev + next)
}

const submit = async () => {
	try {
		let traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {}
		
		// formState.scheduledNumber = formState.roomTypeList.map((it: any) => Number(it.checkInNumber))
		// .reduce((prev: any, current: any) => prev + current);
		for (let index = 0; index < formState.roomTypeList.length; index++) {

			if (!formState.roomTypeList[index].roomTypeLimitPeople) {
				const currentRoom = hotelData.roomType.filter((id:any) => formState.roomTypeList[index].hotelRoomTypeId === id.oid)[0];
				console.log(currentRoom)
				changeRoomType({}, 
						{	
							num: currentRoom.roomOccupancyNum, 
							stockNum: currentRoom.stockNum, 
							name: currentRoom.roomTypeName
						}, 
						index
				)
			}
		}
		const form = cloneDeep(formState);
		form.roomTypeList = form.roomTypeList.map((it: any, index: number) => {
			it.unitPrice = accMul(it.unitPrice, 100);
			it.orderAmount = accMul(it.orderAmount, 100)
			return it
		})
		form.scheduledRooms = form.roomTypeList.map((it: any) => Number(it.reserveNumber))
		.reduce((prev: any, current: any) => prev + current);
		form.tripNumber = travelStore.touristList.length;
		form.itineraryId = route.query.id || traveListData.oid
		form.orderAmount = getOrderAmount(form.roomTypeList, form.arrivalDate, form.departureDate)
		
		// if (Number((formState.scheduledNumber / travelStore.touristList.length).toFixed) < 0.8) {
		// 	return message.error('入住总人数不低于团客总数的80%')
		// }
		// const newFormState = cloneDeep(form)
		// newFormState.startDate = newFormState.arrivalDate
		// newFormState.endDate = newFormState.departureDate
		// newFormState.hotelStar = newFormState.hotelStarCode
		// newFormState.orderFee = accDiv(newFormState.orderAmount, 100)
		// newFormState.reservePeopleCount = newFormState.roomTypeList.map((it:any) => Number(it.checkInNumber)).reduce((prev: number, next: number) => prev + next)
		// newFormState.roomCount = newFormState.roomTypeList.map((it:any) => Number(it.reserveNumber)).reduce((prev: number, next: number) => prev + next)
		const res = await api.travelManagement.addHotel(form);
		// res && (newFormState.oid = res);
		// message.success('新增成功');
		emits('getTravelDetail')
		// travelStore.setHotels(newFormState)
		// callback()
	} catch (errorInfo) {
		// callback(false);
	}
}

const handleOk = async (callback: Function) => {
	
	try {
		await formRef.value.validateFields();
		
	} catch (error) {
		return callback(false)
	}
	const res = selectSpecialDateRange(formState.arrivalDate, formState.departureDate, formState.hotelId);
	if (!res) {
		await submit();
		callback();
		return
	}
	Modal.confirm({
		title: '添加确认？',
		icon: createVNode(ExclamationCircleOutlined),
		content: createVNode('div', { style: 'color: #333;' }, 
			`存在与本次预定相同的酒店且入离时间存在交叉，如生成新订单则无法计入减免。`),
		async onOk() {
			
			await submit();
			callback();
		},
		onCancel() {
			callback(false)
			console.log('Cancel');
		}
	});
	
};





const getRoomType = async (hotelId: number | string, leaveTime: string, enterTime: string) => {
	hotelData.roomType = await api.getRoomType({
		hotelId,
		leaveTime,
		enterTime,
	});
};

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
				formState[k] = [{ ...roomList }]
			} else {
				formState[k] = '';
			}
		}
		console.log(formState)
	} else {
		!props.productRow.productId && props.hotelId && api.travelManagement.hotelDetail(props.hotelId).then((res:any) => {
			for (let k in res) {
				formState[k] = res[k]
			}
			formState.arrivalDate = res.startDate
			formState.orderFee = accDiv(formState.orderFee, 100)
			formState.departureDate = res.endDate
			let price = hotelData.hotelStart.filter((it:any) => it.oid == res.hotelStarId)[0].price
			handleChange(res.hotelStarId, {name: res.hotelStar, price: price})
			console.log(formState.roomTypeList,'前');
			formState.roomTypeList = formState.roomTypeList.map((it:any) => {
				it.reserveNumber = it.roomCount
				it.roomTypeLimitPeople = it.limitPeople
				// it.checkInNumber = it.roomCount
				it.hotelRoomTypeId = it.roomTypeId
				it.orderAmount = accDiv(it.unitPrice, 100)
				it.unitPrice = accDiv(it.increaseAmount, 100)
				// it.increaseAmount = it.increaseAmount / 100
				return it;
			})
			console.log(formState.roomTypeList,'后');

		})
		formState.hotelId = props.productRow.productId;
		formState.hotelName = props.productRow.hotelName;

		props.productRow.productId && api.travelManagement.getGuidePriceStarCodeByHotelId(props.productRow.productId)
											.then((res: any) => {
											formState.hotelStarId = res.oid
											handleChange(res.oid, {price: res.price, name: res.starCode})
										})

		if (!props.productRow.productId && !props.hotelId) {
			for (let k in props.productRow) {
				formState[k] = props.productRow[k];
			}
			hotelData.roomType = []
			formState.roomTypeList = formState.roomTypeList.map((it: any) => {
				hotelData.roomType.push({
					roomTypeName: it.roomTypeName,
					oid: it.roomTypeId
				});
				it.unitPrice = 0;
				it.oid = null;
				it.reserveNumber = '';
				it.hotelRoomTypeId = it.roomTypeId;
				return it;
			})
			
			
			let price = hotelData.hotelStart.filter((it:any) => it.oid == props.productRow.hotelStarId)[0]?.price
			handleChange(props.productRow.hotelStarId, {name: props.productRow.hotelStar, price: price})
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

const orderFeeCount = computed(() => {
	
	return getOrderAmount(formState.roomTypeList, formState.arrivalDate, formState.departureDate) || 0
})
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

