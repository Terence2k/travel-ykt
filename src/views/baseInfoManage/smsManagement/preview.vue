<template>
	<div class="warp">
		<div class="trave-contaner">
			<header>群发人员名单</header>
			<a-form ref="formRef" :rules="rulesRef" :model="editableData" autocomplete="off" labelAlign="left">
				<CommonTable :dataSource="tableData" :columns="columns" style="padding: 0" :scrollY="false">
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
				<a-form ref="formtwoRef" :rules="rulestwo" :model="formValidate" autocomplete="off" labelAlign="left">
					<a-form-item label="短信模板" :label-col="labelCol" name="time">
						{{ formValidate.smsContent }}
					</a-form-item>

					<a-form-item label="参数配置" name="ss" :label-col="labelCol">
                        <div style="margin-bottom:10px ;" v-for="i in pre"  :label-col="labelCol">
                            <span style="margin-right: 20px">参数 {{ i }}</span
							><a-input v-model:value="formValidate.ss" :placeholder="'请输入参数 ' + i" style="width: 200px" />
                        </div>							
					</a-form-item>
					<a-form-item label="短信预览" :label-col="labelCol">
						<a-textarea :rows="4" />
						<a-button style="margin-top: 10px" @click="onlook">生成预览内容</a-button>
					</a-form-item>
					<a-form-item label="预览电话" :label-col="labelCol">
						<a-input placeholder></a-input>
					</a-form-item>
				</a-form>
				<div>
					<a-button style="margin-right: 20px" type="primary">发送预览</a-button>
					<a-button type="primary">短信群发</a-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { usesmsInfo } from './recipient';

const emits = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const {
	columns,
	onlook,
	editableData,
	labelCol,
	rulestwo,
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
	pre,
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
		width: 600px;
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
.ant-form-item {
	margin-top: 22px;
}

.ant-form-item-with-help {
	width: 130px;
}
</style>
