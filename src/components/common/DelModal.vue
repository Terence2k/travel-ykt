<template>
	<BaseModal :title="params.title" v-model="dialogVisible">
		<div class="content">
			<img class="warning-icon" src="@/assets/svg/warning.svg" alt="" />
			<div class="content-text">{{ params.content }}</div>
		</div>
		<template v-slot:footer>
			<a-button type="primary" @click="submit">确定</a-button>
			<a-button @click="cancel">取消</a-button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: {
		type: Object,
		default: () => {
			return {
				title: '删除',
				content: '是否删除所选数据？',
			};
		},
	},
	methods: Object,
});
const emit = defineEmits(['update:modelValue', 'submit', 'cancel']);
const submit = () => {
	emit('submit');
};
const cancel = () => {
	dialogVisible.value = false;
	emit('cancel');
};
const dialogVisible = ref(false);
watch(
	() => props.modelValue,
	async (nVal) => {
		console.log('props.modelValue->', nVal);
		dialogVisible.value = nVal;
		// if (dialogVisible.value) {
		// 	await init();
		// }
	}
);

watch(dialogVisible, (nVal) => {
	console.log('dialogVisible:', nVal);
	emit('update:modelValue', nVal);
});
</script>

<style lang="less" scoped>
.content {
	display: flex;
	.warning-icon {
		margin-right: 10px;
	}
	.content-text {
		line-height: 24px;
	}
}
</style>
