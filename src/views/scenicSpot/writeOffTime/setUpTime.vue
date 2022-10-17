<template>
	<BaseModal title="设置核销时间段" v-model="modelValue" @close="handleOk">
		<a-form ref="formRef" model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
			<a-form-item label="门票名称" name="username">
				<a-input disabled />
			</a-form-item>
			<a-form-item label=" 门票大类" name="account">
				<a-input disabled />
			</a-form-item>
			<p>
				<a-span>有效核销时间段为开场前</a-span>
				<a-input class="input1" />
				<a-span>分钟，至结束前</a-span>
				<a-input class="input2" />
				<a-span>分钟</a-span>
			</p>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary">保存</a-button>
			<a-button>取消</a-button>
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

watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style>
.input1 {
	width: 30px;
}
.input2 {
	width: 30px;
}
</style>
