<template>
	<div class="warp">
		<div class="form_pad">
			<header>基本信息</header>
			<a-form
				:model="formState"
				name="basic"
				:rules="rulesRef"
				labelAlign="left"
				:label-col="{ span: 3 }"
				:wrapper-col="{ span: 6 }"
				autocomplete="off"
				@finish="onFinish"
				@finishFailed="onFinishFailed"
			>
				<a-form-item label="团单类型">
					<a-select>
						<a-select-option value="lucy">Lucy</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="费用名称" name="name">
					<a-input v-model:value="formState.name" placeholder="请输入费用名称" />
				</a-form-item>
				<a-form-item label="费用说明" name="name">
					<a-input v-model:value="formState.name" placeholder="请输入说明" />
				</a-form-item>
				<a-form-item label="状态">
					<a-radio value="1">启用</a-radio>
					<a-radio value="2">禁用</a-radio>
				</a-form-item>
				<a-form-item label="优先级" name="name">
					<a-input v-model:value="formState.name" placeholder="请输入规则优先级" />
				</a-form-item>
				<div class="title">扣费规则</div>
				<a-form-item label="收费模式">
					<a-radio value="1">百分比</a-radio>
					<a-radio value="2">人数</a-radio>
					<a-radio value="2">价格</a-radio>
				</a-form-item>
				<a-form-item label="收费数量" name="name">
					<a-input v-model:value="formState.name" placeholder="请输入数值(单位：%，元/人、元)" />
				</a-form-item>
				<a-form-item label="是否垫付">
					<a-radio value="1">是</a-radio>
					<a-radio value="2">否</a-radio>
				</a-form-item>
				<a-form-item label="垫付单位">
					<a-radio value="1">旅行社</a-radio>
				</a-form-item>
				<div class="title">
					分账规则
					<a-button style="margin-left: 5px" type="primary" @click="addRules">新增</a-button>
				</div>
				<div>
					<a-form-item label="剩余费用归属">
						<a-select>
							<a-select-option value="lucy">Lucy</a-select-option>
						</a-select>
					</a-form-item>
				</div>
				<div style="height: 300px">
					<CommonTable :dataSource="data" :columns="columns"> </CommonTable>
				</div>
			</a-form>
		</div>
	</div>
	<div class="footer">
		<a-button type="primary">保存</a-button>
	</div>
	<rules-add-update v-model="rulesShow" />
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import { UnwrapRef } from 'vue';
import RulesAddUpdate from './rules-add-update.vue';
interface FormState {
	name: string;
	list: any;
}

const formState: UnwrapRef<FormState> = reactive({
	name: '',
	list: [
		{
			scenicLevel: 'kobe',
		},
		{
			ac: 'kobe',
		},
		{
			ad: 'kobe',
		},
		{
			ab: 'kobe',
		},
		{
			aq: 'kobe',
		},
		{
			af: 'kobe',
		},
	],
});
const data = ref([
	{
		scenicLevel: 'kobe',
	},
	{
		ac: 'kobe',
	},
	{
		ad: 'kobe',
	},
	{
		ab: 'kobe',
	},
	{
		aq: 'kobe',
	},
	{
		af: 'kobe',
	},
]);
const columns = ref([
	{
		title: '序号',
		dataIndex: 'scenicLevel',
		key: 'scenicLevel',
	},
	{
		title: '分账单位',
		dataIndex: 'ac',
		key: 'ac',
	},
	{
		title: '分账百分比',
		dataIndex: 'ad',
		key: 'ad',
	},
	{
		title: '操作',
		dataIndex: 'ac',
		key: 'ac',
	},
]);
const rulesRef = {
	name: [{ required: true, message: '请输入' }],
};
const addRules = () => {
	rulesShow.value = true;
};
const rulesShow = ref(false);
const onFinish = (values: any) => {
	console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
	console.log('Failed:', errorInfo);
};
</script>

<style lang="less">
.warp {
	width: 100%;
	box-sizing: border-box;
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
	.title {
		height: 56px;
		line-height: 56px;
		font-weight: bold;
		color: #1e2226;
		// margin: 0 8px 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
	}
	.edit_btn {
		background-color: #5db179;
		color: white;
		border-radius: 5px;
	}

	.form_pad {
		padding: 0 16px 60px;
	}
	.footer {
		position: fixed;
		bottom: 11px;
		background-color: #fff;
		line-height: 64px;
		width: 83.5%;
		border-top: 1px solid #f1f2f5;
		button {
			margin-left: 20px;
		}
	}
}
</style>
