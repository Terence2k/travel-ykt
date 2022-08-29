<template>
	<div class="box" ref="ceshiRef">{{ hello }}111</div>
</template>
<script setup lang="ts">
import { usePermissioStore } from '@/stores/modules/permission';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const permissioStore = usePermissioStore();
const { ceshiRef } = permissioStore;
// onMounted(() => {});
const hello = ref('运营管理');
</script>
<style lang="less" scoped>
.box {
	color: #60d659;
}
</style>
