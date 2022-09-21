<template>
	<div class="table-container">
		<p class="tips">选择导游（提交后系统会自动联系导游接单）</p>
		<CommonTable :columns="columns" :dataSource="tableData">
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{index + 1}}
					</div>
				</template>
				<template v-if="column.key === 'name'">
					<div>
						<a-date-picker 
							v-if="editableData[record.key]" 
							:show-time="{ format: 'HH:mm' }" 
							v-model:value="editableData[record.key][column.dataIndex]" />
						
						<template v-else>
							{{ text }}
						</template>
					</div>
				</template>

				<template v-if="column.key === 'name5'">
					<div>
						<a-button class="select-guide" v-if="editableData[record.key]" >
							{{text ? text : '请选择导游'}}
							<caret-down-outlined />
						</a-button>
						<template v-else>
							{{ text }}
						</template>
					</div>
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a class="item" @click="edit(record.key  )">编辑</a>
						<a class="item">删除</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<div>
			<!-- <a-button>添加</a-button> -->
		</div>
	</div> 
</template>
<script lang="ts" setup>
import { CaretDownOutlined } from '@ant-design/icons-vue';
import CommonTable from '@/components/common/CommonTable.vue';
import { useGuideInfo } from './guideInfo';
const { columns, tableData, tableKey, editableData, edit, save } = useGuideInfo()
</script>
<style lang="less" scoped>
	.tips {
		padding: 0 20px;
		color: #71747A;
		font-size: 14px;
	}
	.select-guide {
		width: 115px;
		color: #D5D5D5;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>