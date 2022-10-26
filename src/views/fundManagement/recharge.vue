<template>
  <div class="content_box">
    <div class="check_box">
      <div class="title">
        <div class="info_box">
          <div class="info_item">一卡通账户名称：丽江黑松白鹿旅行社</div>
          <div class="info_item">已绑定银行账户名称：丽江黑松白鹿旅游服务有限公司</div>
          <div class="info_item">开户行：中国建设银行丽江分行古城支行</div>
          <div class="info_item">银行账号： 589 3728203 980</div>
        </div>
        <span class="close_btn" @click="back">
          <close-outlined />
        </span>
      </div>
      <div class="table_box">
        <div class="card_info">
          <div class="mb20">一卡通资金子账号：</div>
          <div class="count mb20">6225 0088 4399 0074</div>
          <div class="mb20">
            <span style="margin-right:20px">当前可用余额</span>
            <span class="count">1,300.00</span>
          </div>
        </div>
        <div class="recharge_info">
          <div class="mb20">输入本次充值金额：</div>
          <div class="mb20">
            <a-input v-model:value="amount" allowClear style="width:300px" @change="inputChange" />
            <span style="margin-left: 20px">元</span>
          </div>
          <div class="mb20">
            <span>大写：<span>{{ bigAmount }}</span></span>
          </div>
          <div class="charge_tip mb20">
            <p>【充值说明】</p>
            <p>1、提交后，将跳转至银行界面继续完成对一卡通平台的转账；</p>
            <p>2、请确保您已绑定的对公账户中余额充足，否则将充值失败；</p>
            <p>3、银行转账成功后，将根据贵司的一卡通账号自动识别，增加对应的余额至您的一卡通账户；</p>
            <p>4、转账成功与否，取决于银行网银系统是否稳定，如有失败，可向开户行查询。</p>
          </div>
          <a-button type="primary">提交银行转账</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import convertCurrency from '@/views/fundManagement/change'
import { CloseOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';
const router = useRouter();
const route = useRoute();
const back = () => {
  router.push({
    name: 'fund'
  })
}
const amount = ref('')
const bigAmount = ref()
let timer
const inputChange = () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    bigAmount.value = convertCurrency(amount.value)
  }, 500);
}
</script>

<style scoped lang="scss">
.content_box {
  width: 100%;
  height: 100%;

  .check_box {
    width: 100%;
    padding: 24px 20px;

    .recharge_info,
    .card_info,
    .title {
      font-size: 16px;
      font-family: Source Han Sans SC;
      font-weight: 500;
      color: #1E2226;
    }

    .title {
      display: flex;
      justify-content: space-between;
      padding-bottom: 12px;
      border-bottom: 1px solid #F1F2F5;

      .info_box {
        display: flex;

        .info_item {
          margin-right: 40px;
        }
      }

      .close_btn {
        cursor: pointer;
      }
    }

    .table_box {
      display: flex;
      margin-top: 20px;

      .recharge_info {
        margin-left: 20px;
        padding-left: 20px;
        border-left: 1px solid #C8C9CC;
      }

      .count {
        font-size: 20px;
        font-family: DIN;
        font-weight: 400;
        color: #36B374;
      }

      .mb20 {
        margin-bottom: 20px;
      }

      .charge_tip {
        width: 300px;
        padding: 20px 10px;
        border: 1px dashed black;
        text-align: left;
      }
    }
  }
}
</style>