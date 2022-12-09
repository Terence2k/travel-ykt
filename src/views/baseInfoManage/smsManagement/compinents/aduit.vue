<template>
	<BaseModal :title="state.data.isEnable == 0 ? '禁用提醒' : '启用提醒'" v-model="dialogVisible">
		<p v-if="state.data.isEnable == 0">是否暂停该任务？禁用后该短信会暂时 停止自动发送，需重新启用后再恢复。</p>
		<p v-else>是否启用该任务？启用后该 短信会重新按时自动发送。</p>
		<template v-slot:footer>
			<a-button @click="dialogVisible = false">取消</a-button>
			<a-button type="primary" @click="Audit">确定</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue/es';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});

const state = reactive({
	data: {} as any,
});

const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const dialogVisible = ref(false);
const init = async () => {
	state.data = props.params;	
};

const Audit = async () => {
	if (state.data.isEnable == 0) {
		await api.isEnableSysSmsTemplate(state.data.oid, false).then((res: any) => {
			message.success('禁用成功');
			emit('onSearch');
			dialogVisible.value = false;
			return;
		});
	} else {
		await api.isEnableSysSmsTemplate(state.data.oid, true).then((res: any) => {
			message.success('启用成功');
			emit('onSearch');
			dialogVisible.value = false;
			return;
		});
	}
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

<style></style>
