<template>
	<BaseModal v-model="dialogVisible" title="查看景区门票" :width="1000">
		<a-form
			ref="formRef"
			:model="formState"
			autocomplete="off"
			labelAlign="left"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 10 }"
		>
			<a-form-item label="选择景区" name="scenicId">
                {{formState.scenicName}}
			</a-form-item>

			<a-form-item label="入园日期" name="startDate">
                {{formState.startDate}}
			</a-form-item>

			<a-form-item
				label="选择门票"
				name="ticketId"
			>
            {{formState.ticketName}}
			</a-form-item>

			<a-form-item label="行程人数" name="travelName">
				<span>{{travelStore.touristList.length}}人</span>
			</a-form-item>

            <a-form-item label="门票价格" name="travelName">
				{{formState.unitPrice}}
			</a-form-item>

            <a-form-item label="订单编号">
				{{formState.ticketOrderNo}}
			</a-form-item>

            <!-- <a-form-item label="订单生成时间">
				
			</a-form-item> -->
			
		</a-form>
        <template v-slot:footer>
			<a-button type="primary" @click="handleOk" style="width: 100px">确定</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
    
	import BaseModal from '@/components/common/BaseModal.vue';
    import { useTravelStore } from '@/stores/modules/travelManagement';
    import api from '@/api';

    const travelStore = useTravelStore()
	const formRef = ref()
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false,
		},
		ticketId: {
			type: String,
			default: ''
		}
	})

	const formState = ref<{[k:string]:any}>({})
	
	const handleOk = async (callback: Function) => {
		
		emits('update:modelValue', false)
	};

	

	const emits = defineEmits(['update:modelValue'])
	const dialogVisible = ref(false);
	watch(() => props.modelValue, (newVal) => {
		dialogVisible.value = newVal
	});
	watch(dialogVisible, newVal => {
		console.log(newVal, props.ticketId)
		if (!newVal) {
			formRef.value.resetFields();
		} else {
			
			props.ticketId && api.travelManagement.ticketDetail(props.ticketId).then((res:any) => {
				formState.value = res
			})
			
		}
		emits('update:modelValue', newVal)
	})

</script>

<style lang="less" scoped>
.visable {
	visibility: hidden;
}
.table-area {
    padding: 0;
}
</style>>