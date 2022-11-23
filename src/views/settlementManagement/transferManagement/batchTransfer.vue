<template>
	<div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }" bordered> </CommonTable>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
const state = reactive({
	tableData: {
		data: [],
	},
});
const columns = ref([]);
</script>
<style scoped lang="scss"></style>
