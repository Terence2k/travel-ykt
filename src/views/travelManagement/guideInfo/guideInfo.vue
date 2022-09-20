<template>
	<div class="table-container">
		<CommonTable :columns="columns" :dataSource="tableData">
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{index + 1}}
					</div>
				</template>
				<template v-if="tableKey.includes(column.key)">
					<div>
						<a-input
							v-if="editableData[record.key]"
							v-model:value="editableData[record.key][column.dataIndex]"
							style="margin: -5px 0"
						/>
						<template v-else>
							{{ text }}
						</template>
					</div>
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a class="item" @click="edit(record.key)">编辑</a>
						<a class="item">审核</a>
					</div>
				</template>
			</template>
		</CommonTable>
	</div> 
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import { useGuideInfo } from './guideInfo';
const { columns, tableData, tableKey, editableData, edit, save } = useGuideInfo()
</script>
<style lang="less" scoped>

</style>