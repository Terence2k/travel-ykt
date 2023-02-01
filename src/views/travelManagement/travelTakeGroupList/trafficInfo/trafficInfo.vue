<template>
	<div class="tourist-container">
		<a-form ref="formRef" :rules="rulesRef" :model="editableData" autocomplete="off" labelAlign="left">
			<CommonTable :columns="columns" :dataSource="tableData" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<!-- formRef -->

					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>

					<template v-if="selectKey.includes(column.key)">
						<div>
							<a-form-item v-if="editableData[record.key ? record.key : record.oid]" :name="[record.key ? record.key : record.oid, column.key]">
								<a-select style="width: 100%" v-model:value="editableData[record.key ? record.key : record.oid][column.key]">
									<a-select-option v-for="val in column.data" :key="val.codeValue" :value="val.name">{{ val.name }}</a-select-option>
								</a-select>
							</a-form-item>

							<template v-else>
								{{ text }}
								<!-- {{ column.key === 'transportationType' ? column.data.filter(it => it.codeValue === text)[0]?.name : text }} -->
							</template>
						</div>
					</template>

					<template v-if="inputKey.includes(column.key)">
						<div>
							<a-form-item v-if="editableData[record.key ? record.key : record.oid]" :name="[record.key ? record.key : record.oid, column.key]">
								<a-input v-model:value="editableData[record.key ? record.key : record.oid][column.key]" placeholder="请输入" />
							</a-form-item>

							<template v-else>
								{{ text }}
							</template>
						</div>
					</template>
					<template v-if="column.key === 'time'">
						<div>
							<a-form-item v-if="editableData[record.key ? record.key : record.oid]" :name="[record.key ? record.key : record.oid, column.key]">
								<!-- <a-range-picker
									:disabled-date="travelStore.setDisabled"
									v-model:value="editableData[record.key ? record.key : record.oid][column.key]"
									show-time
									format="YYYY-MM-DD HH:mm:ss"
									value-format="YYYY-MM-DD HH:mm:ss"
									@change="(event) => handleTime(event, record.key ? record.key : record.oid)"
								/> -->
								<datePicker
										style="width: 300px"
										v-model="editableData[record.key ? record.key : record.oid][column.key]"
										type="datetimerange"
										popper-class="hidden-date-picker"
										:default-time="[travelStore.defaultStartTime, travelStore.defaultEndTime]"
										start-placeholder="用车开始时间"
										end-placeholder="用车结束时间"
										@calendar-change="handelChange"
										@change="(event) => handleTime(event, record.key ? record.key : record.oid)"
										value-format="YYYY-MM-DD HH:mm:ss"
										:disabled-hours="(type: string) => disabledRangeHours(currentDate, type)"
										:disabled-minutes="(_: any, type: string) => disabledRangeMinutes(currentDate, type)"
										:disabled-seconds="(_: any, m: any , type: string) => disabledRangeSeconds(currentDate, type)"
										:disabled-date="travelStore.setDisabledDate()"
									/>
							</a-form-item>

							<template v-else>
								{{ record.startDate + '-' + record.endDate }}
							</template>
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item"  v-if="!editableData[record.key ? record.key : record.oid]" @click="edit(record.key ? record.key : record.oid)">编辑</a>
							<a class="item"  v-else @click="save(record.key ? record.key : record.oid)">确定</a>
							<a class="item"  @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>
		<div class="footer-btn" >
			<a-button type="primary" @click="add">添加</a-button>
			<!-- <a-button>批量删除</a-button> -->
		</div>
	</div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import Upload from '@/components/common/Upload.vue';
import { useTrafficInfo } from './trafficInfo';
import { disabledRangeHours, disabledRangeMinutes, disabledRangeSeconds } from '@/utils';
import datePicker from '@/components/common/datePicker.vue';
const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});
const currentDate = ref([])
// 点击日期组件的回调
const handelChange = (event: any) => {
	console.log(event)
	currentDate.value = event;
}
const emits = defineEmits(['onSuccess']);
const { columns, tableData, editableData, edit, save, onSelect, selectKey, inputKey, travelStore, add, del, rulesRef, formRef, handleTime } =
	useTrafficInfo(props, emits);
</script>
<style lang="less" scoped>
::v-deep(.ant-upload-select-picture-card) {
	width: 64px;
	height: 34px;
	border: 1px solid #d5d5d5;
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
