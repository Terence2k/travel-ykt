<template>
  <div class="info_form">
    <a-form ref="infoFormRef" :model="infoForm" :rules="formRules" name="basic" autocomplete="off" labelAlign="left"
      :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
      <a-form-item name="name" label="企业名称">
        <a-input v-model:value="infoForm.name" placeholder="请输入企业名称">
        </a-input>
      </a-form-item>
      <a-form-item name="regionName" label="企业地址">
        <a-input v-model:value="infoForm.regionName" placeholder="请输入企业地址">
        </a-input>
      </a-form-item>
      <a-form-item name="businessType" label="企业类型">
        <a-select placeholder="请选择企业类型" v-model:value="infoForm.businessType" allowClear>
          <a-select-option v-for="item in businessTypeOption" :value="item.codeValue">{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="name" label="法定代表人">
        <a-input v-model:value="infoForm.name" placeholder="请输入法定代表人">
        </a-input>
      </a-form-item>
      <a-form-item name="managementRange" label="经营范围">
        <a-input v-model:value="infoForm.managementRange" placeholder="请输入经营范围">
        </a-input>
      </a-form-item>
      <a-form-item name="registeredCapital" label="注册资本">
        <a-input v-model:value="infoForm.registeredCapital" placeholder="请输入注册资本" suffix="万元">
        </a-input>
      </a-form-item>
      <a-form-item name="establishTime" label="成立日期">
        <a-date-picker v-model:value="infoForm.establishTime" placeholder="请选择成立日期" style="width:100%" />
      </a-form-item>
      <a-form-item name="name" label="营业期限">
        <a-input v-model:value="infoForm.name" placeholder="请输入营业期限">
        </a-input>
      </a-form-item>
      <!-- <a-form-item name="name" label="公司联系方式">
        <a-input v-model:value="infoForm.name" placeholder="请输入营业期限">
        </a-input>
      </a-form-item> -->
      <a-form-item name="contactName" label="联系人">
        <a-input v-model:value="infoForm.contactName" placeholder="请输入联系人">
        </a-input>
      </a-form-item>
      <a-form-item name="phone" label="联系电话">
        <a-input v-model:value="infoForm.phone" placeholder="请输入联系电话">
        </a-input>
      </a-form-item>
      <a-form-item name="businessLicenseUrl" label="营业执照">
        <img-upload ref="imgUploadRef" v-model:uploadedFile="infoForm.businessLicenseUrl" @done="uploadDown">
        </img-upload>
      </a-form-item>
    </a-form>
    <div class="btn_box">
      <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">提交审核</a-button>
      <a-button @click="back">取消</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
const businessManageOptions = useBusinessManageOption();
const router = useRouter();
const route = useRoute();
const back = () => {
  router.push({
    name: 'enterpriseInfo'
  })
  imgUploadRef.value.clear()
}
const imgUploadRef = ref()
const loading = ref(false)
const formRules = []
type infoType = {
  name?: string,
  regionName?: string,
  managementRange?: string,
  registeredCapital?: string | number,
  establishTime?: string,
  contactName?: string,
  phone?: string | number,
  businessLicenseUrl?: string,
  businessType?: string | number
}
const infoForm = reactive<infoType>({
  name: undefined,
  businessLicenseUrl: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
})
const initOpeion = async () => {
  await businessManageOptions.getBusinessTypeOption();
};
const businessTypeOption = computed(() => businessManageOptions.businessTypeOption);
const submit = () => { }
const uploadDown = () => {
  infoForm.businessLicenseUrl = infoForm.businessLicenseUrl ? infoForm.businessLicenseUrl[0] : undefined
}
onMounted(() => {
  initOpeion()
})
</script>

<style scoped lang="scss">
.info_form {
  position: relative;
  padding: 20px;
  width: 800px;
  height: 100%;

  .btn_box {
    position: absolute;
    bottom: 20px;
  }
}
</style>