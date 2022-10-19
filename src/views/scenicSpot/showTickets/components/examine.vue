<template>
	<BaseModal title="下架票审核" v-model="modelValue" @close="handleOk" :width="1000">
		<a-row>
			<a-col :span="3">门票</a-col>
			<a-col :span="5">
				<a-form-item name="downReason">
					<a-input disabled></a-input>
				</a-form-item>
			</a-col>
			<a-col :span="2" class="center">门票ID</a-col>
			<a-col :span="5">
				<a-form-item name="downReason">
					<a-input disabled></a-input>
				</a-form-item>
			</a-col>
			<a-col :span="2" class="center">景区</a-col>
			<a-col :span="5">
				<a-form-item name="downReason">
					<a-input disabled></a-input>
				</a-form-item>
			</a-col>
		</a-row>
		<a-row>
			<a-col :span="3">下架时间</a-col>
			<a-col :span="19">
				<a-form-item name="downReason">
					<a-input disabled></a-input>
				</a-form-item>
			</a-col>
		</a-row>
		<a-row>
			<a-col :span="3">原因</a-col>
			<a-col :span="19">
				<a-form-item name="downReason">
					<a-textarea placeholder="请输入原因" :rows="4" disabled/>
				</a-form-item>
			</a-col>
		</a-row>
		<template v-slot:footer>
			<a-button type="primary">审核通过</a-button>
			<a-button type="primary" style="width:100px">审核不通过</a-button>
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
const save = () => {
	console.log(state.tableData, '11111111111111');
};
const cancel = () => {
	dialogVisible.value = false;
	(state.tableData.startTime = ''), (state.tableData.endTime = '');
};
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
.span {
	margin-right: 10px;
}
.center {
	text-align: center;
}
.height{
	line-height: -10px;
}
</style>
