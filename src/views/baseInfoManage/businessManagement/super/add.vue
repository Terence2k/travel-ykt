<template>
  <div class="add_box">
    <div class="title">
      <span>
        企业基础信息
      </span>
      <span class="close_btn" @click="back">
        <close-outlined />
      </span>
    </div>
    <!-- 旅行社、酒店、景区、餐厅 -->
    <!-- 旅游协会、一卡通、监理、古维管理部门 -->
    <!-- 旅游集团 -->
    <!-- 文旅局 -->
    <a-form ref="formRef" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
      :label-col="labelCol">
      <div class="form_body">
        <a-form-item name="businessType" label="企业类型">
          <a-select v-model:value="form.businessType" placeholder="请选择企业类型" @change="optionChange">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :key="item.codeValue">{{
              item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="name" label="企业名称" v-show="formKeys?.name">
          <a-input v-model:value="form.name" placeholder="请输入企业名称">
          </a-input>
        </a-form-item>
        <a-form-item name="regionCode" label="所属地址" v-show="formKeys?.regionCode">
          <address-selector placeholder="请选择企业所属地区" v-model:value="form.regionCode" @change="regionChange">
          </address-selector>
        </a-form-item>
        <a-form-item name="addressDetail" label="详细地址" v-show="formKeys?.addressDetail">
          <a-input v-model:value="form.addressDetail" placeholder="请输入企业详细地址">
          </a-input>
        </a-form-item>
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
        <a-form-item name="contactName" label="联系人" v-show="formKeys?.contactName">
          <a-input v-model:value="form.contactName" placeholder="请输入联系人姓名">
          </a-input>
        </a-form-item>
        <a-form-item name="phone" label="联系人电话" v-show="formKeys?.phone">
          <a-input v-model:value="form.phone" placeholder="请输入联系人电话">
          </a-input>
        </a-form-item>
        <a-form-item name="creditCode" label="统一社会信息代码" v-show="formKeys?.creditCode">
          <a-input v-model:value="form.creditCode" placeholder="请输入企业统一社会信息代码">
          </a-input>
        </a-form-item>
        <a-form-item name="businessLicenseUrl" label="营业执照" v-show="formKeys?.businessLicenseUrl">
          <Upload v-model="form.businessLicenseUrl" :maxCount="1" ref="imgUploadRef" />
        </a-form-item>
        <a-form-item name="registeredCapital" label="注册资本" v-show="formKeys?.registeredCapital">
          <a-input v-model:value.number="form.registeredCapital" placeholder="请输入注册资本" suffix="万元" allowClear>
          </a-input>
          <!-- <a-input v-model:value="form.registeredCapital" placeholder="请输入注册资本" suffix="万元" @change="() => {
            form.registeredCapital = form.registeredCapital?.replace(/[^0-9.]/g, '')
          }">
          </a-input> -->
        </a-form-item>
      </div>
      <!-- 扩展信息 -->
      <div class="tag" v-show="['TRAVEL', 'HOTEL', 'TICKET', 'CATERING'].includes(form.businessType || '')">
        扩展信息
      </div>
      <div class="form_body">
        <a-form-item name="manageUrl" label="经营许可证" v-show="formKeys?.manageUrl">
          <Upload v-model="form.manageUrl" :maxCount="1" ref="imgUploadRef1" />
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
        <a-form-item name="unitStatus" label="开业状态" v-if="formKeys?.unitStatus && form.businessType === 'HOTEL'">
          <a-radio-group v-model:value="form.unitStatus">
            <a-radio :value="0">开业</a-radio>
            <a-radio :value="1">停业</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="unitStatus" label="开业状态"
          v-if="formKeys?.unitStatus && ['CATERING', 'TICKET'].includes(form.businessType || '')">
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
          <a-radio-group v-model:value="form.derate" @change="derateChange">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="fullRule" label="减免规则"
          v-if="formKeys?.fullRule && formKeys?.reduceRule && reduceRuleVisible">
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
      </div>
      <!-- 资质及账号信息 -->
      <div class="tag" v-show="![undefined, null, '', 'CULTURE_BUREAU'].includes(form.businessType)">
        资质及账号信息（对公账号注册为法人类型，个人账号将被注册为自然人类型）
      </div>
      <div class="form_body">
        <a-form-item name="bankAccountType" label="账号类型" v-show="formKeys?.bankAccountType">
          <a-radio-group v-model:value="form.bankAccountType" @change="accountTypeChange">
            <a-radio :value="1">工行对公账号</a-radio>
            <a-radio :value="2">他行对公账号</a-radio>
            <a-radio :value="3">工行个人账号</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="legalPerson" label="法定姓名" v-show="formKeys?.legalPerson">
          <a-input v-model:value="form.legalPerson" placeholder="请输入法定姓名" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="legalPersonIdNumber" label="法人身份证" v-show="formKeys?.legalPersonIdNumber">
          <a-input v-model:value="form.legalPersonIdNumber" placeholder="请输入法人身份证" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="businessLicenseNo" label="营业执照号码" v-if="formKeys?.businessLicenseNo && !radioVisible">
          <a-input v-model:value="form.businessLicenseNo" placeholder="请输入营业执照号码" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="bankNo" label="开户行行号" v-show="formKeys?.bankNo">
          <a-input v-model:value="form.bankNo" placeholder="请输入开户行行号" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="bank" label="开户行名称" v-show="formKeys?.bank">
          <a-input v-model:value="form.bank" placeholder="请输入开户行名称" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="bankAccount" label="银行卡号" v-show="formKeys?.bankAccount">
          <a-input v-model:value="form.bankAccount" placeholder="请输入结算银行卡号" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="bankAccountName" label="账号名称" v-show="formKeys?.bankAccountName">
          <a-input v-model:value="form.bankAccountName" placeholder="请输入结算银行卡号账号名称" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="companyEnglishName" label="英文名" v-if="formKeys?.companyEnglishName && radioVisible">
          <a-input v-model:value="form.companyEnglishName" placeholder="请输入企业英文名" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="contactEmail" label="联系人邮箱" v-if="formKeys?.contactEmail && radioVisible">
          <a-input v-model:value="form.contactEmail" placeholder="请输入联系人邮箱" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="postalCode" label="邮政编码" v-if="formKeys?.postalCode && radioVisible">
          <a-input v-model:value="form.postalCode" placeholder="请输入注册所在地邮政编码" allowClear>
          </a-input>
        </a-form-item>
      </div>
      <!-- 管理员账号 -->
      <div class="tag">
        管理员账号
      </div>
      <div class="form_body">
        <a-form-item name="accountName" label="超级管理员姓名">
          <a-input v-model:value="form.accountName" placeholder="请输入超级管理员姓名" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="account" label="管理员账号">
          <a-input v-model:value="form.account" placeholder="请输入管理员账号" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="accountPhone" label="管理员手机号">
          <a-input v-model:value="form.accountPhone" placeholder="请输入管理员手机号" allowClear>
          </a-input>
        </a-form-item>
        <a-form-item name="password" label="管理员密码">
          <a-input v-model:value="form.password" placeholder="请输入管理员密码" allowClear>
          </a-input>
        </a-form-item>
      </div>
      <a-form-item>
        <a-button type="primary" @click="submit(dateFormRef)" style="margin-right:20px"
          :loading="loading">提交注册</a-button>
      </a-form-item>
    </a-form>
  </div>
  <CommonModal title="企业添加确认" v-model:visible="saveVisible" @cancel="saveCancel" @close="saveCancel"
    @conform="saveConform" :conform-text="'确认'">
    添加后不可删除，但可以注销、禁用。
    您是否检查无误，确认要添加该企业？
  </CommonModal>
  <CommonModal title="注册成功" v-model:visible="tipVisible" @cancel="tipCancel" @close="tipCancel" @conform="tipConform"
    :conform-text="'去认证'">
    您已注册成功企业“{{ form.name }}” ，继续去认证？
  </CommonModal>
  <!-- <CommonModal title="提示" v-model:visible="tipVisible" @cancel="tipCancel" @close="tipCancel" @conform="tipCancel"
    :conform-text="'我知道了'" :is-cancel="false">
    您已成功添加 {{ form.name }} ，超级管理员账
    号密码已分配成功，请线下告知该企业管理员登录。
  </CommonModal> -->
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import Upload from '@/components/common/imageWrapper.vue';
// import { useBusinessManageOption } from '@/stores/modules/businessManage';
import type { Rule } from 'ant-design-vue/es/form';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import type { Dayjs } from 'dayjs';
import picker from '@/components/common/datePicker.vue'
import tPicker from '@/components/common/timePicker.vue'
import type { FormInstance } from 'element-plus'
import {
  getFormRules,
  disabledBeforeDate,
  disabledAfterDate,
  getKeylist,
  businessTypeOption,
  toIcbc
} from '@/views/baseInfoManage/businessManagement/super/common'
const router = useRouter();
const route = useRoute();
const formRef = ref();
const formKeys = ref();
const dateFormRef = ref<FormInstance>();
const dateFormat = 'YYYY-MM-DD';
const reduceRuleVisible = ref(true);
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
  unitStatus?: number | boolean,
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
  bankAccountType?: number,
  legalPersonIdNumber?: string,
  businessLicenseNo?: string,
  bankNo?: string,
  companyEnglishName?: string,
  contactEmail?: string,
  postalCode?: string,
}
const form = reactive<detailsType>({
  regionCode: [2565, 2619, 2620], // 默认选中云南省丽江市古城区
  provinceId: 2565,
  cityId: 2619,
  areaId: 2620,
  businessType: undefined,
  password: '',
  bankAccountType: 1,
  isIndividual: 1,
  name: undefined,
  businessLicenseUrl: '',
  derate: true
})
const companyId = ref()
const radioVisible = ref(false)
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

