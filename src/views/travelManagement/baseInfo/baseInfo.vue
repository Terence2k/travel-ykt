<template>
	<div>
		<div class="import-btn">
			<a-button type="primary">导入模板</a-button>
		</div>
		<a-form
			:model="formState"
			name="basic"
			:rules="rulesRef"
			labelAlign="left"
			:label-col="{ span: 2 }"
			:wrapper-col="{ span: 6 }"
			autocomplete="off"
			@finish="onFinish"
			@finishFailed="onFinishFailed"
		>
			<a-form-item
			label="行程类型"
			name="f"
			>
			<!-- <a-input v-model:value="formState.username" /> -->
				<a-radio-group v-model:value="formState.f" name="radioGroup">
					<a-radio value="1">标准团</a-radio>
					<a-radio value="2">散客网点团</a-radio>
					<a-radio value="3">休闲通道团</a-radio>
				</a-radio-group>
			</a-form-item>

			<a-form-item label="发团旅行社" name="username">
				<a-input v-model:value="formState.username" disabled />
			</a-form-item>

			<a-form-item label="做团人">
				<a-select v-model:value="formState.s" placeholder="请选择组团社做团人">
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="联系电话" name="password">
				<a-input v-model:value="formState.password" />
			</a-form-item>

			<a-form-item label="地接旅行社" name="type">
				<a-select v-model:value="formState.type" placeholder="请选择地接旅行社">
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="地接计调">
				<a-select v-model:value="formState.w" placeholder="请选择地接做团人">
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="行程人数" name="a">
				<a-input v-model:value="formState.a" plcaeholder="单位：人" />
			</a-form-item>

			<a-form-item label="线路类型" name="b">
				<a-input v-model:value="formState.b" />
			</a-form-item>

			<a-form-item label="线路名称" name="c">
				<a-select v-model:value="formState.c" placeholder="请选择线路名称">
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="* 行程时间">
				<div class="d-flex align-item-center">
					<a-form-item name="d" style="margin-bottom: 0">
						<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formState.d" /> 
					</a-form-item >
					<span class="flex-1 text-center"> 至 </span> 
					<a-form-item name="d2" style="margin-bottom: 0"> 
						<a-date-picker  :show-time="{ format: 'HH:mm' }" v-model:value="formState.d2" />
					</a-form-item>
				</div>
			</a-form-item>

			<a-form-item label="行程单号" name="e">
				<a-input v-model:value="formState.e" disabled />
			</a-form-item>

			<!-- <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
			<a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
			</a-form-item>

			<a-form-item :wrapper-col="{ offset: 8, span: 16 }">
			<a-button type="primary" html-type="submit">Submit</a-button>
			</a-form-item> -->
		</a-form>
		<div class="footer">
			<a-button type="primary">保存</a-button>
			<a-button type="primary">发团</a-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
interface FormState {
  username: string;
  password: string;
  remember: boolean;
	[k:string]:any
}

const rulesRef = {
	f: [{ required: true, message: '请选择行程类型' }],
	username: [{ required: true, message: '请输入发团旅行社' }],
	password: [{ required: true, message: '请输入联系电话' }],
	type: [{ required: true, message: '请选择地接旅行社'}],
	a: [{ required: true, message: '请输入行程人数' }],
	b: [{ required: true, message: '请选择线路类型' }],
	c: [{ required: true, message: '请选择线路名称' }],
	d: [{ required: true, message: '请选择行程开始时间' }],
	d2: [{ required: true, message: '请选择行程结束时间' }],
	e: [{ required: true, message: '请输入行程单号' }],
};

const formState = reactive<FormState>({
	username: '1',
	password: '',
	remember: true,
});
const onFinish = (values: any) => {
	console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
	console.log('Failed:', errorInfo);
};
</script>
<style lang="less" scoped>
	.import-btn {
		display: flex;
		justify-content: end;
		margin-bottom: 10px;
	}
	.footer {
		position: fixed;
		bottom: 16px;
		background-color: #fff;
		line-height: 64px;
		width: 100%;
		border-top: 1px solid #F1F2F5;
		button:first-of-type {
			margin-right: 16px;
		}
	}
</style>