<template>
	<BaseModal v-model="dialogVisible" title="选择预定酒店" :width="900" :onOk="handleOk">
		<a-form
			ref="formRef"
			:model="formState"
			autocomplete="off"
			labelAlign="left"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 10 }"
		>
			<a-form-item label="选择星级" name="travelOperatorOid" :rules="[{ required: true, message: '请选择星级' }]">
				<a-select 
					v-model:value="formState.travelOperatorOid" 
					placeholder="请选择星级"
					@change="handleChange">
					<a-select-option 
						:value="item.oid" 
						v-for="item in hotelData.hotelStart" 
						:key="item.oid">{{item.starCode}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item
				label="选择酒店"
				name="hotelId"
				:rules="[{ required: true, message: '请选择酒店' }]"
			>
				<a-select v-model:value="formState.hotelId" placeholder="请选择酒店">
					<a-select-option 
						:value="item.oid" 
						v-for="item in hotelData.hotel" 
						:key="item.oid">{{item.hotelName}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="行程人数" name="travelName">
				<span>30人</span>
			</a-form-item>

			<a-form-item label="入住日期" name="enterTime" :rules="[{ required: true, message: '请选择入住日期' }]">
				<a-date-picker 
					style="width:100%"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					v-model:value="formState.enterTime" /> 
			</a-form-item>

			<a-form-item label="离店日期" name="leaveTime" :rules="[{ required: true, message: '请选择离店日期' }]">
				<a-date-picker 
					style="width:100%"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					v-model:value="formState.leaveTime" />
			</a-form-item>
			<div v-for="(room, index) in formState.roomList" :key="index">
				<h3>房型{{index + 1}}</h3>
				<a-form-item label="预定房型" :name="['roomList', index, 'roomType']" :rules="[{ required: true, message: '请选择预定房型' }]">
					<a-select v-model:value="room.roomType" placeholder="请选择组团社做团人">
						<a-select-option 
						:value="item.oid" 
						v-for="item in hotelData.roomType" 
						:key="item.oid"
					>{{item.roomTypeName}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="订房数量" :name="['roomList', index, 'roomCount']" :rules="[{ required: true, message: '请选择订房数量' }]">
					<a-input v-model:value="room.roomCount"/>
				</a-form-item>
				<a-form-item label="入住人数" :name="['roomList', index, 'people']" :wrapper-col="{ span: 16 }" :rules="[{ required: true, message: '请选择入住人数' }]">
					<div class="d-flex">
						<a-input v-model:value="room.people"/>
						<div class="d-flex" style="margin-left: 32px">
							<a-button 
								@click="delRoom(index)"
								:class="{'visable': formState.roomList.length === 1}"
							>删除</a-button>
							<a-button
								:class="{'visable': formState.roomList.length - 1 !== index}"
								type="primary" 
								style="margin-left: 16px; margin-right: 12px;"
								@click="addRoom"
							>增加房型</a-button>
						</div>
					</div>
				</a-form-item>
			</div>

			<a-form-item label="订单金额">
				<a-input v-model:value="formState.enterTime" disabled placeholder="无需填写，填写房间数量后自动计算" />
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
	const roomList = {
		roomType: '',
		roomCount: '',
		people: ''
	}
	const formRef = ref()
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false,
		},
	})
	// 酒店数据
	const hotelData = reactive({
		hotelStart: [],
		hotel: [],
		roomType: []
	})
	// 表单填写数据
	const formState = reactive({
		travelOperatorOid: '',
		hotelId: '',
		leaveTime: '',
		enterTime: '',
		roomList: [{...roomList}]
	});

	const addRoom = () => {
		formState.roomList.push({...roomList})
	}
	const delRoom = (index: number) => {
		formState.roomList.splice(index, 1)
	}

	const getHotelStarList = async () => {
		hotelData.hotelStart = await api.getHotelStarList()
	}

	const handleChange = async (id:number) => {
		hotelData.hotel = await api.getHotelInfoByRated(id)
	}
	
	const handleOk = async (callback: Function) => {
		try {
			await formRef.value.validateFields()
			callback()
		} catch (errorInfo) {
			callback(false)
		}
		
	};

	const getRoomType = async (
			hotelId: number | string, 
			leaveTime: string, 
			enterTime: string
		) => {
		hotelData.roomType = await api.getRoomType(
			{
				hotelId, 
				leaveTime, 
				enterTime
			}
		)
	}
	const emits = defineEmits(['update:modelValue'])
	const dialogVisible = ref(false);
	watch(() => props.modelValue, (newVal) => {
		dialogVisible.value = newVal
	});
	watch(dialogVisible, newVal => {
		if (!newVal) {
			formRef.value.resetFields();
		}
		emits('update:modelValue', newVal)
	})
	
	const debounceFun = debounce((
		hotelId: number | string, 
		leaveTime: string, 
		enterTime: string
	) => {
    	getRoomType(hotelId, leaveTime, enterTime)
    } ,500)

	watch(() => [formState.hotelId, formState.leaveTime, formState.enterTime],
		([newHotelId, newLeaveTime, newEnterTime]) => {
		if(newHotelId && newLeaveTime && newEnterTime) {
			debounceFun(newHotelId, newLeaveTime, newEnterTime)
		}
	})
	getHotelStarList()
</script>

<style lang="less" scoped>
.visable {
	visibility: hidden;
}
</style>>