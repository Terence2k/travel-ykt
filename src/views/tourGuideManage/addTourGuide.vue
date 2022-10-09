<template>
  <div class="form_box">
    <div class="title">
      <span>
        选择导游
      </span>
      <span class="close_btn" @click="back">
        <close-outlined />
      </span>
    </div>
    <div class="form_body">
      <a-form ref="formRef" :model="form" :rules="formRules" name="basic" autocomplete="off" labelAlign="left"
        :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
        <a-form-item label="姓名" name="auditResult" :colon="false">
          <a-input v-model:value="form.name" placeholder="请输入导游姓名" />
        </a-form-item>
        <a-form-item label="导游证号" name="roldId" :colon="false">
          <a-input v-model:value="form.name" placeholder="请输入导游证号" />
        </a-form-item>
        <a-form-item label="身份证号" name="roldId" :colon="false">
          <a-input v-model:value="form.name" placeholder="请输入身份证号" />
        </a-form-item>
        <a-form-item label="导游电话" name="roldId" :colon="false">
          <a-input v-model:value="form.name" placeholder="请输入导游电话" />
        </a-form-item>
        <a-form-item label="导游星级" name="roldId" :colon="false">
          <a-input v-model:value="form.name" placeholder="请输入导游星级" />
        </a-form-item>
        <a-form-item label="导游等级" name="roldId" :colon="false">
          <a-input v-model:value="form.name" placeholder="请输入导游等级" />
        </a-form-item>
        <a-form-item label="签约时间" name="roldId" :colon="false">
          <a-input v-model:value="form.name" placeholder="请输入导游证号" />
        </a-form-item>
        <a-form-item label="签约附件" name="businessLicenseUrl" :colon="false">
          <img-upload ref="imgUploadRef" v-model:uploadedFile="form.businessLicenseUrl" @done="uploadDown">
          </img-upload>
        </a-form-item>
      </a-form>
    </div>
    <div class="btn_box">
      <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">发送委派邀请</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
const router = useRouter();
const route = useRoute();
const back = () => {
  router.push({
    name: 'tourGuideList'
  })
}
const formRules = []
const form = reactive({})
const loading = ref(false)
const submit = () => { }
const uploadDown = () => {
  form.businessLicenseUrl = form.businessLicenseUrl ? form.businessLicenseUrl[0] : undefined
}
</script>

<style scoped lang="scss">
.form_box {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 24px 20px 0;

  .title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    color: #1E2226;
    padding-bottom: 12px;
    border-bottom: 1px solid #F1F2F5;

    .close_btn {
      cursor: pointer;
    }
  }

  .form_body {
    margin-top: 20px;
    width: 60%;
  }

  .btn_box {
    position: absolute;
    bottom: 20px;
  }
}
</style>