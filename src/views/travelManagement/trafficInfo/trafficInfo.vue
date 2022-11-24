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
								<a-select style="width: 100%" placeholder="请选择" v-model:value="editableData[record.key ? record.key : record.oid][column.key]">
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
								<a-range-picker
									:disabled-date="travelStore.setDisabled"
									:disabled-time="travelStore.setDisabledTime"
									v-model:value="editableData[record.key ? record.key : record.oid][column.key]"
									:show-time="{
												defaultValue: [
												dayjs(`${travelStore.setStarEndHMS.start.hour} : ${travelStore.setStarEndHMS.start.min} : ${travelStore.setStarEndHMS.start.second}`, 
												'HH:mm:ss'), 
												dayjs(`${travelStore.setStarEndHMS.end.hour} : ${travelStore.setStarEndHMS.end.min} : ${travelStore.setStarEndHMS.end.second}`, 
												'HH:mm:ss')]
											}"
									format="YYYY-MM-DD HH:mm:ss"
									value-format="YYYY-MM-DD HH:mm:ss"
									@change="(event) => handleTime(event, record.key ? record.key : record.oid)"
								/>
							</a-form-item>

							<template v-else>
								{{ record.startDate + '-' + record.endDate }}
							</template>
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" :class="{'disabled': !travelStore.teamStatus}" v-if="!editableData[record.key ? record.key : record.oid]" @click="edit(record.key ? record.key : record.oid)">编辑</a>
							<a class="item" :class="{'disabled': !travelStore.teamStatus}" v-else @click="save(record.key ? record.key : record.oid)">确定</a>
							<a class="item" :class="{'disabled': !travelStore.teamStatus}" @click="del(record, index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>
		<div class="footer-btn" v-if="travelStore.teamStatus">
			<a-button type="primary" @click="add">添加</a-button>
			<!-- <a-button>批量删除</a-button> -->
		</div>
	</div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import Upload from '@/components/common/Upload.vue';
import { useTrafficInfo } from './trafficInfo';
import dayjs from 'dayjs';

const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});
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
