<template>
    <div class="tourist-container">
        <div class="action-btn">
            <a-button type="primary">模板下载</a-button>
            <a-button type="primary">批量导入</a-button>
            <a-button type="primary">同步健康码</a-button>
        </div>
        <CommonTable :row-selection="{onSelect}" :columns="columns" :dataSource="tableData" :scrollY="false">
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
						<a class="item" v-if="!editableData[record.key]"  @click="edit(record.key)">编辑</a>
						<a class="item" v-else @click="save(record.key)">确定</a>
						<a class="item">删除</a>
					</div>
				</template>
			</template>
		</CommonTable>
    </div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import { useTouristInfo } from './touristInfo';
const { columns, tableData, editableData, edit, save, onSelect } = useTouristInfo()
</script>
<style lang="less">
    .action-btn {
        margin: 0 20px 16px;
        display: flex;
        justify-content: flex-end;
        button {
            margin-left: 16px;
        }
    }
</style>