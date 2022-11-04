<template>
  <div style="display: flex;align-items: center; height: 100%;">
    <div class="login-container">
      <div class="pic-box rowCC">
        <LoginPic />
      </div>
      <div class="rowCC login-box">
        <!-- <a-card class="login" :bordered="false" :body-style="{ width: '480px', padding: '30px 0' }"> -->
        <div class="login_right_container">
          <div class="title_box">
            <div class="logo"><img src="@/assets/images/logo.png" alt="" /></div>
            <h2 class="title">丽江一卡通结算平台</h2>
          </div>
          <!-- <login-form /> -->
          <RouterView key="loginWrapper"></RouterView>
        </div>
        <!-- </a-card> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import LoginForm from './Form.vue';
import LoginPic from './pic.vue';
</script>
<style lang="less">

.login-container {
	width: 77vw;
	background: rgba(255, 255, 255, 0.39);
	box-shadow: 0px 8px 50px rgba(5, 27, 80, 0.1);
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: auto;
	.pic-box {
		width: 40vw;
		height: 40vw;
		// border-right: 1px solid #d8d8d8;
	}
	.login-box {
		// border: 1px solid red;
		width: 50vw;
    padding: 45px 0;
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
    min-width: 500px;
		background: rgba(255, 255, 255, 0.39);
		box-shadow: 0px 2px 16px rgba(1, 48, 100, 0.12);
		border-radius: 4px;
    padding: 8%;
    padding-top: 4%;
	}
  .title_box {
    display: flex;
    align-items: center;
    justify-content: start;
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
  .reset-input {
    border-bottom: 1px solid #e7e7e7;
    .reset-prefix {
      width: 70px;
      font-size: 16px;
      color: #000;
      padding-right: 12px;
    }
  }
}
</style>
