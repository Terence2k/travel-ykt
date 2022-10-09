<template>
	<BaseModal v-model="dialogVisible" title="选择预定酒店" :width="900">
		<a-form
			ref="formRef"
			:model="formState"
			:rules="rulesRef"
			autocomplete="off"
			labelAlign="left"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 10 }"
		>
			<a-form-item label="选择星级" name="routeName">
				<a-select v-model:value="formState.travelOperatorOid" placeholder="请选择组团社做团人">
					<a-select-option :value="1">{{1}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item
				label="选择酒店"
				name="teamType"
			>
				<a-select v-model:value="formState.travelOperatorOid" placeholder="请选择组团社做团人">
					<a-select-option :value="1">{{1}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="行程人数" name="travelName">
				<span>30人</span>
			</a-form-item>

			<a-form-item label="入住日期">
				<a-date-picker 
					style="width:100%"
					:show-time="{ format: 'HH:mm:ss' }" 
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
					v-model:value="formState.startDate" /> 
			</a-form-item>

			<a-form-item label="离店日期">
				<a-date-picker 
					style="width:100%"
					:show-time="{ format: 'HH:mm:ss' }" 
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
					v-model:value="formState.startDate" />
			</a-form-item>
			<div>
				<h3>房型1</h3>
				<a-form-item label="预定房型" name="routeName">
					<a-select v-model:value="formState.travelOperatorOid" placeholder="请选择组团社做团人">
						<a-select-option :value="1">{{1}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="订房数量" name="routeName">
					<a-input v-model:value="formState.travelOperatorOid"/>
				</a-form-item>
				<a-form-item label="入住人数" name="routeName" :wrapper-col="{ span: 16 }">
					<div class="d-flex">
						<a-input v-model:value="formState.travelOperatorOid"/>
						<div class="d-flex" style="margin-left: 32px">
							<a-button>删除</a-button>
							<a-button type="primary" style="margin-left: 16px; margin-right: 12px;">增加房型</a-button>
						</div>
					</div>
				</a-form-item>
			</div>
		</a-form>
	</BaseModal>
</template>

<script lang="ts" setup>
	import BaseModal from '@/components/common/BaseModal.vue';
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false,
		},
	})
	const formState = reactive({
		travelOperatorOid: '',
		startDate: ''
	});
	const rulesRef = {
		teamType: [{ required: true, message: '请选择行程类型' }],
		// travelName: [{ required: true, message: '请输入发团旅行社' }],
		contactPhone: [{ required: true, message: '请输入组团社联系电话' }],
		subTravelContactPhone: [{ required: true, message: '请输入地接社联系电话' }],
		travelOid: [{ required: true, message: '请选择组团社社'}],
		touristNum: [{ required: true, message: '请输入行程人数' }],
		// routeType: [{ required: true, message: '请选择线路类型' }],
		routeName: [{ required: true, message: '请选择或输入线路名称' }],
		startDate: [{ required: true, message: '请选择行程开始时间' }],
		endDate: [{ required: true, message: '请选择行程结束时间' }],
		subTravelOperatorOid: [{ required: true, message: '请选择计调' }],
		subTravelOid: [{ required: true, message: '请选择地接旅行社'}]
	};
	const emits = defineEmits(['update:modelValue'])
	const dialogVisible = ref(false);
	watch(() => props.modelValue, (newVal) => {
		dialogVisible.value = newVal
	});
	watch(dialogVisible, newVal => {
		console.log(newVal)
		emits('update:modelValue', newVal)
	})
</script>

<style lang="less" scoped>

</style>>