<template>
	<BaseModal v-model="dialogVisible" title="查看酒店" :width="900">
		<a-form ref="formRef" :model="formState" autocomplete="off" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
			<a-form-item label="选择星级" name="hotelStarId">
				{{formState.hotelStar}}
			</a-form-item>

			<a-form-item label="选择酒店" name="hotelId">
				{{formState.hotelName}}
			</a-form-item>

			<a-form-item label="行程人数">
				<span>{{travelStore.touristList.length}}人</span>
			</a-form-item>
			<!-- <a-form-item label="诚信指定价">
				<span>{{}}元</span>
			</a-form-item> -->

			<a-form-item label="入住日期" name="arrivalDate">
				{{formState.startDate}}
			</a-form-item>

			<a-form-item label="离店日期"
				name="departureDate">
				{{formState.endDate}}
			</a-form-item>
			<div v-for="(room, index) in formState.roomTypeList" :key="index">
				<h3>房型{{ index + 1 }}</h3>
				<a-form-item label="预定房型">
					{{room.roomTypeName}}
				</a-form-item>
				<a-form-item 
					label="订房数量" >
					{{room.roomCount}}
				</a-form-item>

				<a-form-item
					label="单价"
					:wrapper-col="{ span: 16 }"
				>
					{{room.unitPrice}}
				</a-form-item>
			</div>

			<a-form-item label="订单金额">
				{{formState.orderFee / 100}}
			</a-form-item>
                
			<a-form-item label="订单编号">
				{{formState.hotelOrderNo}}
			</a-form-item>

			<a-form-item label="订单生成时间">
				{{formState.createTime}}
			</a-form-item>
		</a-form>
        <template v-slot:footer>
			<a-button type="primary" @click="handleOk" style="width: 100px">确定</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { useTravelStore } from '@/stores/modules/travelManagement';

const route = useRoute()
const travelStore = useTravelStore()
const formRef = ref();


const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	hotelId: {
		type: String,
		default: ''
	}
});
// 表单填写数据
let formState = ref<{[k: string]: any}>({});







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
	} else {
		props.hotelId && api.travelManagement.hotelDetail(props.hotelId).then((res:any) => {
            formState.value = res
		})
	}
	emits('update:modelValue', newVal);
});
const handleOk = async (callback: Function) => {
		
    emits('update:modelValue', false)
};

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
