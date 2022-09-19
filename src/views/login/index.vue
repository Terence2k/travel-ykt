<template>
	<div class="login-container">
		<div class="pic-box rowCC">
			<LoginPic />
		</div>
		<div class="rowCC login-box">
			<!-- <a-card class="login" :bordered="false" :body-style="{ width: '480px', padding: '30px 0' }"> -->
				<div class="login_right_container">
					<div class="title_box">
						<div class="logo">logo</div>
						<h2 class="title">丽江一卡结算平台</h2>
					</div>
					<login-form />
				</div>
			<!-- </a-card> -->
		</div>
	</div>
</template>
<script setup lang="ts">
import LoginForm from './Form.vue';
import LoginPic from './pic.vue';
</script>
<style lang="less" scoped>
.login-container {
	width: 100vw;
	height: 100vh;
	background-color: #ededed;
	display: flex;
	justify-content: space-event;
	align-items: center;
	.pic-box {
		width: 50vw;
		height: 50vh;
		border-right: 1px solid #d8d8d8;
	}
	.login-box {
		width: 50vw;
	}
	// background-image: linear-gradient(to right, #74ebd5 0%, #9face6 100%);
	.login {
		border-radius: 10px;
		// box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
		// background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);
		&_right {
			// padding-top: 80px;
			&_container {
				width: 360px;
				margin: 0 auto;
			}
		}
	}
	.login_right_container {
		width: 456px;
	}
}
.title_box {
	display: flex;
	align-items: center;
	.logo {
		width: 44px;
		line-height: 44px;
		background-color: #36B374;
		text-align: center;
		border-radius: 7px;
		color: #fff;
		margin-right: 20px;
	}
	.title {
		font-size: 24px;
		color: #000000;
		font-weight: 400;
		color: #36B374;
		margin: 0;
	}
}
</style>
