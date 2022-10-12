<template>
  <div class="info_form">
    <a-form ref="infoFormRef" :model="infoForm" :rules="formRules" name="basic" autocomplete="off" labelAlign="left"
      :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
      <a-form-item name="name" label="企业名称">
        <a-input v-model:value="infoForm.name" placeholder="请输入企业名称">
        </a-input>
      </a-form-item>
      <a-form-item name="addressDetail" label="企业地址">
        <a-input v-model:value="infoForm.addressDetail" placeholder="请输入企业地址">
        </a-input>
      </a-form-item>
      <a-form-item name="legalPerson" label="法定代表人">
        <a-input v-model:value="infoForm.legalPerson" placeholder="请输入法定代表人">
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
        <a-date-picker v-model:value="infoForm.establishTime" placeholder="请选择成立日期" style="width:100%"
          :format="dateFormat" :valueFormat="dateFormat" />
      </a-form-item>
      <a-form-item name="businessTerm" label="营业期限">
        <a-date-picker v-model:value="infoForm.businessTerm" placeholder="请选择营业期限" style="width:100%"
          :format="dateFormat" :valueFormat="dateFormat" />
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
      <a-form-item name="accountType" label="公司账户类型">
        <a-input v-model:value="infoForm.accountType" placeholder="请输入营业期限">
        </a-input>
      </a-form-item>
      <a-form-item name="bankAccountName" label="公司账户名称">
        <a-input v-model:value="infoForm.bankAccountName" placeholder="请输入公司账户名称">
        </a-input>
      </a-form-item>
      <a-form-item name="accountAddress" label="开户行">
        <a-input v-model:value="infoForm.accountAddress" placeholder="请输入开户行">
        </a-input>
      </a-form-item>
      <a-form-item name="bankAccount" label="公司账号">
        <a-input v-model:value="infoForm.bankAccount" placeholder="请输入公司账号">
        </a-input>
      </a-form-item>
      <a-form-item name="businessLicenseUrl" label="营业执照">
        <img-upload ref="imgUploadRef" v-model:uploadedFile="infoForm.businessLicenseUrl" @done="uploadDown">
        </img-upload>
      </a-form-item>
      <a-form-item name="manageUrl" label="经营许可证">
        <img-upload ref="imgUploadRef" v-model:uploadedFile="infoForm.manageUrl" @done="uploadDown">
        </img-upload>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">提交审核</a-button>
        <a-button @click="back">返回</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';
import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
import { message } from 'ant-design-vue';
const router = useRouter();
const route = useRoute();
const back = () => {
  router.push({
    name: 'travelEnterpriseInfo'
  })
  imgUploadRef.value.clear()
}
const imgUploadRef = ref()
const loading = ref(false)
const dateFormat = 'YYYY-MM-DD';
const formRules = []
type detailsType = {
  name?: string,
  addressDetail?: string,
  legalPerson?: string,
  managementRange?: string,
  registeredCapital?: string,
  establishTime?: string,
  businessTerm?: string,
  contactName?: string,
  phone?: string,
  accountType?: number | string,
  bankAccountName?: string,
  accountAddress?: string,
  bankAccount?: string,
  businessLicenseUrl?: string,
  manageUrl?: string,
  oid?: string | number
}
const infoForm = reactive<detailsType>({
  name: undefined,
  businessLicenseUrl: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
})

watch(() => route.params, (val: detailsType) => {
  let key: keyof detailsType;
  for (key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) {
      infoForm[key] = JSON.parse(decodeURIComponent(val[key] as string))
    }
  }
  infoForm.businessLicenseUrl = "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
}, {
  immediate: true
})

const submit = async () => {
  let res = await api.submitInformationAudit({ companyBO: toRaw(infoForm) })
  if (res) {
    message.success('提交审核成功，请耐心等待审核结果！')
    back()
  } else {
    message.error('提交审核失败！')
  }
}
const uploadDown = () => {
  infoForm.businessLicenseUrl = infoForm.businessLicenseUrl ? infoForm.businessLicenseUrl[0] : undefined
}
onMounted(() => {
})
</script>

<style scoped lang="scss">
.info_form {
  padding: 20px;
  width: 800px;
  height: 100%;
}
</style>