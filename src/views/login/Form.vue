<template>
	<div class="form_box">
		<a-form :model="formModel" :rules="rules" @finish="handleFinish">
			<p class="text">请输入手机号登录</p>
			<a-form-item name="account">
				<a-input class="reset-input" v-model:value="formModel.account" placeholder="请输入账号">
					<template #prefix>
						<span class="reset-prefix">手机号</span>
					</template>
				</a-input>
			</a-form-item>
			<!-- <p class="text">请输入密码</p> -->
			<a-form-item name="password">
				<a-input class="reset-input" v-model:value="formModel.password" type="password" placeholder="请输入密码">
					<template #prefix>
						<span class="reset-prefix">密码</span>
					</template>
				</a-input>
			</a-form-item>
			<div class="register">
				<span class="register-text">企业注册</span>
			</div>
			<a-button html-type="submit" class="btn" type="primary" :loading="loading">登录</a-button>
			<a-row style="margin-top: 16px">
				<a-col :span="12">
					<a-checkbox class="gray_text" v-model:checked="checked">自动登录</a-checkbox>
				</a-col>
				<a-col :span="12" class="text-right">
					<span class="gray_text">忘记密码?</span>
				</a-col>
			</a-row>
		</a-form>
		<!-- <p class="copyright">@copyright JS-banana</p> -->
	</div>
</template>
<script setup lang="ts">
import { Icon } from '@/components/index';
import api from '@/api';

const loading = ref(false);

let state = reactive<{[k:string]:any}>({
	otherQuery: {},
	redirect: undefined,
	activeKey: '1'
});

/* listen router change  */
const route = useRoute();
const router = useRouter();
let getOtherQuery = (query: any) => {
	return Object.keys(query).reduce((acc: any, cur) => {
		if (cur !== 'redirect') {
			acc[cur] = query[cur];
		}
		return acc;
	}, {});
};

watch(
	route,
	(route) => {
		const query = route.query;
		if (query) {
			state.redirect = query.redirect;
			state.otherQuery = getOtherQuery(query);
		}
	},
	{ immediate: true }
);

const rules: any = {
	account: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
	password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
};

const checked = ref(true);
const formModel = reactive({
	account: '',
	password: '',
});

const handleFinish = async (values: any) => {
	// console.log(checked, values);
	console.log(values);
	loading.value = true;
  
	api.login(formModel).then(res => {
    console.log(res)
    window.localStorage.setItem('authorization', `${res.authorization}`);
    router.replace({
      path: state.redirect || '/',
      query: state.otherQuery,
    });
  }).catch(err => {
    console.log(err)
  })
	loading.value = false;
	// if (res) {
	//   message.success("成功");
	//   // router.replace({ path: state.redirect || '/', query: state.otherQuery });
	//   router.replace("/");
	// }
};
</script>
<style lang="less" scoped>
.form_box {
	margin-top: 24px;
	padding: 28px 37px 32px;
	background-color: #fff;
	border-radius: 4px;
	.btn {
		width: 100%;
		height: 48px;
		border-radius: 6px;
		color: #ffffff;
		font-size: 16px;
		&:hover {
			opacity: 0.85;
			border: none;
		}
	}
	::v-deep(.ant-tabs-tab) {
		padding: 10px 2px;
	}
	::v-deep(.ant-tabs-nav) {
		&::before {
			border-bottom: none;
		}
	}
	::v-deep(.ant-input-affix-wrapper-focused) {
		box-shadow: none !important;
	}
	.icon {
		color: #666666;
	}
	.text {
		font-size: 14px;
		line-height: 20px;
		color: #999999;
		letter-spacing: 1.1px;
		margin-bottom: 10px;
	}
	.gray_text {
		font-size: 12px;
		color: #666666;
	}
	.reset-input {
		height: 48px;
		line-height: 48px;
		border: none;
		border-bottom: 1px solid #E7E7E7;
		padding: 0;
		.reset-prefix {
			width: 81px;
			font-size: 16px;
			color: #000;
			padding-right: 12px;
		}
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
			color: #5EC28F;
			cursor: pointer;
		}
	}
}
</style>
