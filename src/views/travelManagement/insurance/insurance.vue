<template>
	<div class="tourist-container">
		<a-radio v-model:checked="checked" class="tips">购买一卡通推荐的【****】保险</a-radio>
		<a-form ref="formRef" :rules="rulesRef" :model="editableData" autocomplete="off" labelAlign="left">
			<p class="check">请勾选待购买保险的游客</p>
			<CommonTable :row-selection="{ onSelect }" :columns="columns" :dataSource="tableData" :scrollY="false">
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
									<a-select-option v-for="val in column.data" :key="val.codeValue" :value="val.codeValue">{{ val.name }}</a-select-option>
								</a-select>
							</a-form-item>

							<template v-else>
								{{ column.data.filter((it) => it.codeValue === text)[0]?.name }}
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
					<template v-if="column.key === 'addressId'">
						<a-form-item v-if="editableData[record.key ? record.key : record.oid]" :name="[record.key ? record.key : record.oid, column.key]">
							<a-cascader
								v-if="editableData[record.key ? record.key : record.oid]"
								:load-data="loadData"
								v-model:value="editableData[record.key ? record.key : record.oid][column.key]"
								:options="cityOptions"
								@change="(val, option) => handleChange(val, option, record.key ? record.key : record.oid)"
							/>
						</a-form-item>

						<template v-else>
							{{ record.sourceAddressName }}
						</template>
					</template>
					<template v-if="column.key === 'healthCode'">
						<span class="green-code">
							{{ text }}
						</span>
					</template>
					<template v-if="column.key === 'specialCertificatePicture'">
						<Upload></Upload>
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
			<a-button>批量删除</a-button>
		</div>

		<a-radio v-model:checked="checked" class="tips">已在他处购买保险，填写即可：</a-radio>
		<a-form ref="formRef" :rules="rulesRef" :model="editableData2" autocomplete="off" labelAlign="left">
			<CommonTable :row-selection="{ onSelect }" :columns="columns2" :dataSource="tableData2" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<!-- formRef -->

					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>
					<template v-if="inputKey2.includes(column.key)">
						<div>
							<a-form-item v-if="editableData2[record.key ? record.key : record.oid]" :name="[record.key ? record.key : record.oid, column.key]">
								<a-input v-model:value="editableData2[record.key ? record.key : record.oid][column.key]" placeholder="请输入" />
							</a-form-item>

							<template v-else>
								{{ text }}
							</template>
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" v-if="!editableData2[record.key ? record.key : record.oid]" @click="edit(record.key ? record.key : record.oid)">编辑</a>
							<a class="item" v-else @click="save(record.key ? record.key : record.oid)">确定</a>
							<a class="item" @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>
		<div class="footer-btn">
			<a-button type="primary" @click="add">添加</a-button>
			<a-button>批量删除</a-button>
		</div>
	</div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import Upload from '@/components/common/Upload.vue';
import { useInsurance } from './insurance';
import { ref } from 'vue';
const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});
const checked = ref<boolean>(false);
const emits = defineEmits(['onSuccess']);
const {
	columns,
	columns2,
	tableData,
	tableData2,
	editableData,
	editableData2,
	edit,
	save,
	onSelect,
	selectKey,
	inputKey,
	inputKey2,
	cityOptions,
	add,
	del,
	rulesRef,
	formRef,
	loadData,
	handleChange,
} = useInsurance(props, emits);
</script>
<style lang="less" scoped>
.action-btn {
	margin: 0 20px 16px;
	display: flex;
	justify-content: flex-end;
	button {
		margin-left: 16px;
	}
}
:v-deep(.ant-upload-drag) {
	width: 64px;
	height: 34px;
	border: 1px solid #d5d5d5;
	background-color: #fff;
}
:v-deep(.ant-upload-drag .ant-upload) {
	padding: 5px 0;
}
:v-deep(.ant-upload-drag .anticon-plus) {
	color: #777;
	font-size: 16px;
}
.footer-btn {
	display: flex;
	justify-content: flex-end;
	margin: 16px 20px;
	button:first-of-type {
		margin-right: 16px;
	}
}
.tips {
	padding: 0 20px;
	color: #71747a;
	font-size: 14px;
}
.check {
	padding: 20px 20px 0px;
	font-size: 17px;
}
</style>
