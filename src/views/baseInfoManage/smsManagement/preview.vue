<template>
	<div class="warp">
		<div class="trave-contaner">
			<header>群发人员名单</header>
			<a-form ref="formRef" :rules="rulesRef" :model="editableData" autocomplete="off" labelAlign="left">
				<CommonTable :dataSource="tableData" :columns="columns" style="padding: 0" :scrollY="false">
					<template #button>
						<a-button type="primary" style="margin-right: 20px;" @click="ImportContact" >导入名单</a-button>
						<a-button type="primary" @click="downContact">下载模板</a-button>
					</template>
					<template #bodyCell="{ column, text, index, record }">
						<template v-if="column.key === 'index'">
							{{ index + 1 }}
						</template>
						<template v-if="inputKey.includes(column.key)">
							<div style="width: 98px">
								<a-form-item v-if="editableData[record.key ? record.key : record.oid]" :name="[record.key ? record.key : record.oid, column.key]">
									<a-input v-model:value="editableData[record.key ? record.key : record.oid][column.key]" placeholder="请输入" style="width: 150px" />
								</a-form-item>
								<template v-else>
									{{ text }}
								</template>
							</div>
						</template>
						<template v-if="column.key === 'action'">
							<div class="action-btns">
								<a class="item" v-if="!editableData[record.key ? record.key : record.oid]" @click="edit(record.key ? record.key : record.oid)"
									>编辑</a
								>
								<a class="item" v-else @click="save(record.key ? record.key : record.oid)">确定</a>
								<a class="item" @click="del(index)">删除</a>
							</div>
						</template>
					</template>
				</CommonTable>
				<CommonPagination
					:current="param.pageNo"
					:page-size="param.pageSize"
					:total="total"
					@change="onHandleCurrentChange"
					@showSizeChange="pageSideChange"
				>
				</CommonPagination>
			</a-form>
			<div class="footer-btn">
				<a-button type="primary" @click="add">添加</a-button>
			</div>

			<header>短信群发配置</header>
			<div class="contant">
				<a-form ref="formtwoRef" :model="formValidate" autocomplete="off" labelAlign="left" :labelCol="{ span: 5 }">
					<a-form-item label="短信模板">
						{{ formValidate.smsContent }}
					</a-form-item>
					<div style="width: 600px" v-for="(i, index) in formValidate.preParam" :key="i">
						<a-form-item
							label="参数配置"
							:name="['preParam', index, 'unice']"
							:rules="[{ required: true, message: '请输入参数' + i.key }]"
							:wrapper-col="{ span: 16 }"
						>
							<div style="display: flex; align-items: center; width: 400px">
								<span style="margin-right: 20px">参数 {{ i.key }}</span
								><a-input v-model:value="i.unice" :placeholder="'请输入参数 ' + i.key" style="width: 300px" />
							</div>
						</a-form-item>
					</div>
					<a-form-item label="短信预览">
						<a-textarea disabled :rows="4" v-model:value="formValidate.smsLook" />
						<a-button style="margin-top: 10px" @click="onlook">生成预览内容</a-button>
					</a-form-item>
					<a-form-item label="预览电话" :rules="[{ required: true, validator: validPhone }]">
						<a-input placeholder style="width: 300px" v-model:value="formValidate.phone"></a-input>
					</a-form-item>
				</a-form>
				<div>
					<a-button style="margin-right: 20px" type="primary" @click="sendPreview">发送预览</a-button>
					<a-button style="margin-right: 20px" type="primary" @click="smsMass">短信群发</a-button>
					<a-button type="primary" @click="goback">取消</a-button>
				</div>
			</div>
		</div>
		<Import v-model="isImport" :params="templateId" @onSearch="install" />
	</div>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { usesmsInfo } from './preview';
import { validPhone } from '@/utils';
import Import from './compinents/Import.vue';

const emits = defineEmits(['update:modelValue', 'cancel', 'onSearch']);

const {
	columns,
	onlook,
	editableData,
	isImport,
	formValidate,
	rulesRef,
	formtwoRef,
	formRef,
	tableData,
	inputKey,
	edit,
	add,
	total,
	param,
	del,
	save,
	onHandleCurrentChange,
	pageSideChange,
	sendPreview,
	CheckNum,
	goback,
	ImportContact,
	smsMass,
	downContact,
	templateId,
	install
} = usesmsInfo();
</script>

<style lang="less" scoped>
.warp {
	padding: 16px 20px;
	header {
		// width: 64px;
		// margin-bottom: 8px;
		height: 56px;
		line-height: 56px;
		font-weight: bold;
		color: #1e2226;
		// margin: 0 8px 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
	}
	.contant {
		width: 601px;
	}
}
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

.ant-form-item-explain-error {
	width: 100px !important;
}
</style>
