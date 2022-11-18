<template>
	<div class="tourist-container">
		<div class="action-btn">
			<a-button type="primary">模板下载</a-button>
			<a-button type="primary" v-if="travelStore.teamStatus">批量导入</a-button>
			<a-button type="primary">中高风险地区一键检查</a-button>
			<a-button type="primary">健康码一键检查</a-button>
		</div>
		<a-form ref="formRef" :rules="rulesRef" :model="editableData" autocomplete="off" labelAlign="left">
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
								<a-input @blur="changeIDCard(record.key ? record.key : record.oid, column.key)" v-model:value="editableData[record.key ? record.key : record.oid][column.key]" placeholder="请输入" />
							</a-form-item>

							<template v-else>
								{{ text }}
							</template>
						</div>
					</template>
					<template v-if="column.key === 'sourceAddressName'">
						<a-form-item v-if="editableData[record.key ? record.key : record.oid]" :name="[record.key ? record.key : record.oid, column.key]">
							<a-cascader
								v-if="editableData[record.key ? record.key : record.oid]"
								:load-data="loadData"
								:placeholder="record.sourceAddressName"
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
						<!-- <Upload class="upload-img"></Upload> -->
						<div>
							<div v-if="!editableData[record.key ? record.key : record.oid]">
								<a-image
									v-for="url in record.specialCertificatePicture"
									:key="url"
									:width="50"
									:src="url"
								/>
							</div>
							<Upload 
								v-else
								v-model="fileUrl"
								@remove="($event) => removeImg($event, record.key ? record.key : record.oid)"
								@result="($event) => changeUpload($event, record.key ? record.key : record.oid)" :maxCount="2">
								<plus-outlined></plus-outlined>
							</Upload>

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
		<div class="footer-btn">
			<a-button v-if="travelStore.teamStatus" type="primary" @click="add">添加</a-button>
			<a-button v-if="travelStore.teamStatus" @click="bathDel">批量删除</a-button>
		</div>
		<div class="">
			<div>
				<a-row type="flex" justify="center">
					<!-- <a-col style="text-align: center" span="3"><a-button type="primary">中高风险地区一键检查</a-button></a-col> -->
					<a-col style="text-align: center" span="3"><a-button class="btn" type="danger">有中高风险地区！</a-button></a-col>
					<a-col style="text-align: center" span="3"><a-button class="btn" type="danger">有黄码或红码！</a-button></a-col>
				</a-row>
			</div>
			<div style="margin-top: 36px; margin-bottom: 36px">
				<a-row type="flex" justify="center">
					<!-- <a-col style="text-align: center" span="3"><a-button type="primary">健康码一键检查</a-button></a-col> -->
					<a-col style="text-align: center" span="3"><a-button class="btn" type="primary">无中高风险地区！</a-button></a-col>
					<a-col style="text-align: center" span="3"><a-button class="btn" type="primary">全员绿码！</a-button></a-col>
				</a-row>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import Upload from '@/components/common/imageWrapper.vue';
import { useTouristInfo } from './touristInfo';
import { PlusOutlined } from '@ant-design/icons-vue';

const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});
const emits = defineEmits(['onSuccess']);
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
	del,
	bathDel,
	rulesRef,
	formRef,
	loadData,
	handleChange,
	travelStore,
	changeIDCard,
	changeUpload,
	fileUrl,
	removeImg
} = useTouristInfo(props, emits);
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

.upload-img,::v-deep(.ant-upload-drag) {
	width: 64px !important;
	height: 34px !important;
	border: 1px solid #d5d5d5 !important;
	background-color: #fff !important;
}
.upload-img,::v-deep(.ant-upload-drag .ant-upload) {
	padding: 5px 0 !important;
	width: 100% !important;
	height: 100%;
}
::v-deep(.ant-upload-list) {
	width: 64px;
	height: 34px;
	display: flex;
	flex: 1;
}
::v-deep(.ant-upload-list-picture-card-container) {
	width: 100%;
	height: 100%;	
}
::v-deep(.ant-upload-list-item) {
	padding: 0;
}
.upload-img,::v-deep(.ant-upload-drag .anticon-plus) {
	color: #777 !important;
	font-size: 16px !important;
}

::v-deep(.ant-select-selection-placeholder) {
	color: #333;
}
::v-deep(.ant-image) {
	margin-left: 10px;
}
.footer-btn {
	display: flex;
	justify-content: flex-end;
	margin: 16px 20px;
	button:first-of-type {
		margin-right: 16px;
	}
}
.btn {
	width: 189px;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 40px;
	line-height: 40px;
	box-shadow: 2px 3px 10px rgba(1, 5, 22, 0.16);
}
</style>
