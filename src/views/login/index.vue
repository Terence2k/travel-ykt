<template>
	<div class="login-container">
		<div class="pic-box rowCC">
			<LoginPic />
		</div>
		<div class="rowCC login-box">
			<!-- <a-card class="login" :bordered="false" :body-style="{ width: '480px', padding: '30px 0' }"> -->
			<div class="login_right_container">
				<div class="title_box">
					<div class="logo"><img src="@/assets/images/logo.png" alt="" /></div>
					<h2 class="title">丽江一卡结算平台</h2>
				</div>
				<!-- <login-form /> -->
				<RouterView key="loginWrapper"></RouterView>
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
	width: 1484px;
	height: 864px;
	background: rgba(255, 255, 255, 0.39);
	box-shadow: 0px 8px 50px rgba(5, 27, 80, 0.1);
	opacity: 1;
	// width: 100vw;
	// height: 100vh;
	// background-color: #ededed;
	// border: 1px solid yellow;
	display: flex;
	justify-content: space-event;
	align-items: center;
	left: 0;
	top: 70px;
	bottom: 0;
	right: 0;
	margin: auto;
	.pic-box {
		width: 50vw;
		height: 50vh;
		// border-right: 1px solid #d8d8d8;
	}
	.login-box {
		// border: 1px solid red;
		width: 50vw;
		height: 65vh;
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
		width: 500px;
		min-height: 640px;
		background: rgba(255, 255, 255, 0.39);
		box-shadow: 0px 2px 16px rgba(1, 48, 100, 0.12);
		opacity: 1;
		border-radius: 4px;
	}
}
.title_box {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
	.logo {
		width: 44px;
		line-height: 44px;
		// background-color: #36B374;
		text-align: center;
		border-radius: 7px;
		color: #fff;
		margin-right: 20px;
	}
	.title {
		width: 216px;
		height: 30px;
		font-size: 24px;
		font-family: Microsoft YaHei UI;
		font-weight: bold;
		line-height: 40px;
		color: #1e2226;
		opacity: 1;
	}
}
</style>
