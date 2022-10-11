<template>
    <div class="tourist-container">
		<a-form
			ref="formRef"
			:rules="rulesRef"
			:model="editableData"
			autocomplete="off"
			labelAlign="left"
		>
			<CommonTable :columns="columns" :dataSource="tableData" :scrollY="false">
				
				<template #bodyCell="{ column, text, index, record }">
					<!-- formRef -->
					
					
						<template v-if="column.key === 'index'">
							<div>
								{{index + 1}}
							</div>
						</template>
						
						<template v-if="selectKey.includes(column.key)">
							<div>
								<a-form-item 
									v-if="editableData[record.key]" 
									:name="[record.key, column.key]">
									<a-select
										style="width: 100%"
										v-model:value="editableData[record.key][column.key]">
										<a-select-option
											v-for="val in column.data"
											:key="val.codeValue"
											:value="val.codeValue">{{val.name}}</a-select-option>
									</a-select>
								</a-form-item>
								
								<template v-else>
									{{ column.data.filter(it => it.codeValue === text)[0]?.name }}
								</template>
							</div>
						</template>

						<template v-if="inputKey.includes(column.key)">
							<div>
								<a-form-item 
									v-if="editableData[record.key]" 
									:name="[record.key, column.key]">
									<a-input
										v-model:value="editableData[record.key][column.key]" 
										placeholder="请输入" />
								</a-form-item>
								
								<template v-else>
									{{ text }}
								</template>
							</div>
						</template>
						<template v-if="column.key === 'time'">
							<div>
								<a-form-item 
									v-if="editableData[record.key]" 
									:name="[record.key, column.key]">
                                        <a-range-picker
                                            v-model:value="editableData[record.key][column.key]"
                                            show-time
                                            format="YYYY-MM-DD HH:mm:ss"
                                            value-format="YYYY-MM-DD HH:mm:ss"
											@change="(event) => handleTime(event, record.key)"
                                        />
								</a-form-item>
								
								<template v-else>
									{{ record.useStartDate + '-' + record.useEndDate }}
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
				
		</a-form>
		<div class="footer-btn">
			<a-button type="primary" @click="add">添加</a-button>
			<!-- <a-button>批量删除</a-button> -->
		</div>
    </div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import Upload from '@/components/common/Upload.vue';
import { useTrafficInfo } from './trafficInfo';
const props = defineProps({
	onCheck: {
		type: Boolean
	}
})
const emits = defineEmits(['onSuccess'])
const { 
	columns, 
	tableData, 
	editableData, 
	edit, 
	save, 
	onSelect, 
	selectKey, 
	inputKey, 
	cityOptions,
	add,
	rulesRef,
	formRef, handleTime } = useTrafficInfo(props, emits)
</script>
<style lang="less" scoped>
	::v-deep(.ant-upload-select-picture-card) {
		width: 64px;
		height: 34px;
		border: 1px solid #D5D5D5;
		background-color: #fff;
	}
	::v-deep(.anticon-plus) {
		color: #777;
	}
	.footer-btn {
		display: flex;
		justify-content: flex-end;
		margin: 16px 20px;
		button:first-of-type {
			margin-right: 16px;
		}
	}
</style>