const formRules = ref<Record<string, Rule[]>>({})
const imgUploadRef = ref()
const imgUploadRef1 = ref()
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
  if (value === 'HOTEL') {
    getHotelStarList();
    form.unitStatus = 0
  } else if (['CATERING', 'TICKET'].includes(value)) {
    form.unitStatus = true
  }
  formRules.value = getFormRules(value)
  formKeys.value = getKeylist(value, 'edit')
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
      unitStatus,
      startTime,
      endTime,
      shopPhone,
      cateringDesc,
    } = form
    const cateringInfoBO = {
      unitStatus,
      startTime,
      endTime,
      shopPhone,
      cateringDesc,
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
    } = form
    const scenicCompanyBo = {
      unitStatus,
      scenicLevel,
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
    } = form
    const hotelInfoBO = {
      hotelStarId,
      unitStatus,
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
    if (![null, undefined, ''].includes(res)) {
      isRefresh.value = '1'
      saveVisible.value = false
      tipVisible.value = true
      companyId.value = res
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
const accountTypeChange = () => {
  if (form.bankAccountType) {
    if (form.bankAccountType === 3) {
      radioVisible.value = true
    } else if ([1, 2].includes(form.bankAccountType)) {
      radioVisible.value = false
    }
  }
}
const derateChange = () => {
  if (form.derate) {
    reduceRuleVisible.value = true
  } else {
    reduceRuleVisible.value = false
  }
}
const tipConform = () => {
  toIcbc(companyId.value, () => {
    tipVisible.value = false
    back()
  })
}
</script>

<style scoped lang="scss">
.add_box {
  padding: 20px;

  .title {
    color: #dddddd;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    padding-bottom: 12px;
    border-bottom: 1px solid #dddddd;

    .close_btn {
      cursor: pointer;
    }
  }

  .tag {
    color: #dddddd;
    border-bottom: 1px solid #dddddd;
    padding-bottom: 12px;
  }

  .form_body {
    margin-top: 20px;
    width: 60%;
  }
}
</style>