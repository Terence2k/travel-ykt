<template>
	<div class="form_box">
		<a-form :model="formModel" :rules="rules" @finish="handleFinish">
			<p class="text">密码登录</p>

			<a-form-item name="account">
				<a-input class="reset-input" :bordered="false" v-model:value="formModel.account" placeholder="请输入账号">
					<template #prefix>
						<span class="reset-prefix">账号</span>
					</template>
				</a-input>
			</a-form-item>
			<!-- <p class="text">请输入密码</p> -->
			<a-form-item name="password">
				<a-input class="reset-input" :bordered="false" v-model:value="formModel.password" type="password" placeholder="请输入密码">
					<template #prefix>
						<span class="reset-prefix">密码</span>
					</template>
				</a-input>
			</a-form-item>
			<div class="bottom">
				<div class="register">
					<span class="register-text" @click="goTo">企业注册</span>
				</div>
				<a-button html-type="submit" class="btn" type="primary" :loading="loading">登录</a-button>
				<a-row style="margin-top: 16px">
					<a-col :span="12">
						<a-checkbox class="gray_text" v-model:checked="checked">自动登录</a-checkbox>
					</a-col>
					<!-- <a-col :span="12" class="text-right">
						<span class="gray_text">忘记密码?</span>
					</a-col> -->
				</a-row>
			</div>
		</a-form>

		<!-- <p class="copyright">@copyright JS-banana</p> -->
	</div>
</template>
<script setup lang="ts">
import { Icon } from '@/components/index';
import api from '@/api';
import { message } from 'ant-design-vue';

const loading = ref(false);

let state = reactive<{ [k: string]: any }>({
	otherQuery: {},
	redirect: undefined,
	activeKey: '1',
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

	api
		.login(formModel)
		.then((res) => {
			console.log(res);
			window.localStorage.setItem('authorization', `${res.authorization}`);
			window.localStorage.setItem('userInfo', JSON.stringify(res));
			if (res.sysMenuVos[0]) {
				router.replace({
					path: res.sysMenuVos[0].childMenuList[0].url || '/',
					query: state.otherQuery,
				});
			} else {
				message.error('该用户没有菜单列表');
			}
		})
		.catch((err) => {
			console.log(err);
		});
	loading.value = false;
	// if (res) {
	//   message.success("成功");
	//   // router.replace({ path: state.redirect || '/', query: state.otherQuery });
	//   router.replace("/");
	// }
};
const goTo = () => {
	router.push({
		path: '/login/businessLogin',
	});
};
</script>
<style lang="less" scoped>
.form_box {
	margin-top: 24px;
	background-color: #fff;
	border-radius: 4px;
	.btn {
		width: 100%;
		height: 48px;
		background: linear-gradient(132deg, #40f3cb 0%, #0272f0 100%);
		border-radius: 4px;
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
		border-bottom: 1px solid #e7e7e7;
		.reset-prefix {
			width: 70px;
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
			cursor: pointer;
			width: 64px;
			height: 20px;
			line-height: 24px;
			color: #4197ef;
		}
	}
	.bottom {
		margin-top: 130px;
	}
}
</style>
