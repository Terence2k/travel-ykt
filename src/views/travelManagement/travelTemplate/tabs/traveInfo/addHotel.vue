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
					<a-select @change="(e: any, option: any) => changeRoomType(e, option, index)" v-model:value="room.roomTypeId" placeholder="请选择预定房型">
						<a-select-option :value="item.oid" v-for="item in hotelData.roomType" :name="item.roomTypeName" :key="item.oid" :price="item.price">{{
							item.roomTypeName
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="" :name="['roomTypeList', index]" :wrapper-col="{ span: 16 }">
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
	roomTypeId: '',
	unitPrice: 0,
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
	hotelName: '',
	hotelStarId: '',
	itineraryId: '',
	orderFee: 0,
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
	console.log('hotelData.roomType', hotelData.roomType);
};

const changeRoomType = (e: any, option: any, index: number) => {
	// formState.roomTypeList[index].roomTypeId = option.key;
	formState.roomTypeList[index].roomTypeName = option.name;
	formState.roomTypeList[index].unitPrice = option.price;
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
		formState.itineraryId = route.query.oid || travelStore.templateOid;
		const newFormState = cloneDeep(formState);
		for (var index = 0; index < newFormState.roomTypeList.length; index++) {
			newFormState.orderFee = newFormState.roomTypeList[index].unitPrice + newFormState.orderFee;
		}
		const res = await api.travelManagement.templateaddHotel(newFormState);
		travelStore.tempeletSetHotels(newFormState, res, props.productRow.productId);
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
		travelStore.hotels = res.hotelList;
	});
	callback();
	return;
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
			api.travelManagement.templateHotelDetail(props.hotelId).then((res: any) => {
				for (let k in res) {
					formState[k] = res[k];
				}

				let price = hotelData.hotelStart.filter((it: any) => it.oid == res.hotelStarId)[0].price;
				handleChange(res.hotelStarId, { name: res.hotelStar, price: price });
				formState.roomTypeList = formState.roomTypeList;
				formState.hotelStarId = res.hotelStarId;
			});
		formState.hotelId = props.productRow.productId;
		formState.hotelName = props.productRow.hotelName;

		// props.productRow.productId &&
		// 	api.travelManagement.getGuidePriceStarCodeByHotelId(props.productRow.productId).then((res: any) => {
		// 		formState.hotelStarId = res.oid;
		// 		handleChange(res.oid, { price: res.price, name: res.starCode });
		// 	});
	}

	emits('update:modelValue', newVal);
});

const debounceFun = debounce((hotelId: any) => {
	getRoomType(hotelId);
}, 500);

watch(
	() => [formState.hotelId],
	([newHotelId]) => {
		if (newHotelId) {
			debounceFun(newHotelId);
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
