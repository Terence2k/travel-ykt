<template>
  <a-form ref="businessLoginRef" v-bind="$attrs" :rules="formRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
    autocomplete="off">
    <a-form-item name="businessType" label="企业类型">
      <a-select v-model:value="$attrs.model.businessType" placeholder="请选择企业类型">
        <a-select-option v-for="item in businessTypeOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item name="name" label="企业名称">
      <a-input v-model:value="$attrs.model.name" placeholder="请输入企业名称" autocomplete="off">
      </a-input>
    </a-form-item>
    <a-form-item name="creditCode" label="信用代码">
      <a-input v-model:value="$attrs.model.creditCode" placeholder="请输入信用代码" autocomplete="off">
      </a-input>
    </a-form-item>
    <a-form-item name="account" label="登录账号">
      <a-input v-model:value="$attrs.model.account" placeholder="请输入登录账号" autocomplete="off">
      </a-input>
    </a-form-item>
    <a-form-item name="phone" label="手机号">
      <a-input v-model:value="$attrs.model.phone" placeholder="请输入手机号" autocomplete="off">
      </a-input>
    </a-form-item>
    <a-form-item name="contactName" label="管理员姓名">
      <a-input v-model:value="$attrs.model.contactName" placeholder="请输入管理员姓名" autocomplete="off">
      </a-input>
    </a-form-item>
    <a-form-item name="region" label="所属地区">
      <address-selector placeholder="请选择所属地区" v-model:value="$attrs.model.region" @change="regionChange">
      </address-selector>
    </a-form-item>
    <a-form-item name="businessLicenseUrl" label="营业执照">
      <Upload v-model="$attrs.model.businessLicenseUrl" :maxCount="1" />
      <!-- <img-upload ref="imgUploadRef" v-model:uploadedFile="$attrs.model.businessLicenseUrl" @done="uploadDown">
      </img-upload> -->
    </a-form-item>
    <slot name="submit"></slot>
    
  </a-form>
</template>

<script setup lang="ts">
import Upload from '@/components/common/imageWrapper.vue';
// import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
// import { useBusinessManageOption } from '@/stores/modules/businessManage';
import { useAttrs } from 'vue'
const attrs = useAttrs()
// const businessManageOptions = useBusinessManageOption();
const businessLoginRef = ref()
const imgUploadRef = ref()
const businessTypeOption = [
  { codeValue: 'HOTEL', name: '酒店' },
  { codeValue: 'CATERING', name: '餐饮' },
  { codeValue: 'TICKET', name: '景区' },
  { codeValue: 'TRAVEL', name: '旅行社' },
  /* { codeValue: 'YKT', name: '一卡通' },
  { codeValue: 'SUPERVISE', name: '监理' },
  { codeValue: 'ASSOCIATION', name: '协会' },
  { codeValue: 'GROUP', name: '集团' },
  { codeValue: 'CULTURE_BUREAU', name: '文旅局' },
  { codeValue: 'ANCIENT_UYGUR', name: '古维管理部门' } */
];
const formRules: any = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  creditCode: [{ required: true, trigger: 'blur', message: '请输入信用代码' }],
  account: [{ required: true, trigger: 'blur', message: '请输入登录账号' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入管理员姓名' }],
  region: [{ required: true, trigger: 'blur', message: '请选择所属地区' }],
  businessLicenseUrl: [{ required: true, trigger: 'blur', message: '请上传营业执照照片' }],
};
// const initOpeion = async () => {
//   await businessManageOptions.getBusinessTypeOption();
// };
// const businessTypeOption = computed(() => businessManageOptions.businessTypeOption);
const regionChange = () => {
  attrs.model.provinceId = attrs.model.region ? attrs.model.region[0] : ''
  attrs.model.cityId = attrs.model.region ? attrs.model.region[1] : ''
  attrs.model.areaId = attrs.model.region ? attrs.model.region[2] : ''
}
const uploadDown = () => {
  attrs.model.businessLicenseUrl = attrs.model.businessLicenseUrl ? attrs.model.businessLicenseUrl[0] : undefined
}
const restForm = () => {
  businessLoginRef.value.resetFields()
  imgUploadRef.value.clear()
}
const validate = () => {
  return businessLoginRef.value.validate()
}
defineExpose({
  restForm,
  validate
})
onMounted(() => {
  // initOpeion()
})
</script>

<style scoped lang="scss">

</style>