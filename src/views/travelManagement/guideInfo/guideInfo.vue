<template>
	<div class="table-container">
		<CommonTable :columns="columns" :dataSource="tableData">
			<template #bodyCell="{ column }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="cell-actions">
						<span class="item">编辑</span>
						<span class="item">审核</span>
					</div>
				</template>
			</template>
		</CommonTable>
	</div> 
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
	const state = reactive({
		tableData: [],
		columns: [
			{
				title: '已选带团时间',
				dataIndex: 'name',
    		key: 'name',
			},
			{
				title: '已选导游',
				dataIndex: 'name6',
    		key: 'name5',
			},
			{
				title: '导游电话',
				dataIndex: 'name4',
    		key: 'name4',
			},
			{
				title: '导游编号',
				dataIndex: 'name3',
    		key: 'name3',
			},
			{
				title: '导游类型',
				dataIndex: 'name2',
    		key: 'name2',
			},
			{
				title: '签约旅行社',
				dataIndex: 'name1',
    		key: 'name1',
			},
			{
				title: '操作',
    		key: 'action',
			}
		]
	});
	const { tableData, columns } = toRefs(state);
</script>
<style lang="less" scoped>

</style>