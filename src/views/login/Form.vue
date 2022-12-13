<template>
	<div class="form_box">
		<a-form :model="formModel" :rules="rules" @finish="handleFinish">
			<a-tabs v-model:activeKey="state.activeKey">
				<a-tab-pane key="1" tab="密码登录">
					<a-form-item name="account">
						<a-input class="reset-input" :bordered="false" v-model:value="formModel.account" placeholder="请输入账号">
							<template #prefix>
								<span class="reset-prefix">账号</span>
							</template>
						</a-input>
					</a-form-item>
					<a-form-item name="password" v-if="state.activeKey == 1">
						<a-input class="reset-input" :bordered="false" v-model:value="formModel.password" type="password" placeholder="请输入密码">
							<template #prefix>
								<span class="reset-prefix">密码</span>
							</template>
						</a-input>
					</a-form-item>
				</a-tab-pane>
				<a-tab-pane key="2" tab="短信登录" force-render>
					<a-form-item name="account">
						<a-input class="reset-input" :bordered="false" v-model:value="formModel.account" placeholder="请输入账号">
							<template #prefix>
								<span class="reset-prefix">账号</span>
							</template>
						</a-input>
					</a-form-item>
					<a-form-item name="phone" v-if="state.activeKey == 2">
						<a-input class="reset-input" :bordered="false" v-model:value="formModel.phone" placeholder="请输入手机号码">
							<template #prefix>
								<span class="reset-prefix">手机号</span>
							</template>
						</a-input>
					</a-form-item>
					<a-form-item name="code" v-if="state.activeKey == 2">
						<a-input-search class="reset-input" :bordered="false" v-model:value="formModel.code" placeholder="请输入验证码">
							<template #prefix>
								<span class="reset-prefix">验证码</span>
							</template>
							<template #enterButton>
								<a-button type="primary" @click="getsmscode">{{ state.countdown }}</a-button>
							</template>
						</a-input-search>
					</a-form-item>
				</a-tab-pane>
			</a-tabs>
			<p class="text">{{ state.activeKey == 1 ? '密码登录' : '短信验证码登录' }}</p>
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
	countdown: '获取验证码',
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
	account: [{ required: true, trigger: 'blur', message: '请输入账户' }],
	phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
	password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
	code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
};

const checked = ref(true);
const formModel = reactive({
	account: '',
	password: '',
	code: '',
	phone: '',
});
const tabArr: any = ref([]);
const btnArr: any = ref([]);

const getTabMenuList = (menuList: any, pUrl?: any) => {
	menuList.forEach((item: any) => {
		if (item.menuType == 2) {
			item.pUrl = pUrl;
			tabArr.value.push(item);
		}
		if (item.menuType == 3) {
			item.pUrl = pUrl;
			btnArr.value.push(item);
		}
		if (item.childMenuList?.length && item.menuType != 2) {
			getTabMenuList(item.childMenuList, item.url);
		}
	});
	window.localStorage.setItem('tabArr', JSON.stringify(tabArr.value));
	window.localStorage.setItem('btnArr', JSON.stringify(btnArr.value));
};

const handleFinish = async (values: any) => {
	// console.log(checked, values);
	console.log(values);
	loading.value = true;
	if (formModel.code) {
		api
			.smsLogin(formModel)
			.then((res: any) => {
				console.log(res);
				window.localStorage.setItem('authorization', `${res.authorization}`);
				window.localStorage.setItem('userInfo', JSON.stringify(res));
				getTabMenuList(res.sysMenuVos);
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
	} else {
		api
			.login(formModel)
			.then((res: any) => {
				console.log(res);
				window.localStorage.setItem('authorization', `${res.authorization}`);
				window.localStorage.setItem('userInfo', JSON.stringify(res));
				getTabMenuList(res.sysMenuVos);
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
	}

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
const getsmscode = () => {
	if (formModel.account == '' && formModel.phone == '') {
		message.error('请先输入账户和手机号码');
		return false;
	}
	const data = {
		account: formModel.account,
		phone: formModel.phone,
	};
	api.getSmsVerifyCode(data).then((res: any) => {
		message.success('验证码已发送至您的手机，请注意查收');
		console.log(res);
		formModel.code = res;
	});
	// if (state.countdown == '获取验证码') {
	// 	state.countdown = 5;
	// 	let _this = state.countdown;
	// 	let tt = setInterval(function () {
	// 		if (state.countdown >= 1) {
	// 			state.countdown--;
	// 		} else {
	// 			state.countdown = '获取验证码';
	// 			clearInterval(tt);
	// 		}
	// 	}, 1000);
	// 	//     this.$axios.get("http://127.0.0.1:8000/user/sms?type=login&phone="+this.phone)
	// 	//       .then(function (res) {
	// 	//         if(res.data.message==0){
	// 	//           alert("验证码发送成功")
	// 	//         }
	// 	//       }).catch(function (error) {
	// 	//         console.log(error.response)
	// 	//       })
	// 	//   }
	// } else {
	// 	alert('手机号码有误');
	// }
	// }
};
</script>
<style lang="less" scoped>
.form_box {
	margin-top: 24px;
	background-color: #fff;
	border-radius: 4px;
	height: 464px;
	
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
