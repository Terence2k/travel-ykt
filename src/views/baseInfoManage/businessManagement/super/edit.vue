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

      <a-form ref="formRef" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
        :label-col="labelCol" :wrapper-col="{ span: 24 }">
        <div class="form_body">
          <a-form-item name="businessType" label="企业类型">
            <a-select v-model:value="form.businessType" placeholder="请选择企业类型" disabled>
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
            <a-input v-model:value="form.registeredCapital" placeholder="请输入企业注册资本" suffix="万元">
            </a-input>
          </a-form-item>
        </div>
        <!-- 扩展信息 -->
        <div class="tag" v-show="['TRAVEL', 'HOTEL', 'TICKET', 'CATERING'].includes(queryParams.businessType || '')">
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
          <a-form-item name="unitStatus" label="开业状态"
            v-show="formKeys?.unitStatus && queryParams.businessType === 'HOTEL'">
            <a-radio-group v-model:value="form.unitStatus">
              <a-radio :value="0">开业</a-radio>
              <a-radio :value="1">停业</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="unitStatus" label="开业状态"
            v-show="formKeys?.unitStatus && ['CATERING', 'TICKET'].includes(queryParams.businessType || '')">
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
        <div class="tag" v-show="![undefined, null, '', 'CULTURE_BUREAU'].includes(queryParams.businessType)">
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
        <template v-if="queryParams.businessType === 'TRAVEL'">
          <div class="tag">
            绑定一家【一机管旅行社】（可以自动获取其在一机管的全部签约+委派导游）
          </div>
          <div class="form_body">
            <a-form-item name="yjgTravelId" label="一机管旅行社名称">
              <a-select v-model:value="form.yjgTravelId" placeholder="请输入并查找该旅行社在一机管系统的准确企业名称" showSearch allowClear
                :filter-option="filterOption" @change="yjgSelect">
                <a-select-option v-for="item in YJGList" :value="item.id" :key="item.name">{{
                  item.name
                }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </template>
        <template v-if="queryParams.businessType === 'TICKET'">
          <div class="tag">
            绑定一家【一机管景区】（可以自动获取该景区在一机管的？？？）
          </div>
          <div class="form_body">
            <a-form-item name="yjgScenicId" label="一机管景区名称">
              <a-select v-model:value="form.yjgScenicId" placeholder="请输入并查找该景区在一机管系统的准确企业名称" showSearch allowClear
                :filter-option="filterOption">
                <a-select-option v-for="item in YJGList" :value="item.id" :key="item.id">{{
                  item.name
                }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </template>
        <div class="tag">
          信息变更佐证依据（可上传最多5张图片，或者1个pdf文件，非必填项）
        </div>
        <div class="form_body">
          <a-form-item>
            <Upload v-model="form.imagesUrl" :maxCount="5" dynamicSlotName="itemRender" ref="imgUploadRef3">
              <template #customUpload="{ file, actions }">
                <div class="image_box">
                  <a-image width="104px" :src="file.url" />
                  <a-popconfirm title="是否要删除当前佐证依据文件？" ok-text="确认" cancel-text="取消" @confirm="actions.remove">
                    <a>删除</a>
                  </a-popconfirm>
                </div>
              </template>
            </Upload>
          </a-form-item>
          <a-form-item>
            <pdfUpload v-model="form.pdfFileUrl" :maxCount="1" dynamicSlotName="itemRender" ref="pdfUploadRef">
              <template #customUpload="{ file, actions }">
                <div class="image_box">
                  <a :href="file.url" :title="file.name" target="_blank">{{ cmpFileName(file.name) }}</a>
                  <a-popconfirm title="是否要删除当前佐证依据文件？" ok-text="确认" cancel-text="取消" @confirm="actions.remove">
                    <a>删除</a>
                  </a-popconfirm>
                </div>
              </template>
            </pdfUpload>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">提交修改</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloseOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
import {
  getFormRules,
  disabledBeforeDate,
  disabledAfterDate,
  getKeylist,
  businessTypeOption
} from '@/views/baseInfoManage/businessManagement/super/common';
import { message } from 'ant-design-vue';
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import api from '@/api';
import picker from '@/components/common/datePicker.vue'
import tPicker from '@/components/common/timePicker.vue'
import Upload from '@/components/common/imageWrapper.vue';
import pdfUpload from '@/components/common/pdfWrapper.vue';
const router = useRouter();
const route = useRoute();
const isRefresh = ref('0')
const radioVisible = ref(false)
const reduceRuleVisible = ref(true)
const resetForm = () => {
  formRef.value.resetFields()
  dateFormRef.value?.resetFields()
  form.value = {}
  imgUploadRef.value.clearFileList()
  imgUploadRef1.value.clearFileList()
  imgUploadRef3.value.clearFileList()
  pdfUploadRef.value.clearFileList()
}
const back = () => {
  resetForm()
  router.push({
    name: 'apply',
    params: {
      isRefresh: isRefresh.value
    }
  })
}
const pdfUploadRef = ref()
const imgUploadRef = ref()
const imgUploadRef1 = ref()
const imgUploadRef3 = ref()
type detailsType = {
  oid?: number | string,
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
  licenseNo?: string,
  isIndividual?: number,
  individualDeparturePlace?: string,
  individualReturnPlace?: string,
  legalPersonUrl?: string,
  businessLicenseUrl?: string,
  manageUrl?: string,
  account?: string,
  password?: string,
  checkPass?: string,
  unitStatus?: number | boolean,
  hotelStarId?: string,
  derate?: boolean,
  fullRule?: number,
  reduceRule?: number,
  scenicLevel?: string,
  companyUserEmail?: string,
  contactIdNumber?: string,
  legalPersonPhone?: string,
  bankAddressIds?: (string | number)[],
  bankAccountProvince?: string | number,
  bankAccountCity?: string | number,
  bankReservePhone?: string,
  memberRegistrationPhone?: string,
  shopPhone?: string,
  cateringDesc?: string,
  rangeTime?: string[],
  startTime?: string,
  endTime?: string,
  imagesUrl?: string,
  pdfFileUrl?: string,
  informationChangeUrl?: string,
  yjgTravelId?: number,
  yjgTravelName?: string,
  yjgScenicId?: number,
  yjgScenicName?: string,
  bankAccountType?: number,
  legalPersonIdNumber?: string,
  businessLicenseNo?: string,
  bankNo?: string,
  companyEnglishName?: string,
  contactEmail?: string,
  postalCode?: string,
}
const form = ref<detailsType>({
  regionCode: [],
  businessType: undefined,
  password: '',
  checkPass: '',
  accountType: 1,
  name: undefined,
})
type queryParamsType = {
  oid?: string,
  businessType?: string
}
const props = defineProps<queryParamsType>()
const queryParams = reactive<queryParamsType>({})
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
const labelWidth = '180px'
const labelCol = { style: { width: labelWidth } }
const formRef = ref();
const dateFormRef = ref();
const loading = ref(false);
const dateFormat = 'YYYY-MM-DD';
const formRules = ref<Record<string, Rule[]>>({})
const formKeys = ref();
const hotelStarList = ref();
const scenicLevelList = ref();
const cmpFileName = computed(() => (name: string) => {
  if (typeof name === 'string') {
    const arr = name.split('?')
    const str = arr[0].split('/')
    return str[str.length - 1] || '信息变更佐证依据.pdf'
  } else {
    return '信息变更佐证依据.pdf'
  }
})

// 获取酒店星级下拉数据
const getHotelStarList = async () => {
  hotelStarList.value = await api.getHotelStarList();
}
// 获取景区等级下拉数据
const getScenicLevels = async () => {
  scenicLevelList.value = await api.getScenicLevels();
}
const regionChange = () => {
  form.value.provinceId = form.value.regionCode ? form.value.regionCode[0] : undefined
  form.value.cityId = form.value.regionCode ? form.value.regionCode[1] : undefined
  form.value.areaId = form.value.regionCode ? form.value.regionCode[2] : undefined
}
const regionChange1 = () => {
  form.value.bankAccountProvince = form.value.bankAddressIds ? form.value.bankAddressIds[0] : undefined
  form.value.bankAccountCity = form.value.bankAddressIds ? form.value.bankAddressIds[1] : undefined
}
const timePickerChange = () => {
  if (form.value.rangeTime) {
    form.value.startTime = form.value.rangeTime[0]
    form.value.endTime = form.value.rangeTime[1]
  } else {
    form.value.startTime = ''
    form.value.endTime = ''
  }
}
const getParams = () => {
  form.value.oid = queryParams.oid
  if (form.value.imagesUrl && form.value.pdfFileUrl) {
    form.value.informationChangeUrl = form.value.imagesUrl + ',' + form.value.pdfFileUrl
  } else if (!form.value.imagesUrl && form.value.pdfFileUrl) {
    form.value.informationChangeUrl = form.value.pdfFileUrl
  } else if (form.value.imagesUrl && !form.value.pdfFileUrl) {
    form.value.informationChangeUrl = form.value.imagesUrl
  }
  if (queryParams.businessType === 'TRAVEL') {
    // 旅行社
    const {
      yjgTravelId,
      yjgTravelName,
      licenseNo,
      isIndividual,
      individualDeparturePlace,
      individualReturnPlace
    } = form.value
    const travelAgencyInformationBo = {
      yjgTravelId,
      yjgTravelName,
      licenseNo,
      isIndividual,
      individualDeparturePlace,
      individualReturnPlace
    }
    return {
      ...form.value,
      travelAgencyInformationBo
    }
  } else if (queryParams.businessType === 'CATERING') {
    // 餐厅
    const {
      unitStatus,
      startTime,
      endTime,
      shopPhone,
      cateringDesc,
    } = form.value
    const cateringInfoBO = {
      unitStatus,
      startTime,
      endTime,
      shopPhone,
      cateringDesc,
    }
    return {
      ...form.value,
      cateringInfoBO
    }
  } else if (queryParams.businessType === 'TICKET') {
    // 景区
    const {
      yjgScenicId,
      yjgScenicName,
      unitStatus,
      scenicLevel,
    } = form.value
    const scenicCompanyBo = {
      yjgScenicId,
      yjgScenicName,
      unitStatus,
      scenicLevel,
    }
    return {
      ...form.value,
      scenicCompanyBo
    }
  } else if (queryParams.businessType === 'HOTEL') {
    // 酒店
    const {
      hotelStarId,
      unitStatus,
    } = form.value
    const hotelInfoBO = {
      hotelStarId,
      unitStatus,
    }
    return {
      ...form.value,
      hotelInfoBO
    }
  } else {
    return toRaw(form.value)
  }
}
const submit = () => {
  const a = Promise.all([
    formRef.value?.validateFields(),
    dateFormRef.value?.validate()
  ])
  a.then(async () => {
    const params = getParams()
    let res = await api.editCompany(params)
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
    if (res.bankAccountProvince && res.bankAccountCity) {
      form.value.bankAddressIds = [parseInt(res.bankAccountProvince), parseInt(res.bankAccountCity)]
    } else {
      form.value.bankAddressIds = []
    }
    if (res.startTime && res.endTime) {
      form.value.rangeTime = [res.startTime, res.endTime]
    } else {
      form.value.rangeTime = []
    }
    if (res.informationChangeUrl) {
      const arr = res.informationChangeUrl.split(',')
      let pdfArr: string[] = []
      let imgArr: string[] = []
      arr.forEach((item: any) => {
        if (item.indexOf('.pdf') !== -1) {
          pdfArr.push(item)
        } else {
          imgArr.push(item)
        }
      })
      form.value.imagesUrl = imgArr.toString()
      form.value.pdfFileUrl = pdfArr.toString()
    }
    accountTypeChange()
    derateChange()
  }
}
const YJGList = ref<{ id: number, name: string }[]>([])
const getYJGList = async (type: string) => {
  const res = await api.getYJGList(type)
  YJGList.value = res
}
const initOpeion = () => {
  isRefresh.value = '0'
  if (props.oid) {
    let key: keyof queryParamsType;
    for (key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        queryParams[key] = JSON.parse(decodeURIComponent(props[key] as string))
      }
    }
    formRules.value = queryParams.businessType && getFormRules(queryParams.businessType)
    formKeys.value = queryParams.businessType && getKeylist(queryParams.businessType, 'edit')
    queryParams.businessType && getFormRules(queryParams.businessType)
    getData()
    queryParams.businessType === 'HOTEL' && getHotelStarList();
    queryParams.businessType === 'TICKET' && getScenicLevels();
    queryParams.businessType === 'TICKET' && getYJGList('TICKET');
    queryParams.businessType === 'TRAVEL' && getYJGList('TRAVEL');
  }
}
const filterOption = (input: string, option: any) => {
  return option.children()[0].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const yjgSelect = (value: any, option: any) => {
  queryParams.businessType === 'TRAVEL' && (form.value.yjgTravelName = option?.key)
  queryParams.businessType === 'TICKET' && (form.value.yjgScenicName = option?.key)
};
const accountTypeChange = () => {
  if (form.value.bankAccountType) {
    if (form.value.bankAccountType === 3) {
      radioVisible.value = true
    } else if ([1, 2].includes(form.value.bankAccountType)) {
      radioVisible.value = false
    }
  }
}
const derateChange = () => {
  if (form.value.derate) {
    reduceRuleVisible.value = true
  } else {
    reduceRuleVisible.value = false
  }
}
onActivated(() => {
  initOpeion()
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
      color: #dddddd;
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

      /* .tag {
        padding: 24px 0;
      } */
    }
  }
}

.image_box {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>