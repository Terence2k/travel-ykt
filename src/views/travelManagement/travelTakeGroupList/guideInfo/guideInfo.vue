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
							{{ index + 1 }}
						</div>
					</template>
					<template v-if="column.key === 'time'">
						<div class="aa">
							<a-form-item 
							v-if="editableData[record.key ? record.key : record.oid]" 
							:name="[record.key ? record.key : record.oid, column.key]">
								<!-- <a-range-picker
									:disabled-date="travelStore.setDisabled"
									v-model:value="editableData[record.key ? record.key : record.oid][column.key]"
									show-time
									format="YYYY-MM-DD HH:mm:ss"
									value-format="YYYY-MM-DD HH:mm:ss"
								/> -->
								<datePicker
									style="width: 300px"
									v-model="editableData[record.key ? record.key : record.oid][column.key]"
									type="datetimerange"
									popper-class="hidden-date-picker"
									:default-time="[travelStore.defaultStartTime, travelStore.defaultEndTime]"
									start-placeholder="带团开始日期"
									end-placeholder="带团结束日期"
									@calendar-change="handelChange"
									value-format="YYYY-MM-DD HH:mm:ss"
									:disabled-hours="(type: string) => disabledRangeHours(currentDate, type)"
									:disabled-minutes="(_: any, type: string) => disabledRangeMinutes(currentDate, type)"
									:disabled-seconds="(_: any, m: any , type: string) => disabledRangeSeconds(currentDate, type)"
									:disabled-date="travelStore.setDisabledDate()"
								/>
							</a-form-item>
							<template v-else>
								{{ record.startDate }}
								-
								{{ record.endDate }}
							</template>
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
									v-model:value="editableData[record.key ? record.key : record.oid]['guideOid']"
								>
									<a-select-option 
										v-for="item in guideData" 
										:item="item" 
										:key="item.oid" 
										:value="item.oid"
										>{{ item.guideName }}</a-select-option>
								</a-select>
							</a-form-item>
							<template v-else>
								{{ text }}
							</template>
						</div>
					</template>
					<template v-if="column.key === 'guideType'">
						{{ column.data[text] }}
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" v-if="!editableData[record.key ? record.key : record.oid]" @click="edit(record.key ? record.key : record.oid)">编辑</a>
							<a class="item" v-else @click="save(record.key ? record.key : record.oid)">确定</a>
							<a class="item" @click="del(index)">删除</a>
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
import datePicker from '@/components/common/datePicker.vue';
import { disabledRangeHours, disabledRangeMinutes, disabledRangeSeconds } from '@/utils';
const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});
const currentDate = ref([]);
// 点击日期组件的回调
const handelChange = (event: any) => {
	console.log(event);
	currentDate.value = event;
};
const emits = defineEmits(['onSuccess']);
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
	del, guideData, guideChange, travelStore,} =useGuideInfo(props, emits);
getGuideList();
</script>
<style lang="less" scoped>
.tips {
	padding: 0 20px;
	color: #71747a;
	font-size: 14px;
}
.select-guide {
	width: 115px;
	color: #d5d5d5;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.footer-btn {
	display: flex;
	justify-content: flex-end;
	margin: 16px 20px;
}
.footer {
	display: flex;
	justify-content: center;
	margin: 16px 20px;
}
.ant-form-item{
	margin-top: 24px;
}
</style>
