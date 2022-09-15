<template>
	<div>菜单管理</div>
	<a-button type="primary" @click="visible = true">123</a-button>
	<BaseModal :title="'行程单'" v-model="visible" :onOk="handleOk">
		你好
		<!-- <template v-slot:footer>
			<a-button type="primary">确定</a-button>
		</template> -->
	</BaseModal>
</template>

<script setup lang="ts">
	import BaseModal from '@/components/common/BaseModal.vue'
	const visible = ref(false)
	const handleOk = async (callback:Function) => {
		setTimeout(() => {
			callback()
		}, 2000)
    };
</script>

<style></style>
