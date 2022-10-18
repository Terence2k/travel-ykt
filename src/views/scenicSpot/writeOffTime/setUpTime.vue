<template>
	<BaseModal title="设置核销时间段" v-model="modelValue" @close="handleOk" :width="600">
		<a-form ref="formRef" :model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
			<a-form-item label="门票名称" name="username">
				<a-input disabled v-model:value="formValidate.row.ticketName" />
			</a-form-item>
			<a-form-item label=" 门票大类" name="account">
				<a-input disabled v-model:value="formValidate.row.ticketDataType" />
			</a-form-item>
			<p v-if="formValidate.row.ticketDataType == '演出票'">
				<a-span>有效核销时间段为开场前</a-span>
				<a-input class="input" v-model:value="state.tableData.startTime" />
				<a-span>分钟，至结束前</a-span>
				<a-input class="input" v-model:value="state.tableData.endTime" />
				<a-span>分钟</a-span>
			</p>
			<p v-if="formValidate.row.ticketDataType == '单票'">
				<a-span class="span">有效核销时间段为当天</a-span>
				<a-time-picker v-model:value="state.tableData.startTime" format="HH:mm" valueFormat="HH:mm" :placeholder="state.tableData.startTime" />
				<span class="span_width">至</span>
				<a-time-picker v-model:value="state.tableData.endTime" format="HH:mm" valueFormat="HH:mm" :placeholder="state.tableData.endTime" />
			</p>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="save()">保存</a-button>
			<a-button @click="cancel">取消</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import type { FormInstance } from 'ant-design-vue';
import api from '@/api';
import { message } from 'ant-design-vue';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const formValidate: Ref<Record<string, any>> = ref({});
const state = reactive({
	tableData: {
		
		startTime: '',
		endTime: '',
	},
});
const init = async () => {
	console.log('params', props.params);
	formValidate.value = {};
	formValidate.value = { ...props.params };
};
const save =()=>{
	console.log(state.tableData,'11111111111111')
}
const cancel=()=>{
	dialogVisible.value = false
	state.tableData.startTime='',
	state.tableData.endTime=''
}
watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style>
.input {
	width: 50px;
	margin: 0px 10px;
}
.span_width {
	margin: 0 20px;
}
.span{
	margin-right: 10px;
}
</style>
