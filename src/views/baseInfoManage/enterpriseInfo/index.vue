<template>
  <div class="add_box">
    <div class="title">
      <span>
        我的企业基本信息
      </span>
      <span class="enterprise_state">
        {{ enterpriseState }}
      </span>
    </div>
    <!-- 旅行社、酒店、景区、餐厅 -->
    <div class="form_body" v-if="condition1.includes(currentOption)">
      <a-form ref="formRef" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
        :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item name="businessType" label="企业类型">
          <a-select v-model:value="form.businessType" placeholder="请选择企业类型" @change="optionChange">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :key="item.codeValue">{{
            item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="name" label="企业名称">
          <a-input v-model:value="form.name" placeholder="请输入企业名称">
          </a-input>
        </a-form-item>
        <a-form-item name="region" label="企业所属地区">
          <a-input v-model:value="form.region" placeholder="请输入企业所属地区">
          </a-input>
        </a-form-item>
        <a-form-item name="address" label="企业详情地址">
          <a-input v-model:value="form.address" placeholder="请输入企业详情地址">
          </a-input>
        </a-form-item>
        <a-form-item name="legalPerson" label="法定代表人">
          <a-input v-model:value="form.legalPerson" placeholder="请输入法定代表人">
          </a-input>
        </a-form-item>
        <a-form-item name="managementRange" label="经营范围">
          <a-textarea v-model:value="form.managementRange" placeholder="请输入经营范围" :rows="2">
          </a-textarea>
        </a-form-item>
        <a-form-item name="registeredCapital" label="注册资本">
          <a-input v-model:value="form.registeredCapital" placeholder="请输入注册资本" suffix="万元">
          </a-input>
        </a-form-item>
        <a-form-item name="establishTime" label="成立日期">
          <a-date-picker v-model:value="form.establishTime" placeholder="请选择成立日期" style="width:100%" />
        </a-form-item>
        <a-form-item name="businessTerm" label="营业期限">
          <a-date-picker v-model:value="form.businessTerm" placeholder="请选择营业期限" style="width:100%" />
        </a-form-item>
        <a-form-item name="contactName" label="联系人">
          <a-input v-model:value="form.contactName" placeholder="请输入联系人">
          </a-input>
        </a-form-item>
        <a-form-item name="phone" label="联系电话">
          <a-input v-model:value="form.phone" placeholder="请输入联系电话">
          </a-input>
        </a-form-item>
        <a-form-item name="accountType" label="公司账户类型">
          <a-radio-group v-model:value="form.accountType">
            <a-radio :value="1">对公账户</a-radio>
            <a-radio :value="2">对私账户</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="bankAccountName" label="公司账户名称">
          <a-input v-model:value="form.bankAccountName" placeholder="请输入公司账户名称">
          </a-input>
        </a-form-item>
        <a-form-item name="bank" label="开户行">
          <a-input v-model:value="form.bank" placeholder="请输入开户行">
          </a-input>
        </a-form-item>
        <a-form-item name="bankAccount" label="公司账号">
          <a-input v-model:value="form.bankAccount" placeholder="请输入公司账号">
          </a-input>
        </a-form-item>
        <a-form-item name="creditCode" label="统一社会信用代码">
          <a-input v-model:value="form.creditCode" placeholder="请输入统一社会信用代码">
          </a-input>
        </a-form-item>
        <a-form-item name="businessLicenseUrl" label="营业执照">
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
        <div class="fail" v-if="failVisible">
          <div class="header">
            <div class="enterprise_state">信息变更申请被驳回！</div>
            <div class="tip_box" @click="hideFail">我已知晓，不再提示。</div>
          </div>
          <div class="row">
            <div class="key">驳回原因</div>
            <div>企业地址与营业执照上地址不符。</div>
          </div>
          <div class="row">
            <div class="key">驳回时间</div>
            <div>2022.10.08 12:34:18</div>
          </div>
        </div>
        <a-form-item>
          <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">提交审核</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 旅游协会、一卡通、监理、古维管理部门 -->
    <div class="form_body" v-else-if="condition2.includes(currentOption)">
      <a-form ref="formRef" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
        :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item name="businessType" label="企业类型">
          <a-select v-model:value="form.businessType" placeholder="请选择企业类型" @change="optionChange">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :key="item.codeValue">{{
            item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="name" label="企业名称">
          <a-input v-model:value="form.name" placeholder="请输入企业名称">
          </a-input>
        </a-form-item>
        <a-form-item name="region" label="企业所属地区">
          <a-input v-model:value="form.region" placeholder="请输入企业所属地区">
          </a-input>
        </a-form-item>
        <a-form-item name="address" label="企业详情地址">
          <a-input v-model:value="form.address" placeholder="请输入企业详情地址">
          </a-input>
        </a-form-item>
        <a-form-item name="contactName" label="联系人">
          <a-input v-model:value="form.contactName" placeholder="请输入联系人">
          </a-input>
        </a-form-item>
        <a-form-item name="phone" label="联系电话">
          <a-input v-model:value="form.phone" placeholder="请输入联系电话">
          </a-input>
        </a-form-item>
        <a-form-item name="accountType" label="公司账户类型">
          <a-radio-group v-model:value="form.accountType">
            <a-radio :value="1">对公账户</a-radio>
            <a-radio :value="2">对私账户</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="bankAccountName" label="公司账户名称">
          <a-input v-model:value="form.bankAccountName" placeholder="请输入公司账户名称">
          </a-input>
        </a-form-item>
        <a-form-item name="bank" label="开户行">
          <a-input v-model:value="form.bank" placeholder="请输入开户行">
          </a-input>
        </a-form-item>
        <a-form-item name="bankAccount" label="公司账号">
          <a-input v-model:value="form.bankAccount" placeholder="请输入公司账号">
          </a-input>
        </a-form-item>
        <a-form-item name="creditCode" label="统一社会信用代码">
          <a-input v-model:value="form.creditCode" placeholder="请输入统一社会信用代码">
          </a-input>
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
          <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">提交审核</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 旅游集团 -->
    <div class="form_body" v-else-if="condition3.includes(currentOption)">
      <a-form ref="formRef" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
        :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item name="businessType" label="企业类型">
          <a-select v-model:value="form.businessType" placeholder="请选择企业类型" @change="optionChange">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :key="item.codeValue">{{
            item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="bankAccountName" label="公司账户名称">
          <a-input v-model:value="form.bankAccountName" placeholder="请输入公司账户名称">
          </a-input>
        </a-form-item>
        <a-form-item name="bank" label="开户行">
          <a-input v-model:value="form.bank" placeholder="请输入开户行">
          </a-input>
        </a-form-item>
        <a-form-item name="bankAccount" label="公司账号">
          <a-input v-model:value="form.bankAccount" placeholder="请输入公司账号">
          </a-input>
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
          <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">提交审核</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 文旅局 -->
    <div class="form_body" v-else-if="condition4.includes(currentOption)">
      <a-form ref="formRef" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
        :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item name="businessType" label="企业类型">
          <a-select v-model:value="form.businessType" placeholder="请选择企业类型" @change="optionChange">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :key="item.codeValue">{{
            item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="name" label="企业名称">
          <a-input v-model:value="form.name" placeholder="请输入企业名称">
          </a-input>
        </a-form-item>
        <a-form-item name="region" label="企业所属地区">
          <a-input v-model:value="form.region" placeholder="请输入企业所属地区">
          </a-input>
        </a-form-item>
        <a-form-item name="address" label="企业详情地址">
          <a-input v-model:value="form.address" placeholder="请输入企业详情地址">
          </a-input>
        </a-form-item>
        <a-form-item name="contactName" label="联系人">
          <a-input v-model:value="form.contactName" placeholder="请输入联系人">
          </a-input>
        </a-form-item>
        <a-form-item name="phone" label="联系电话">
          <a-input v-model:value="form.phone" placeholder="请输入联系电话">
          </a-input>
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
          <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">提交审核</a-button>
        </a-form-item>
      </a-form>
    </div>
    <CommonModal title="企业信息提交审核" v-model:visible="saveVisible" @cancel="saveCancel" @close="saveCancel"
      @conform="saveConform" :conform-text="'确认'">
      是否要将本次修改完善的企业信息
      提交给行政机关单位管理员审核？
    </CommonModal>
    <CommonModal title="企业信息提交审核" v-model:visible="tipVisible" @cancel="tipCancel" @close="tipCancel"
      @conform="tipConform" :conform-text="'我知道了'" :is-cancel="false">
      您已成功添加 丽江风情假日旅行社 ，超级管理员账
      号密码已分配成功，请线下告知该企业管理员登录。
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';
import { message } from 'ant-design-vue';
import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import type { Rule } from 'ant-design-vue/es/form';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
const router = useRouter();
const route = useRoute();
const formRef = ref()
const saveVisible = ref(false)
const tipVisible = ref(false)
const failVisible = ref(true)
const loading = ref(false)
type detailsType = {
  businessType?: string,
  name?: string,
  provinceId?: string | number,
  cityId?: string | number,
  areaId?: string | number,
  address?: string,
  region?: string,
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
  password: '',
  checkPass: '',
  accountType: 1,
  name: undefined,
  businessLicenseUrl: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
})
const enterpriseState = ref('信息不完善，待补充。')
const currentOption = ref('default')
// 旅行社、酒店、景区、餐厅
const condition1 = ['TRAVEL', 'HOTEL', 'TICKET', 'CATERING', 'default']
// 旅游协会、一卡通、监理、古维管理部门
const condition2 = ['ASSOCIATION', 'YKT', 'SUPERVISE', 'ANCIENT_UYGUR']
// 旅游集团
const condition3 = ['GROUP']
// 文旅局
const condition4 = ['CULTURE_BUREAU']
let validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码！');
  } else {
    if (form.checkPass !== '') {
      formRef.value.validateFields('checkPass');
    }
    return Promise.resolve();
  }
};
let validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码！');
  } else if (value !== form.password) {
    return Promise.reject("两次输入的密码不一致！");
  } else {
    return Promise.resolve();
  }
};
// 旅行社、酒店、景区、餐厅
const formRules6: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  region: [{ required: true, trigger: 'blur', message: '请选择企业所属地区' }],
  address: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  legalPerson: [{ required: true, trigger: 'blur', message: '请输入法定代表人' }],
  managementRange: [{ required: true, trigger: 'blur', message: '请输入经营范围' }],
  registeredCapital: [{ required: true, trigger: 'blur', message: '请输入注册资本' }],
  establishTime: [{ required: true, trigger: 'blur', message: '请选择成立日期' }],
  businessTerm: [{ required: true, trigger: 'blur', message: '请选择营业期限' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
  accountType: [{ required: true, trigger: 'blur', message: '请选择公司账户类型' }],
  bankAccountName: [{ required: true, trigger: 'blur', message: '请输入公司账户名称' }],
  bank: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
  bankAccount: [{ required: true, trigger: 'blur', message: '请输入公司账号' }],
  creditCode: [{ required: true, trigger: 'blur', message: '请输入统一社会信用代码' }],
  businessLicenseUrl: [{ required: true, trigger: 'blur', message: '请上传营业执照照片' }],
  account: [{ required: true, trigger: 'blur', message: '请输入超级管理员账号' }],
  password: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
}
// 旅游协会、一卡通、监理、古维管理部门
const formRules9: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  region: [{ required: true, trigger: 'blur', message: '请选择企业所属地区' }],
  address: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
  accountType: [{ required: true, trigger: 'blur', message: '请选择公司账户类型' }],
  bankAccountName: [{ required: true, trigger: 'blur', message: '请输入公司账户名称' }],
  bank: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
  bankAccount: [{ required: true, trigger: 'blur', message: '请输入公司账号' }],
  creditCode: [{ required: true, trigger: 'blur', message: '请输入统一社会信用代码' }],
  account: [{ required: true, trigger: 'blur', message: '请输入超级管理员账号' }],
  password: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
}
// 旅游集团
const formRules7: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  bankAccountName: [{ required: true, trigger: 'blur', message: '请输入公司账户名称' }],
  bank: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
  bankAccount: [{ required: true, trigger: 'blur', message: '请输入公司账号' }],
  password: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
}
// 文旅局
const formRules8: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  region: [{ required: true, trigger: 'blur', message: '请选择企业所属地区' }],
  address: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
  password: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
}
const formRules = ref<Record<string, Rule[]>>({})
formRules.value = formRules6
const businessManageOptions = useBusinessManageOption();
const initOpeion = async () => {
  await businessManageOptions.getBusinessTypeOption();
};
const businessTypeOption = computed(() => businessManageOptions.businessTypeOption);
const uploadDown = () => {
  form.businessLicenseUrl = form.businessLicenseUrl ? form.businessLicenseUrl[0] : undefined
}

const optionChange = (value: string) => {
  currentOption.value = value
  if (condition1.includes(value)) {
    formRules.value = formRules6
  } else if (condition2.includes(value)) {
    formRules.value = formRules9
  } else if (condition3.includes(value)) {
    formRules.value = formRules7
  } else if (condition4.includes(value)) {
    formRules.value = formRules8
  }
}
const submit = () => {
  saveVisible.value = true
  formRef.value.validateFields().then(() => { })
}
const saveCancel = () => {
  saveVisible.value = false
}
const saveConform = () => {
  saveVisible.value = false
  tipVisible.value = true
}
const tipCancel = () => {
  tipVisible.value = false
}
const tipConform = () => {
  tipVisible.value = false
}
const hideFail = () => {
  failVisible.value = false
}
onMounted(() => {
  initOpeion()
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
  }

  .enterprise_state {
    color: #de0025;
  }

  .fail,
  .header,
  .row {
    margin-bottom: 24px;
  }

  .row {
    color: #de0025;
    display: flex;

    .key {
      width: 150px;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;

    .tip_box {
      color: #209cd3;
      cursor: pointer;
    }
  }

  .form_body {
    margin-top: 20px;
    width: 60%;
  }
}
</style>