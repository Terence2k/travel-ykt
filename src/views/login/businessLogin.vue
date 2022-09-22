<template>
  <div class="form_box">
    <div class="text">
      <span style="margin-right: 20px;cursor:pointer" @click="goTo">
        <arrow-left-outlined />
      </span>
      <span>企业注册</span>
    </div>
    <a-form name="businessLogin" autocomplete="off" labelAlign="left" :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }">
      <a-form-item name="account" label="企业类型">
        <a-select placeholder="请选择企业类型" v-model:value="formModel.account">
          <a-select-option value="sd">
            sd
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="account" label="企业名称">
        <a-input class="reset-input" v-model:value="formModel.account" placeholder="请输入企业名称">
        </a-input>
      </a-form-item>
      <a-form-item name="account" label="信用代码">
        <a-input class="reset-input" v-model:value="formModel.account" placeholder="请输入信用代码">
        </a-input>
      </a-form-item>
      <a-form-item name="account" label="手机号">
        <a-input class="reset-input" v-model:value="formModel.account" placeholder="请输入手机号">
        </a-input>
      </a-form-item>
      <a-form-item name="account" label="管理员">
        <a-input class="reset-input" v-model:value="formModel.account" placeholder="请输入管理员姓名">
        </a-input>
      </a-form-item>
      <a-form-item name="account" label="所属地区">
        <a-select placeholder="请选择所属地区" v-model:value="formModel.account">
          <a-select-option value="sd">
            sd
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="account" label="营业执照">
        <img-upload></img-upload>
      </a-form-item>
    </a-form>
    <a-button html-type="submit" class="btn" type="primary" :loading="loading">提交</a-button>
    <!-- <p class="copyright">@copyright JS-banana</p> -->
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftOutlined
} from '@ant-design/icons-vue';
import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
const formrules: any = {
  account: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
};
const loading = ref(false);
const formModel = reactive({
  account: '',
  password: '',
});
const router = useRouter();
const goTo = () => {
  router.push({
    path: '/login/userLogin'
  })
}
</script>

<style scoped lang="less">
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

  /*   ::v-deep(.ant-tabs-tab) {
    padding: 10px 2px;
  }

  ::v-deep(.ant-tabs-nav) {
    &::before {
      border-bottom: none;
    }
  }

  ::v-deep(.ant-input-affix-wrapper-focused) {
    box-shadow: none !important;
  } */

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

  /*   .reset-input {
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
  } */

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