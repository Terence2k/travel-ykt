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
			<CommonTable :columns="route.query.Cedit ?columns:columnstwo" :dataSource="tableData" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{index + 1}}
						</div>
					</template>

					<template v-if="column.key === 'guideName'">
						<div>
							<a-form-item 
								v-if="editableData[record.key ? record.key : record.oid]" 
								:name="[record.key ? record.key : record.oid, 'guideOid']">
								<!-- <a-button class="select-guide" v-if="editableData[record.key ? record.key : record.oid]" >
									{{text ? text : '请选择导游'}}
									<caret-down-outlined />
								</a-button> -->
								<a-select
									style="width: 100%"
									@change="(val: any, option: any) => guideChange(val, option, record.key ? record.key : record.oid)"
									v-model:value="editableData[record.key ? record.key : record.oid]['guideOid']">
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
					<template v-if="column.key === 'guideType'">
						{{column.data[text]}}
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" :class="{'disabled': !travelStore.teamStatus}" v-if="!editableData[record.key ? record.key : record.oid]"  @click="edit(record.key ? record.key : record.oid)">编辑</a>
							<a class="item" :class="{'disabled': !travelStore.teamStatus}" v-else @click="save(record.key ? record.key : record.oid)">确定</a>
							<a class="item" :class="{'disabled': !travelStore.teamStatus}" @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			
		</a-form>
		<div class="footer-btn" v-if="travelStore.teamStatus">
			<a-button type="primary" @click="add" v-if="route.query.Cedit" >添加</a-button>
		</div>
	</div> 
</template>
<script lang="ts" setup>
import { CaretDownOutlined } from '@ant-design/icons-vue';
import CommonTable from '@/components/common/CommonTable.vue';
import { useGuideInfo } from './ciceroneinfo';

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
	add,
	del, guideData, guideChange, travelStore ,route,columnstwo } = useGuideInfo(props, emits)
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
	.action{
		display: none;
	}
</style>