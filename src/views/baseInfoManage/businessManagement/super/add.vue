<template>
  <div class="add_box">
    <div class="title">
      <span>
        添加新的企业（录入基本信息）：
      </span>
      <span class="close_btn" @click="back">
        <close-outlined />
      </span>
    </div>
    <!-- 旅行社、酒店、景区、餐厅 -->
    <!-- 旅游协会、一卡通、监理、古维管理部门 -->
    <!-- 旅游集团 -->
    <!-- 文旅局 -->
    <div class="form_body">
      <a-form ref="formRef" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
        :label-col="labelCol">
        <a-form-item name="businessType" label="企业类型">
          <a-select v-model:value="form.businessType" placeholder="请选择企业类型" @change="optionChange">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :key="item.codeValue">{{
              item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="name" label="企业名称" v-show="formKeys?.name">
          <a-input v-model:value="form.name" placeholder="请输入企业名称" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="regionCode" label="企业所属地区" v-show="formKeys?.regionCode">
          <address-selector placeholder="请选择所属地区" v-model:value="form.regionCode" @change="regionChange">
          </address-selector>
        </a-form-item>
        <a-form-item name="addressDetail" label="企业详情地址" v-show="formKeys?.addressDetail">
          <a-input v-model:value="form.addressDetail" placeholder="请输入企业详情地址" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="accountName" label="超级管理员" v-show="formKeys?.accountName">
          <a-input v-model:value="form.accountName" placeholder="请输入超级管理员" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="legalPerson" label="法定代表人" v-show="formKeys?.legalPerson">
          <a-input v-model:value="form.legalPerson" placeholder="请输入法定代表人" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="managementRange" label="经营范围" v-show="formKeys?.managementRange">
          <a-textarea v-model:value="form.managementRange" placeholder="请输入经营范围" :rows="2" allowClear>
          </a-textarea>
        </a-form-item>
        <a-form-item name="registeredCapital" label="注册资本" v-show="formKeys?.registeredCapital">
          <a-input v-model:value.number="form.registeredCapital" placeholder="请输入注册资本" suffix="万元" allowClear>
          </a-input>
          <!-- <a-input v-model:value="form.registeredCapital" placeholder="请输入注册资本" suffix="万元" @change="() => {
            form.registeredCapital = form.registeredCapital?.replace(/[^0-9.]/g, '')
          }">
          </a-input> -->
        </a-form-item>
        <!-- <a-form-item name="establishTime" label="成立日期" v-show="formKeys?.establishTime">
          <a-date-picker v-model:value="form.establishTime" placeholder="请选择成立日期" :valueFormat="dateFormat"
            :disabled-date="disabledAfterDate" style="width:100%" />
        </a-form-item> -->
        <el-form ref="dateFormRef" :model="form" :rules="dateRules" :label-width="labelWidth" label-position="left">
          <el-form-item label="成立日期：" prop="establishTime" v-show="formKeys?.establishTime">
            <picker v-model="form.establishTime" type="date" :value-format="dateFormat"
              :disabled-date="disabledAfterDate" placeholder="请选择成立日期" style="width:100%"></picker>
          </el-form-item>
          <el-form-item label="营业期限：" prop="businessTerm" v-show="formKeys?.businessTerm">
            <picker v-model="form.businessTerm" type="date" :value-format="dateFormat"
              :disabled-date="disabledBeforeDate" placeholder="请选择营业期限" style="width:100%"></picker>
          </el-form-item>
        </el-form>
        <!-- <a-form-item label="营业期限" v-show="formKeys?.businessTerm">
          <a-date-picker v-model:value="form.businessTerm" placeholder="请选择营业期限" :valueFormat="dateFormat"
            :disabled-date="disabledBeforeDate" style="width:100%" />
        </a-form-item> -->
        <a-form-item name="contactName" label="联系人" v-show="formKeys?.contactName">
          <a-input v-model:value="form.contactName" placeholder="请输入联系人" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="phone" label="联系电话" v-show="formKeys?.phone">
          <a-input v-model:value="form.phone" placeholder="请输入联系电话" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="accountType" label="公司账户类型" v-show="formKeys?.accountType">
          <a-radio-group v-model:value="form.accountType">
            <a-radio :value="1">对公账户</a-radio>
            <a-radio :value="2">对私账户</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="bankAccountName" label="公司账户名称" v-show="formKeys?.bankAccountName">
          <a-input v-model:value="form.bankAccountName" placeholder="请输入公司账户名称" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="bank" label="开户行" v-show="formKeys?.bank">
          <a-input v-model:value="form.bank" placeholder="请输入开户行" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="bankAccount" label="公司账号" v-show="formKeys?.bankAccount">
          <a-input v-model:value="form.bankAccount" placeholder="请输入公司账号" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="creditCode" label="统一社会信用代码" v-show="formKeys?.creditCode">
          <a-input v-model:value="form.creditCode" placeholder="请输入统一社会信用代码" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="businessLicenseUrl" label="营业执照" v-show="formKeys?.businessLicenseUrl">
          <Upload v-model="form.businessLicenseUrl" :maxCount="1" ref="imgUploadRef"/>
        </a-form-item>
        <!-- 扩展信息 -->
        <a-form-item label="扩展信息" v-show="['TRAVEL', 'HOTEL', 'TICKET', 'CATERING'].includes(form.businessType || '')">
        </a-form-item>
        <a-form-item name="manageUrl" label="经营许可证" v-show="formKeys?.manageUrl">
          <Upload v-model="form.manageUrl" :maxCount="1" ref="imgUploadRef1"/>
        </a-form-item>
        <a-form-item name="licenseNo" label="12301旅行社许可证号" v-show="formKeys?.licenseNo">
          <a-input v-model:value="form.licenseNo" placeholder="请输入12301旅行社许可证号" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="isIndividual" label="是否为散客中心" v-show="formKeys?.isIndividual">
          <a-radio-group v-model:value="form.isIndividual">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="individualDeparturePlace" label="散客常用出发地" v-show="formKeys?.individualDeparturePlace">
          <a-input v-model:value="form.individualDeparturePlace" placeholder="请输入散客常用出发地" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="individualReturnPlace" label="散客常用返回地" v-show="formKeys?.individualReturnPlace">
          <a-input v-model:value="form.individualReturnPlace" placeholder="请输入散客常用返回地" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="unitStatus" label="开业状态" v-show="formKeys?.unitStatus && form.businessType === 'HOTEL'">
          <a-radio-group v-model:value="form.unitStatus">
            <a-radio :value="0">开业</a-radio>
            <a-radio :value="1">停业</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="unitStatus" label="开业状态"
          v-show="formKeys?.unitStatus && ['CATERING', 'TICKET'].includes(form.businessType || '')">
          <a-radio-group v-model:value="form.unitStatus">
            <a-radio :value="true">开业</a-radio>
            <a-radio :value="false">停业</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="hotelStarId" label="星级" v-show="formKeys?.hotelStarId">
          <a-select v-model:value="form.hotelStarId" placeholder="请选择酒店星级">
            <a-select-option v-for="item in hotelStarList" :value="item.oid" :key="item.oid">
              {{ item.starCode }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="scenicLevel" label="等级" v-show="formKeys?.scenicLevel">
          <a-select v-model:value="form.scenicLevel" placeholder="请选择景区等级">
            <a-select-option v-for="item in scenicLevelList" :value="item.levelId" :key="item.levelId">
              {{ item.levelName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="derate" label="是否支持减免" v-show="formKeys?.derate">
          <a-radio-group v-model:value="form.derate">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="fullRule" label="减免规则" v-show="formKeys?.fullRule && formKeys?.reduceRule">
          <div style="display: flex;align-items: start;">
            <div style="display: flex;align-items: center; flex:1">
              <span style="margin: 0 5px;">满</span>
              <a-input placeholder="请配置数字" v-model:value="form.fullRule"
                oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')" />
            </div>
            <a-form-item name="reduceRule" style="flex:1">
              <div style="display: flex;align-items: center;">
                <span style="margin: 0 5px;">减</span>
                <a-input placeholder="请配置数字" v-model:value="form.reduceRule"
                  oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')" />
              </div>
            </a-form-item>
          </div>
        </a-form-item>
        <el-form :model="form" :label-width="labelWidth" label-position="left">
          <el-form-item label="营业时间：" v-show="formKeys?.startTime && formKeys?.endTime">
            <tPicker is-range v-model="form.rangeTime" @change="timePickerChange" format="HH:mm"
              start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" style="width:100%">
            </tPicker>
          </el-form-item>
        </el-form>
        <a-form-item name="shopPhone" label="店铺联系电话" v-show="formKeys?.shopPhone">
          <a-input v-model:value="form.shopPhone" placeholder="请输入店铺联系电话" />
        </a-form-item>
        <a-form-item name="cateringDesc" label="其他" v-show="formKeys?.cateringDesc">
          <a-input v-model:value="form.cateringDesc" placeholder="其他描述" />
        </a-form-item>
        <!-- 创建超级管理员账号 -->
        <a-form-item label="创建超级管理员账号">
        </a-form-item>
        <a-form-item name="accountPhone" label="超级管理员电话">
          <a-input v-model:value="form.accountPhone" placeholder="请输入手机号" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="account" label="登录账号">
          <a-input v-model:value="form.account" placeholder="输入英文和字母组合而成的登录账号" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="password" label="登录密码">
          <a-input v-model:value="form.password" placeholder="8-16位，必须包含字母、数字、特殊字符任意2项" allowClear>
          </a-input>
        </a-form-item>
        <!-- <a-form-item name="password" label="超级管理员密码" has-feedback>
          <a-input v-model:value="form.password" placeholder="请输入超级管理员密码" type="password" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="checkPass" label="再输入一遍密码" has-feedback>
          <a-input v-model:value="form.checkPass" placeholder="请输入再输入一遍密码" type="password" allowClear>
          </a-input>
        </a-form-item> -->
        <a-form-item name="legalPersonUrl" label="法人身份证附件" v-show="formKeys?.legalPersonUrl">
          <Upload v-model="form.legalPersonUrl" :maxCount="2" ref="imgUploadRef2"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submit(dateFormRef)" style="margin-right:20px"
            :loading="loading">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
    <CommonModal title="企业添加确认" v-model:visible="saveVisible" @cancel="saveCancel" @close="saveCancel"
      @conform="saveConform" :conform-text="'确认'">
      添加后不可删除，但可以注销、禁用。
      您是否检查无误，确认要添加该企业？
    </CommonModal>
    <CommonModal title="提示" v-model:visible="tipVisible" @cancel="tipCancel" @close="tipCancel" @conform="tipCancel"
      :conform-text="'我知道了'" :is-cancel="false">
      您已成功添加 {{ form.name }} ，超级管理员账
      号密码已分配成功，请线下告知该企业管理员登录。
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import Upload from '@/components/common/imageWrapper.vue';
// import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
// import { useBusinessManageOption } from '@/stores/modules/businessManage';
import type { Rule } from 'ant-design-vue/es/form';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import type { Dayjs } from 'dayjs';
import picker from '@/components/common/datePicker.vue'
import tPicker from '@/components/common/timePicker.vue'
import type { FormInstance } from 'element-plus'
import {
  commonFormRules5,
  commonFormRules6,
  commonFormRules9,
  commonFormRules7,
  commonFormRules8,
  condition1,
  condition2,
  condition3,
  condition4,
  condition5,
  disabledBeforeDate,
  disabledAfterDate,
  getKeylist,
  businessTypeOption
} from '@/views/baseInfoManage/businessManagement/super/common'
const router = useRouter();
const route = useRoute();
const formRef = ref();
const formKeys = ref();
const dateFormRef = ref<FormInstance>();
const dateFormat = 'YYYY-MM-DD';
const saveVisible = ref(false);
const tipVisible = ref(false);
const loading = ref(false);
const labelWidth = '160px'
const labelCol = { style: { width: labelWidth } }
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
  establishTime?: Dayjs,
  businessTerm?: Dayjs,
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
  checkPass?: string,
  licenseNo?: string,
  isIndividual?: 0 | 1,
  individualDeparturePlace?: string,
  individualReturnPlace?: string,
  legalPersonUrl?: string,
  accountPhone?: string,
  accountName?: string,
  unitStatus?: number,
  hotelStarId?: number | string,
  scenicLevel?: number | string,
  derate?: boolean,
  fullRule?: number,
  reduceRule?: number,
  rangeTime?: string[],
  shopPhone?: string,
  cateringDesc?: string,
  startTime?: string,
  endTime?: string,
  manageUrl?: string,
}
const form = reactive<detailsType>({
  regionCode: [2565, 2619, 2620],
  businessType: undefined,
  password: '',
  checkPass: '',
  accountType: 1,
  isIndividual: 1,
  name: undefined,
  businessLicenseUrl: ''
})
const hotelStarList = ref();
const scenicLevelList = ref();
const isRefresh = ref('0')
const back = () => {
  router.push({
    name: 'apply',
    params: {
      isRefresh: isRefresh.value
    }
  })
}

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
/* let validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码！');
  } else if (value !== form.password) {
    return Promise.reject("两次输入的密码不一致！");
  } else {
    return Promise.resolve();
  }
}; */
const dateRules = {
  /* establishTime: [
    {
      type: 'date',
      required: true,
      message: '请选择成立日期',
      trigger: 'change',
    },
  ],
  businessTerm: [
    {
      type: 'date',
      required: true,
      message: '请选择营业期限',
      trigger: 'change',
    },
  ], */
}
const common: Record<string, Rule[]> = {
  accountPhone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
  account: [{ required: true, trigger: 'blur', message: '输入英文和字母组合而成的登录账号' }],
  password: [{ required: true, validator: validatePass, trigger: 'change' }],
  // checkPass: [{ validator: validatePass2, trigger: 'change' }],
}
const formRules6 = { ...commonFormRules6, ...common }
const formRules9 = { ...commonFormRules9, ...common }
const formRules7 = { ...commonFormRules7, ...common }
const formRules8 = { ...commonFormRules8, ...common }
const formRules5 = { ...commonFormRules5, ...common }
const formRules = ref<Record<string, Rule[]>>({})
const imgUploadRef = ref()
const imgUploadRef1 = ref()
const imgUploadRef2 = ref()
onActivated(() => {
  isRefresh.value = '0'
  formRef.value.clearValidate()
  dateFormRef.value?.clearValidate()
})
onDeactivated(() => {
  dateFormRef.value?.resetFields()
  formRef.value?.resetFields()
  imgUploadRef.value.clearFileList()
  imgUploadRef1.value.clearFileList()
  imgUploadRef2.value.clearFileList()
})

/* const businessManageOptions = useBusinessManageOption();
const initOpeion = async () => {
  await businessManageOptions.getBusinessTypeOption();
};
const businessTypeOption = computed(() => businessManageOptions.businessTypeOption); */
const uploadDown = () => {
  form.businessLicenseUrl = form.businessLicenseUrl ? form.businessLicenseUrl[0] : undefined
}
// 获取酒店星级下拉数据
const getHotelStarList = async () => {
  hotelStarList.value = await api.getHotelStarList();
}
// 获取景区等级下拉数据
const getScenicLevels = async () => {
  scenicLevelList.value = await api.getScenicLevels();
}
const optionChange = (value: string) => {
  /* if (condition1.includes(value)) {
    formRules.value = formRules6
  } else if (condition2.includes(value)) {
    formRules.value = formRules9
  } else if (condition3.includes(value)) {
    formRules.value = formRules7
  } else if (condition4.includes(value)) {
    formRules.value = formRules8
  } else if (condition5.includes(value)) {
    formRules.value = formRules5
  } */
  formKeys.value = getKeylist(value, 'edit')
  value === 'HOTEL' && getHotelStarList();
  value === 'TICKET' && getScenicLevels();
}
const regionChange = () => {
  form.provinceId = form.regionCode ? form.regionCode[0] : undefined
  form.cityId = form.regionCode ? form.regionCode[1] : undefined
  form.areaId = form.regionCode ? form.regionCode[2] : undefined
}
const submit = (formEl: any) => {
  const a = Promise.all([
    formRef.value?.validateFields(),
    formEl?.validate()
  ])
  a.then(async () => {
    saveVisible.value = true
  }).catch((error: Error) => {
    console.log(error);
  })
}
const getParams = () => {
  if (form.businessType === 'TRAVEL') {
    // 旅行社
    const {
      licenseNo,
      isIndividual,
      individualDeparturePlace,
      individualReturnPlace
    } = form
    const travelAgencyInformationBo = {
      licenseNo,
      isIndividual,
      individualDeparturePlace,
      individualReturnPlace
    }
    return {
      ...toRaw(form),
      travelAgencyInformationBo
    }
  } else if (form.businessType === 'CATERING') {
    // 餐厅
    const {
      startTime,
      endTime,
      shopPhone,
      cateringDesc,
      unitStatus
    } = form
    const cateringInfoBO = {
      startTime,
      endTime,
      shopPhone,
      cateringDesc,
      unitStatus
    }
    return {
      ...toRaw(form),
      cateringInfoBO
    }
  } else if (form.businessType === 'TICKET') {
    // 景区
    const {
      unitStatus,
      scenicLevel,
      derate,
      fullRule,
      reduceRule,
    } = form
    const scenicCompanyBo = {
      unitStatus,
      scenicLevel,
      derate,
      fullRule,
      reduceRule,
    }
    return {
      ...toRaw(form),
      scenicCompanyBo
    }
  } else if (form.businessType === 'HOTEL') {
    // 酒店
    const {
      hotelStarId,
      unitStatus,
      derate,
      fullRule,
      reduceRule,
    } = form
    const hotelInfoBO = {
      hotelStarId,
      unitStatus,
      derate,
      fullRule,
      reduceRule,
    }
    return {
      ...toRaw(form),
      hotelInfoBO
    }
  } else {
    return toRaw(form)
  }
}
const saveCancel = () => {
  saveVisible.value = false
}
const saveConform = () => {
  loading.value = true;
  const params = getParams()
  api.addCompany(params).then((res: any) => {
    if (res == '企业创建成功！') {
      isRefresh.value = '1'
      saveVisible.value = false
      tipVisible.value = true
    } else {
      message.error(res);
      saveVisible.value = false
    }
  }).catch((err: string) => {
    console.log(err)
  })
  loading.value = false;
}
const tipCancel = () => {
  tipVisible.value = false
  formRef.value?.resetFields()
  dateFormRef.value?.resetFields()
  form.businessLicenseUrl = undefined
  back()
}
const timePickerChange = () => {
  if (form.rangeTime) {
    form.startTime = form.rangeTime[0]
    form.endTime = form.rangeTime[1]
  } else {
    form.startTime = ''
    form.endTime = ''
  }
}
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

  .form_body {
    margin-top: 20px;
    width: 60%;
  }
}
</style>