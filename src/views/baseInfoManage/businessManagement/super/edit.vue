<template>
  <div class="content_box">
    <div class="check_box">
      <div class="title">
        <span>
          编辑企业信息
        </span>
        <span class="close_btn" @click="back">
          <close-outlined />
        </span>
      </div>
      <div class="form_body">
        <a-form ref="formRef" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
          :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-form-item name="businessType" label="企业类型">
            <a-select v-model:value="form.businessType" placeholder="请选择企业类型" disabled>
              <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :key="item.codeValue">{{
                  item.name
              }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="name" label="企业名称" v-show="formRules?.name">
            <a-input v-model:value="form.name" placeholder="请输入企业名称">
            </a-input>
          </a-form-item>
          <a-form-item name="regionCode" label="企业所属地区" v-show="formRules?.regionCode">
            <address-selector placeholder="请选择所属地区" v-model:value="form.regionCode" @change="regionChange">
            </address-selector>
          </a-form-item>
          <a-form-item name="addressDetail" label="企业详情地址" v-show="formRules?.addressDetail">
            <a-input v-model:value="form.addressDetail" placeholder="请输入企业详情地址">
            </a-input>
          </a-form-item>
          <a-form-item name="legalPerson" label="法定代表人" v-show="formRules?.legalPerson">
            <a-input v-model:value="form.legalPerson" placeholder="请输入法定代表人">
            </a-input>
          </a-form-item>
          <a-form-item name="managementRange" label="经营范围" v-show="formRules?.managementRange">
            <a-textarea v-model:value="form.managementRange" placeholder="请输入经营范围" :rows="2">
            </a-textarea>
          </a-form-item>
          <a-form-item name="registeredCapital" label="注册资本" v-show="formRules?.registeredCapital">
            <a-input v-model:value="form.registeredCapital" placeholder="请输入注册资本" suffix="万元">
            </a-input>
          </a-form-item>
          <a-form-item name="establishTime" label="成立日期" v-show="formRules?.establishTime">
            <a-date-picker v-model:value="form.establishTime" placeholder="请选择成立日期" style="width:100%"
              :format="dateFormat" :valueFormat="dateFormat" />
          </a-form-item>
          <a-form-item name="businessTerm" label="营业期限" v-show="formRules?.businessTerm">
            <a-date-picker v-model:value="form.businessTerm" placeholder="请选择营业期限" style="width:100%"
              :format="dateFormat" :valueFormat="dateFormat" />
          </a-form-item>
          <a-form-item name="contactName" label="联系人" v-show="formRules?.contactName">
            <a-input v-model:value="form.contactName" placeholder="请输入联系人">
            </a-input>
          </a-form-item>
          <a-form-item name="phone" label="联系电话" v-show="formRules?.phone">
            <a-input v-model:value="form.phone" placeholder="请输入联系电话">
            </a-input>
          </a-form-item>
          <a-form-item name="accountType" label="公司账户类型" v-show="formRules?.accountType">
            <a-radio-group v-model:value="form.accountType">
              <a-radio :value="1">对公账户</a-radio>
              <a-radio :value="2">对私账户</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="bankAccountName" label="公司账户名称" v-show="formRules?.bankAccountName">
            <a-input v-model:value="form.bankAccountName" placeholder="请输入公司账户名称">
            </a-input>
          </a-form-item>
          <a-form-item name="bank" label="开户行" v-show="formRules?.bank">
            <a-input v-model:value="form.bank" placeholder="请输入开户行">
            </a-input>
          </a-form-item>
          <a-form-item name="bankAccount" label="公司账号" v-show="formRules?.bankAccount">
            <a-input v-model:value="form.bankAccount" placeholder="请输入公司账号">
            </a-input>
          </a-form-item>
          <a-form-item name="creditCode" label="统一社会信用代码" v-show="formRules?.creditCode">
            <a-input v-model:value="form.creditCode" placeholder="请输入统一社会信用代码">
            </a-input>
          </a-form-item>
          <a-form-item name="businessLicenseUrl" label="营业执照" v-show="formRules?.businessLicenseUrl">
            <img-upload ref="imgUploadRef" v-model:uploadedFile="form.businessLicenseUrl" @done="uploadDown">
            </img-upload>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">保存</a-button>
            <!-- <a-button @click="rest" style="margin-right:20px" :loading="loading">重置</a-button> -->
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloseOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
import {
  commonFormRules6,
  commonFormRules9,
  commonFormRules7,
  commonFormRules8,
  condition1,
  condition2,
  condition3,
  condition4
} from '@/views/baseInfoManage/businessManagement/super/common';
import { message } from 'ant-design-vue';
import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import api from '@/api';
const router = useRouter();
const route = useRoute();
const isRefresh = ref('0')
const back = () => {
  router.push({
    name: 'apply',
    params: {
      isRefresh: isRefresh.value
    }
  })
}
type detailsType = {
  businessType?: string,
  name?: string,
  regionCode?: (string | number)[],
  provinceId?: string | number,
  cityId?: string | number,
  areaId?: string | number,
  addressDetail?: string,
  legalPerson?: string,
  managementRange?: string,
  registeredCapital?: string,
  establishTime?: string,
  businessTerm?: string,
  contactName?: string,
  phone?: string,
  accountType?: 1 | 2,
  bankAccountName?: string,
  bank?: string,
  bankAccount?: string,
  creditCode?: string | number,
  businessLicenseUrl?: string,
  account?: string,
  password?: string,
  checkPass?: string
}
const form = ref<detailsType>({
  regionCode: [],
  businessType: undefined,
  password: '',
  checkPass: '',
  accountType: 1,
  name: undefined,
  businessLicenseUrl: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
})
type queryParamsType = {
  oid?: string,
  businessType?: string
}
const props = defineProps<queryParamsType>()
const queryParams = reactive<queryParamsType>({})
const businessTypeOption = [
  { codeValue: 'HOTEL', name: '酒店' },
  { codeValue: 'CATERING', name: '餐饮' },
  { codeValue: 'TICKET', name: '景区' },
  { codeValue: 'TRAVEL', name: '旅行社' },
  { codeValue: 'GROUP', name: '集团' },
  { codeValue: 'YKT', name: '一卡通' },
  { codeValue: 'SUPERVISE', name: '监理' },
  { codeValue: 'ASSOCIATION', name: '协会' },
  { codeValue: 'CULTURE_BUREAU', name: '文旅局' },
  { codeValue: 'ANCIENT_UYGUR', name: '古维管理部门' }
];
const formRef = ref();
const loading = ref(false);
const dateFormat = 'YYYY-MM-DD';
const formRules = ref<Record<string, Rule[]>>({})
formRules.value = commonFormRules6
watch(
  () => form.value.businessType,
  (newVal) => {
    if (newVal) {
      if (condition1.includes(newVal)) {
        formRules.value = commonFormRules6
      } else if (condition2.includes(newVal)) {
        formRules.value = commonFormRules9
      } else if (condition3.includes(newVal)) {
        formRules.value = commonFormRules7
      } else if (condition4.includes(newVal)) {
        formRules.value = commonFormRules8
      }
    }
  })
const uploadDown = () => {
  form.value.businessLicenseUrl = form.value.businessLicenseUrl ? form.value.businessLicenseUrl[0] : undefined
}
const regionChange = () => {
  form.value.provinceId = form.value.regionCode ? form.value.regionCode[0] : undefined
  form.value.cityId = form.value.regionCode ? form.value.regionCode[1] : undefined
  form.value.areaId = form.value.regionCode ? form.value.regionCode[2] : undefined
}
const submit = () => {
  formRef.value.validateFields().then(async () => {
    let res = await api.editCompany(toRaw(form.value))
    if (res) {
      isRefresh.value = '1'
      message.success('编辑企业信息成功！')
    } else {
      message.error('编辑企业信息失败！')
    }
  }).catch((error: Error) => {
    console.log(error);
  })
}
const getData = async () => {
  let res = await api.getBusinessDetails(queryParams)
  if (Object.prototype.toString.call(res) === '[object Object]') {
    form.value = res
    if (res.provinceId && res.cityId && res.areaId) {
      form.value.regionCode = [res.provinceId, res.cityId, res.areaId]
    } else {
      form.value.regionCode = []
    }
  }
}
onActivated(() => {
  isRefresh.value = '0'
  if (props.oid) {
    let key: keyof queryParamsType;
    for (key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        queryParams[key] = JSON.parse(decodeURIComponent(props[key] as string))
      }
    }
    getData()
  }
})
onDeactivated(() => {
  formRef.value.resetFields()
  form.value = {}
})
</script>

<style scoped lang="scss">
.content_box {
  position: relative;
  width: 100%;
  height: 100%;

  .check_box {
    width: 100%;
    padding: 24px 20px;

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
  }
}
</style>