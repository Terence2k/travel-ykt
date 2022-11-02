<template>
  <div class="add_box">
    <div>
      <div class="title">
        <span>
          基本信息
        </span>
      </div>
      <div class="form_body">
        <!-- <a-form ref="formRef" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
        :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item name="businessType" label="企业类型">
          <a-select v-model:value="form.businessType" placeholder="请选择企业类型" @change="optionChange">
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
          <a-date-picker v-model:value="form.businessTerm" placeholder="请选择营业期限" style="width:100%" :format="dateFormat"
            :valueFormat="dateFormat" />
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
        <a-form-item label="创建超级管理员账号">
        </a-form-item>
        <a-form-item name="account" label="超级管理员账号">
          <a-input v-model:value="form.account" placeholder="请输入超级管理员账号">
          </a-input>
        </a-form-item>
        <a-form-item name="password" label="超级管理员密码" has-feedback>
          <a-input v-model:value="form.password" placeholder="请输入超级管理员密码" type="password">
          </a-input>
        </a-form-item>
        <a-form-item name="checkPass" label="再输入一遍密码" has-feedback>
          <a-input v-model:value="form.checkPass" placeholder="请输入再输入一遍密码" type="password">
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">保存</a-button>
        </a-form-item>
      </a-form> -->
      </div>
      <!-- <CommonModal title="企业添加确认" v-model:visible="saveVisible" @cancel="saveCancel" @close="saveCancel"
      @conform="saveConform" :conform-text="'确认'">
    </CommonModal> -->
      <div class="title">
        <span>
          合同信息
        </span>
      </div>
      <div class="form_body"></div>
      <div class="title">
        <span>
          其他费用
        </span>
      </div>
      <div class="btn_box">
        <a-button type="primary" @click="nextStep" style="margin-right: 20px">下一步</a-button>
        <a-button type="primary" @click="back" style="margin-right: 20px">取消</a-button>
      </div>
    </div>
    <div>
      <div class="title">
        <span>
          合同信息
        </span>
      </div>
      <div class="form_body"></div>
      <div class="title">
        <span>
          合同信息
        </span>
      </div>
      <div class="form_body"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
// import { CloseOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
const router = useRouter();
const route = useRoute();
const formRef = ref()
const dateFormat = 'YYYY-MM-DD';
const saveVisible = ref(false)
const loading = ref(false)
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
const form = reactive<detailsType>({
  regionCode: [],
  businessType: undefined,
  password: '',
  checkPass: '',
  accountType: 1,
  name: undefined,
  businessLicenseUrl: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
})
const rest = () => {
  formRef.value.resetFields()
}
const isRefresh = ref('0')
const back = () => {
  router.push({
    name: 'tourists',
    params: {
      isRefresh: isRefresh.value
    }
  })
}

const common = {
  account: [{ required: true, trigger: 'blur', message: '请输入超级管理员账号' }],
}
onActivated(() => {
  isRefresh.value = '0'
  // formRef.value.clearValidate()
})
onDeactivated(() => {
  // formRef.value.resetFields()
})

const submit = () => {
  formRef.value.validateFields().then(() => {
    saveVisible.value = true
  }).catch((error: Error) => {
    console.log(error);
  })
}
const saveCancel = () => {
  saveVisible.value = false
}
const saveConform = () => {
  loading.value = true;
  api.addCompany(form).then((res: any) => {
    if (res == '企业创建成功！') {
      isRefresh.value = '1'
      saveVisible.value = false
    } else {
      message.error(res);
    }
  }).catch((err: string) => {
    console.log(err)
  })
  loading.value = false;
}

const nextStep = () => { }
onMounted(() => {
})
</script>

<style scoped lang="scss">
.add_box {
  padding: 20px;

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

  .form_body,
  .btn_box {
    margin-top: 20px;
    width: 100%;
  }
}
</style>