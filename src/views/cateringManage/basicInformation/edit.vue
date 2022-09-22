<template>
	<div class="warp">
		<div class="form_pad">
			<header>基本信息</header>
			<a-form
				:model="formData"
				ref="formRef"
				:rules="rules"
				labelAlign="left"
				:label-col="{ span: 3 }"
				:wrapper-col="{ span: 6 }"
				autocomplete="off"
				@finish="onFinish"
				@finishFailed="onFinishFailed"
			>
				<a-form-item label="门店名称" name="name">
					<a-input v-model:value="formData.data.name" />
				</a-form-item>
				<a-form-item label="企业类型" name="businessType">
					<a-input v-model:value="formData.data.businessType" />
				</a-form-item>
				<a-form-item label="门店地址" :wrapperCol="{ span: 10 }" name="ac">
					<a-space>
						<a-select style="width: 120px"> 啊</a-select>
						<a-select style="width: 120px"> 啊</a-select>
						<a-select style="width: 120px"> 啊</a-select>
						<a-input v-model:value="formData.data.addressDetail" placeholder="请输入详细地址" />
					</a-space>
				</a-form-item>
				<a-form-item label="统一社会信用代码" name="creditCode">
					<a-input v-model:value="formData.data.creditCode" />
				</a-form-item>
				<a-form-item label="营业执照" name="businessLicense">
					<a-upload
						:maxCount="1"
						action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
						list-type="picture-card"
						@preview="handlePreview"
						class="uploadArea"
						v-model:fileList="formData.data.businessLicense"
					>
						<p class="ant-upload-drag-icon">上传图片</p>
						<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
							<img alt="example" style="width: 100%" :src="previewImage" />
						</a-modal>
					</a-upload>
				</a-form-item>
				<a-form-item label="联系人姓名" name="contactName">
					<a-input v-model:value="formData.data.contactName" placeholder="请输入联系人姓名" />
				</a-form-item>
				<a-form-item label="联系人电话" name="phone">
					<a-input v-model:value="formData.data.phone" placeholder="请输入联系人电话" />
				</a-form-item>
				<a-form-item label="企业状态" name="onOff">
					<a-radio-group v-model:value="formData.data.onOff">
						<a-radio :value="1">开通</a-radio>
						<a-radio :value="0">关闭</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="账户类型" name="accountType">
					<a-radio-group v-model:value="formData.data.accountType">
						<a-radio :value="1">对公账号</a-radio>
						<a-radio :value="2">个人账号</a-radio>
					</a-radio-group>
				</a-form-item>
				<div class="title">结算（收款）账户信息</div>

				<a-form-item label="收款账号" name="bankAccount">
					<a-input v-model:value="formData.data.bankAccount" placeholder="请输入收款银行卡号" />
				</a-form-item>
				<a-form-item label="账户名" name="bankAccountName">
					<a-input v-model:value="formData.data.bankAccountName" placeholder="请输入账户名" />
				</a-form-item>
				<a-form-item label="开户行地址" name="accountAddress">
					<a-input v-model:value="formData.data.accountAddress" placeholder="请输入开户行地址" />
				</a-form-item>
				<a-form-item label="收款行" name="bank">
					<a-input v-model:value="formData.data.bank" placeholder="请输入收款行" />
				</a-form-item>
				<div class="title">补充说明</div>

				<a-form-item label="营业时间" required>
					<a-time-picker v-model:value="formData.data.starttime" valueFormat="HH:mm:ss" :placeholder="formData.data.startTime" />
					<a-time-picker v-model:value="formData.data.endtime" valueFormat="HH:mm:ss" :placeholder="formData.data.endTime" />
				</a-form-item>
				<a-form-item label="联系电话" name="shopPhone">
					<a-input v-model:value="formData.data.shopPhone" placeholder="请输入联系电话" />
				</a-form-item>
				<a-form-item label="其他" name="cateringDesc">
					<a-input v-model:value="formData.data.cateringDesc" placeholder="请输入" />
				</a-form-item>
			</a-form>
		</div>
		<div class="footer">
			<a-button type="primary">保存</a-button>
			<a-button type="primary">提交审核</a-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import CommonSearch from '@/components/common/CommonSearch.vue';
import { onMounted, reactive, toRaw, ref, watch } from 'vue';
import api from '@/api';

const navigatorBar = useNavigatorBar();
const route = useRouter();

const rules = {
	name: [{ required: true, message: '门店名称是必填的', trigger: 'change' }],
	businessType: [{ required: true, message: '企业类型是必填的', trigger: 'change' }],
	addressDetail: [{ required: true, message: '门店地址是必填的', trigger: 'change' }],
	creditCode: [{ required: true, message: '统一社会信用代码是必填的', trigger: 'change' }],
	businessLicenseUrl: [{ required: true, message: '营业执照是必填的', trigger: 'change' }],
	contactName: [{ required: true, message: '联系人姓名是必填的', trigger: 'change' }],
	phone: [{ required: true, message: '联系人电话是必填的', trigger: 'change' }],
	onOff: [{ required: true, message: '企业状态是必填的', trigger: 'change' }],
	bankAccount: [{ required: true, message: '收款账号是必填的', trigger: 'change' }],
	bankAccountName: [{ required: true, message: '账户名是必填的', trigger: 'change' }],
	accountAddress: [{ required: true, message: '开户行地址是必填的', trigger: 'change' }],
	bank: [{ required: true, message: '收款行是必填的', trigger: 'change' }],
	accountType: [{ required: true, message: '企业状态是必填的', trigger: 'change' }],
	startTime: [{ required: true, message: '营业时间是必填的', trigger: 'change' }],
	cateringDesc: [{ required: true, message: '联系电话是必填的', trigger: 'change' }],
	shopPhone: [{ required: true, message: '店铺联系电话是必填的', trigger: 'change' }],
};

const onSubmit = () => {
	console.log('submit!', toRaw(formState));
};
const onFinish = (values: any) => {
	console.log('Success:', values);
};

// 上传
const previewVisible = ref<boolean>(false);
const previewImage = ref<string | undefined>('');
const handleCancel = () => {
	previewVisible.value = false;
};
const handlePreview = async (file: FileItem) => {
	if (!file.url && !file.preview) {
		file.preview = (await getBase64(file.originFileObj)) as string;
	}
	previewImage.value = file.url || file.preview;
	previewVisible.value = true;
};

const formData = reactive({
	data: [],
});

const onFinishFailed = (errorInfo: any) => {
	console.log('Failed:', errorInfo);
};

const initPage = async (): Promise<void> => {
	console.log(route);
	api.getCateringInfo(route.currentRoute.value?.query?.oid).then((res: any) => {
		formData.data = res;
	});
};

onMounted(() => {
	initPage();
	navigatorBar.setNavigator(['基础信息管理', '编辑']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less">
.warp {
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
	width: 100%;
	box-sizing: border-box;
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
