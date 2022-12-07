<template>
	<BaseModal :title="options.title" v-model="dialogVisible">
		<p>是否暂停该任务？禁用后该短信会暂时 停止自动发送，需重新启用后再恢复。{{ props.params }}</p>
		<p>是否启用该任务？启用后该 短信会重新按时自动发送。</p>
		<template v-slot:footer>
			<a-button @click="dialogVisible = false">取消</a-button>
			<a-button type="primary" @click="dialogVisible = false">确定</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});

const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const dialogVisible = ref(false);
const formValidate: Ref<Record<string, any>> = ref({});
const options = reactive({ title: '禁用提醒' });

const init = async () => {};

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

<style></style>
