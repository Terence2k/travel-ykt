<template>
	<div class="table-container">
		<p class="tips">选择导游（提交后系统会自动联系导游接单）</p>
		<a-form
			ref="formRef"
			:rules="rulesRef"
			:model="editableData"
			autocomplete="off"
			labelAlign="left"
		>
			<CommonTable :columns="columns" :dataSource="tableData" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{index + 1}}
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
									/>
							</a-form-item>
							<template v-else>
								{{ record.startDate }}
								-
								{{record.endDate}}
							</template>
						</div>
					</template>

					<template v-if="column.key === 'guideName'">
						<div>
							<a-form-item 
								v-if="editableData[record.key]" 
								:name="[record.key, 'guideOid']">
								<!-- <a-button class="select-guide" v-if="editableData[record.key]" >
									{{text ? text : '请选择导游'}}
									<caret-down-outlined />
								</a-button> -->
								<a-select
									style="width: 100%"
									@change="(val: any, option: any) => guideChange(val, option, record.key)"
									v-model:value="editableData[record.key]['guideOid']">
									<a-select-option 
										v-for="item in guideData"
										:item="item"
										:key="item.oid"
										:value="item.oid"
										>{{item.guideName}}</a-select-option>
								</a-select>
							</a-form-item>
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
		</a-form>
		<div class="footer-btn">
			<a-button type="primary" @click="add">添加</a-button>
		</div>
	</div> 
</template>
<script lang="ts" setup>
import { CaretDownOutlined } from '@ant-design/icons-vue';
import CommonTable from '@/components/common/CommonTable.vue';
import { useGuideInfo } from './guideInfo';

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
	rulesRef,
	formRef,
	getGuideList, 
	add, guideData, guideChange } = useGuideInfo(props, emits)
	getGuideList()
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
	.footer-btn {
		display: flex;
		justify-content: flex-end;
		margin: 16px 20px;
	}
</style>