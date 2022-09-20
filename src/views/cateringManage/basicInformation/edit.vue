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
				<a-card title="基本信息" style="width: 100%" :bordered="false">
					<a-form-item label="门店名称" name="ac">
						<a-input v-model:value="formState.name" />
					</a-form-item>
					<a-form-item label="企业类型" name="ac">
						<a-input v-model:value="formState.name" />
					</a-form-item>
					<a-form-item label="门店地址" :wrapperCol="{ span: 10 }" name="ac">
						<a-space>
							<a-select style="width: 120px"> 啊</a-select>
							<a-select style="width: 120px"> 啊</a-select>
							<a-select style="width: 120px"> 啊</a-select>
							<a-input v-model:value="formState.name" placeholder="请输入详细地址" />
						</a-space>
					</a-form-item>
					<a-form-item label="统一社会信用代码" name="ac">
						<a-input v-model:value="formState.name" />
					</a-form-item>
					<a-form-item label="营业执照" name="ac">
						<a-image :width="200" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
					</a-form-item>
					<a-form-item label="联系人姓名" name="ac">
						<a-input v-model:value="formState.name" placeholder="请输入联系人姓名" />
					</a-form-item>
					<a-form-item label="联系人电话" name="ac">
						<a-input v-model:value="formState.name" placeholder="请输入联系人电话" />
					</a-form-item>
					<a-form-item label="企业状态" name="ac">
						<a-radio>开通</a-radio>
						<a-radio>关闭</a-radio>
					</a-form-item>

					<a-form-item label="企业状态" name="ac">
						<a-radio>对公账号</a-radio>
						<a-radio>个人账号</a-radio>
					</a-form-item>
				</a-card>
				<a-card title="结算（收款）账户信息" style="width: 100%" :bordered="false">
					<a-form-item label="收款账号" name="ac">
						<a-input v-model:value="formState.name" placeholder="请输入收款银行卡号" />
					</a-form-item>
					<a-form-item label="账户名" name="ac">
						<a-input v-model:value="formState.name" placeholder="请输入账户名" />
					</a-form-item>
					<a-form-item label="开户行地址" name="ac">
						<a-input v-model:value="formState.name" placeholder="请输入开户行地址" />
					</a-form-item>
					<a-form-item label="收款行" name="ac">
						<a-input v-model:value="formState.name" placeholder="请输入收款行" />
					</a-form-item>
				</a-card>
				<a-card title="补充说明" style="width: 100%" :bordered="false">
					<a-form-item label="营业时间" name="ac">
						<a-space direction="vertical">
							<a-date-picker style="width: 334px" v-model:value="value1" :showToday="false" />
						</a-space>
					</a-form-item>
					<a-form-item label="联系电话" name="ac">
						<a-input v-model:value="formState.name" placeholder="请输入联系电话" />
					</a-form-item>
					<a-form-item label="其他" name="ac">
						<a-input v-model:value="formState.name" placeholder="请输入" />
					</a-form-item>
				</a-card>
			</a-form>
		</div>
		<div class="footer">
			<a-button type="primary">保存</a-button>
			<a-button type="primary">提交审核</a-button>
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
	ac: [{ required: true, message: '请输入' }],
};

const formState: UnwrapRef<FormState> = reactive({
	name: '',
});

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
