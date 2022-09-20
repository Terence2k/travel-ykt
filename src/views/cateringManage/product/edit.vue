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
					<a-form-item label="所属门店" name="name">
						<a-input v-model:value="formState.name" />
					</a-form-item>
					<a-form-item label="餐饮名称">
						<a-input placeholder="请输入餐饮名称" />
					</a-form-item>
					<a-form-item label="可预订数量">
						<a-input placeholder="请输入可预订数量，单位：人" />
					</a-form-item>
					<a-form-item label="单价">
						<a-input placeholder="请输入单价，单位：元/人" />
					</a-form-item>
					<a-form-item label="图片">
						<img :width="200" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
					</a-form-item>
					<a-form-item label="状态">
						<a-radio value="1">启用</a-radio>
						<a-radio value="2">禁用</a-radio>
					</a-form-item>
					<div class="title">其他信息</div>
					<a-form-item label="供餐时间">
						<a-space direction="vertical">
							<a-date-picker style="width: 357px" v-model:value="value1" :showToday="false" />
						</a-space>
					</a-form-item>
					<a-form-item label="其他">
						<a-input placeholder="请输入" />
					</a-form-item>
			</a-form>
		</div>
		<div class="footer">
			<a-button type="primary">保存</a-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import { computed, reactive, toRaw, UnwrapRef, watch } from 'vue';
interface FormState {
	name: string;
}

const rulesRef = {
	name: [{ required: true, message: '请输入' }],
};

const formState: UnwrapRef<FormState> = reactive({
	name: '',
});

// 模拟地址

const onSubmit = () => {
	console.log('submit!', toRaw(formState));
};
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
