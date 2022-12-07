<template>
	<BaseModal :title="options.title" v-model="dialogVisible" style="width: 800px">
		<div class="head_btn">
			<a>下载模板</a>
			<a>导入名单</a>
		</div>
		<a-form ref="formRef" :rules="rulesRef" :model="editableData" autocomplete="off" labelAlign="left">
			<CommonTable :dataSource="tableData" :columns="columns" style="padding: 0" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						{{ index + 1 }}
					</template>
					<template v-if="inputKey.includes(column.key)">
						<div>
							<a-form-item :name="[record.key ? record.key : record.oid, column.key]">
								<a-input v-model:value="editableData[record.key ? record.key : record.oid][column.key]" placeholder="请输入" />
							</a-form-item>
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" @click="save(record.key ? record.key : record.oid)">确定</a>
							<a class="item" @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>
		<div class="footer-btn">
			<a-button type="primary" @click="add">添加</a-button>
		</div>
		<template v-slot:footer>
			<a-button @click="cancel">取消</a-button>
			<a-button type="primary" @click="dialogVisible = false">确定</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import { useTouristInfo } from './recipient';
const props = reactive({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});
const emits = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const { columns, editableData, dialogVisible, options, rulesRef, formRef, tableData, inputKey, add, cancel, del, save } = useTouristInfo(
	props,
	emits
);
</script>

<style lang="less" scoped>
.footer-btn {
	display: flex;
	justify-content: flex-end;
	margin: 16px 20px;
	button:first-of-type {
		margin-right: 16px;
	}
}
.head_btn {
	width: 100%;
	text-align: right;
	padding-bottom: 10px;
	a {
		padding: 0 10px;
	}
}
.ant-form-item {
	margin-top: 22px;
}
</style>
