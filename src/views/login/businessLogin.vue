<template>
	<div class="form_box">
		<div class="text">
			<span style="margin-right: 148px; cursor: pointer" @click="goTo">
				<arrow-left-outlined />返回
			</span>
			<span class="span">企业注册</span>
		</div>
		<businessLoginForm ref="businessLoginRef" :model="form" @finish="handleFinish">
			<template #submit>
				<a-button html-type="submit" class="btn" type="primary" :loading="loading">提交</a-button>
			</template>
		</businessLoginForm>
	</div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import businessLoginForm from '@/views/login/businessLoginForm.vue';
import { Form, message } from 'ant-design-vue';
import api from '@/api';
const loading = ref(false);
const businessLoginRef = ref();
const form = reactive({
	businessType: undefined,
	name: '',
	creditCode: '',
	phone: '',
	contactName: '',
	provinceId: '',
	cityId: '',
	areaId: '',
	businessLicenseUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	account: '',
	region: [],
});

const router = useRouter();
const goTo = () => {
	router.push({
		path: '/login/userLogin',
	});
};
const handleFinish = async (values: any) => {
	loading.value = true;
	api
		.companyRegister(form)
		.then((res: any) => {
			if (res == '提交成功，请耐心等待审核通过!') {
				message.success(res);
				businessLoginRef.value.restForm();
				goTo();
			} else {
				message.error(res);
			}
		})
		.catch((err: string) => {
			console.log(err);
		});
	loading.value = false;
};
</script>

<style scoped lang="less">
.form_box {
	margin-top: 1px;
	padding: 28px 37px 32px;
	background-color: #fff;
	border-radius: 4px;
	.btn {
		width: 375px;
		height: 48px;
		background: linear-gradient(132deg, #40f3cb 0%, #0272f0 100%);
		opacity: 1;
		border-radius: 4px;
		margin-left: 22px;
		&:hover {
			opacity: 0.85;
			border: none;
		}
	}

	.icon {
		color: #666666;
	}

	.text {
		font-size: 14px;
		line-height: 20px;
		color: #999999;
		letter-spacing: 1.1px;
		margin-bottom: 20px;
		.span {
			width: 80px;
			height: 25px;
			font-size: 20px;
			font-family: Microsoft YaHei UI;
			font-weight: bold;
			line-height: 25px;
			color: #000000;
			opacity: 1;
		}
	}

	.gray_text {
		font-size: 12px;
		color: #666666;
	}

	.copyright {
		margin-top: 20px;
		font-size: 12px;
		color: #999999;
		opacity: 0.85;
	}

	.register {
		text-align: right;
		padding-top: 16px;
		margin-bottom: 12px;

		.register-text {
			color: #5ec28f;
			cursor: pointer;
		}
	}
}
</style>
