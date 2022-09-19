<template>
	<div class="warp">
		<div class="form_pad">
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
				<a-card title="基本信息"  style="width: 100%" :bordered="false">
					<a-form-item label="所属门店" name="name">
						<a-input v-model:value="formState.name" />
					</a-form-item>
					<a-form-item label="餐饮名称" >
						<a-input placeholder="请输入餐饮名称" />
					</a-form-item>
					<a-form-item label="可预订数量" >
						<a-input  placeholder="请输入可预订数量，单位：人"/>
					</a-form-item>
					<a-form-item label="单价" >
						<a-input placeholder="请输入单价，单位：元/人" />
					</a-form-item>
					<a-form-item label="图片" >
						<img :width="200" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
					</a-form-item>
					<a-form-item label="状态" >
						<a-radio value="1">启用</a-radio>
						<a-radio  value="2">禁用</a-radio>
					</a-form-item>
				</a-card>
				<a-card title="其他信息"  style="width: 100%" :bordered="false">
					<a-form-item label="供餐时间" >
						<a-space direction="vertical">
							<a-date-picker style="width: 334px" :showToday="false" placeholder="请选择供餐时间"/>
						</a-space>
					</a-form-item>
					<a-form-item label="其他" >
						<a-input placeholder="请输入" />
					</a-form-item>
				</a-card>
			</a-form>
		</div>
		<div class="footer">
			<a-button type="primary">保存</a-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import { Moment } from 'moment';
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
	.edit_btn {
		background-color: #5db179;
		color: white;
		border-radius: 5px;
	}

	.form_pad {
		padding: 20px 40px 60px;
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
