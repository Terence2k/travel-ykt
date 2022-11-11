<template>
	<BaseModal title="设置核销时间段" v-model="modelValue" @close="cancel" :width="800">
		<a-form ref="formRef" :model="formValidate" rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
			<a-form-item label="门票名称" name="ticketName">
				<a-input disabled v-model:value="state.tableData.ticketName" />
			</a-form-item>
			<a-form-item label=" 门票大类" name="ticketDataType">
				<a-input disabled v-model:value="state.tableData.ticketDataType" />
			</a-form-item>
			<a-form-item label=" 开始时间" name="startTime" v-if="formValidate.row.ticketType == '2'">
				<a-input disabled v-model:value="state.tableData.data.startTime" />
			</a-form-item>
			<a-form-item label=" 结束时间" name="endTime" v-if="formValidate.row.ticketType == '2'">
				<a-input disabled v-model:value="state.tableData.data.endTime" />
			</a-form-item>
			<p v-if="formValidate.row.ticketType == '0'">
				<CommonTable :dataSource="state.tableData.data" :columns="columns" :scrollY="false">
					<template #bodyCell="{ column, index, record }">
						<template v-if="column.key === 'time'">
							<a-span v-if="record.startTime && record.endTime">有效核销时间段为当天的{{ record.startTime }}分至{{ record.endTime }}分</a-span>
						</template>
					</template>
				</CommonTable>
			</p>
			<p v-if="formValidate.row.ticketType == '1'">
				<CommonTable :dataSource="state.tableData.data" :columns="singleColumns" :scrollY="false">
					<template #bodyCell="{ column, index, record }">
						<template v-if="column.key === 'time'">
							<div class="table-div">
								<a-time-picker format="HH:mm" valueFormat="HH:mm" v-model:value="record.startTime" style="width: 100px" />
								<a-span class="span">至</a-span>
								<a-time-picker format="HH:mm" valueFormat="HH:mm" v-model:value="record.endTime" style="width: 100px" />
							</div>
						</template>
					</template>
				</CommonTable>
			</p>
			<a-form-item label=" 有效核销时间段为当天" name="account" v-if="formValidate.row.ticketType == '2'">
				<div class="table-div">
					<a-time-picker format="HH:mm" valueFormat="HH:mm" v-model:value="state.tableData.startTime" style="width: 150px" />
					<a-span class="span">至</a-span>
					<a-time-picker format="HH:mm" valueFormat="HH:mm" v-model:value="state.tableData.endTime" style="width: 150px" />
				</div>
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="save()" v-if="formValidate.row.ticketType != '0'">保存</a-button>
			<a-button @click="cancel">取消</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import type { FormInstance } from 'ant-design-vue';
import CommonTable from '@/components/common/CommonTable.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});
const columns = [
	{
		title: '子票',
		dataIndex: 'ticketName',
		key: 'ticketName',
	},
	{
		title: '核销项',
		dataIndex: 'itemName',
		key: 'itemName',
	},
	{
		title: '景区',
		dataIndex: 'scenicName',
		key: 'scenicName',
	},
	{
		title: '核销时间',
		dataIndex: 'time',
		key: 'time',
	},
];
const singleColumns = [
	{
		title: '核销项',
		dataIndex: 'itemName',
		key: 'itemName',
	},
	{
		title: '景区',
		dataIndex: 'scenicName',
		key: 'scenicName',
	},
	{
		title: '核销时间',
		dataIndex: 'time',
		key: 'time',
	},
];
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const formValidate: Ref<Record<string, any>> = ref({});
const state = reactive({
	tableData: {
		Time: [],
		startTime: '',
		endTime: '',
		data: [],
		ticketName: '',
		ticketDataType: '',
	},
	ticketId: '',
});
const init = async () => {
	console.log('params', props.params);
	formValidate.value = {};
	formValidate.value = { ...props.params };
	state.ticketId = formValidate.value.row.ticketId;
	api.getScenicVerif(state.ticketId).then((res: any) => {
		console.log('res:', res.itemTimeList);
		state.tableData.data = res.itemTimeList;
		state.tableData.ticketName = res.ticketName;
		if (res.ticketDataType == 0) {
			state.tableData.ticketDataType = '联票';
		} else if (res.ticketDataType == 1) {
			state.tableData.ticketDataType = '单票';
		} else {
			state.tableData.ticketDataType = '演出票';
		}
	});
};
const save = () => {
	let data = {
		ticketId: state.ticketId,
		itemTimeList: state.tableData.data.map((item: any) => {
			return {
				oid: item.oid,
				startTime: item.startTime,
				endTime: item.endTime,
			};
		}),
	};
	api.getScenicSave(data).then((res: any) => {
		message.success('设置成功');
		cancel();
	})
};
const cancel = () => {
	dialogVisible.value = false;
};
watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style>
.input {
	width: 50px;
	margin: 0px 10px;
}
.span_width {
	margin: 0 20px;
}
.span {
	margin: 0px 10px;
	line-height: 30px;
}
.table-div {
	display: flex;
}
.time {
	margin-right: 48px;
	line-height: 30px;
}
</style>
