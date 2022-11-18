<template>
  <div class="add_box">
    <div class="title">
      <span>
        我的企业基本信息
      </span>
      <span
        class="enterprise_state"
        v-if="['TRAVEL', 'HOTEL', 'TICKET'].includes(userInfo.sysCompany.businessType)">
        {{ enterpriseState }}
      </span>
    </div>
    <div class="form_body">
      <a-form ref="formRef" :scrollToFirstError="true" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
        :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" hideRequiredMark @finish="submit">
        <a-form-item name="businessType" label="企业类型">
          <a-select v-model:value="form.businessType" placeholder="请选择企业类型" disabled>
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :key="item.codeValue">{{
            item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="name" label="企业名称">
          <div class="flex">
            <a-input v-model:value="form.name" placeholder="请输入企业名称" :disabled="getStatus('name')" />
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('name')" v-if="showChangeBtns('name')">
                {{ getStatus('name') ? '修改' : '确定' }}
              </a-button>
          </div>
        </a-form-item>
        <a-form-item name="addressIds" label="企业所属地区">
          <div class="flex">
            <address-selector placeholder="请选择所属地区" v-model:value="form.addressIds" :disabled="getStatus('addressIds')" />
            <a-button type="primary" class="status-btn" @click="changeDisabledStatus('addressIds')" v-if="showChangeBtns('addressIds')">
              {{ getStatus('addressIds') ? '修改' : '确定' }}
            </a-button>
          </div>
        </a-form-item>
        <a-form-item name="addressDetail" label="企业详情地址">
          <div class="flex">
            <a-input v-model:value="form.addressDetail" placeholder="请输入企业详情地址" :disabled="getStatus('addressDetail')"/>
            <a-button type="primary" class="status-btn" @click="changeDisabledStatus('addressDetail')" v-if="showChangeBtns('addressDetail')">
              {{ getStatus('addressDetail') ? '修改' : '确定' }}
            </a-button>
          </div>
        </a-form-item>
        <a-form-item name="legalPersonUrl" label="法人身份证附件">
          <div class="flex">
            <Upload v-model="form.legalPersonUrl" :disabled="getStatus('legalPersonUrl')" :maxCount="1" @remove="getImage"/>
            <a-button type="primary" class="status-btn" @click="changeDisabledStatus('legalPersonUrl')" v-if="showChangeBtns('legalPersonUrl')">
              {{ getStatus('legalPersonUrl') ? '修改' : '确定' }}
            </a-button>
          </div>
        </a-form-item>
        <!-- 旅行社、旅游集团、酒店、景区、餐饮 -->
        <template v-if="['TRAVEL', 'GROUP', 'HOTEL', 'TICKET', 'CATERING'].includes(userInfo.sysCompany.businessType)">
          <a-form-item name="legalPerson" label="法定代表人">
            <div class="flex">
              <a-input v-model:value="form.legalPerson" placeholder="请输入法定代表人" :disabled="getStatus('legalPerson')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('legalPerson')" v-if="showChangeBtns('legalPerson')">
                {{ getStatus('legalPerson') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="managementRange" label="经营范围">
            <div class="flex">
              <a-textarea v-model:value="form.managementRange" placeholder="请输入经营范围" :rows="2" :disabled="getStatus('managementRange')" />
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('managementRange')" v-if="showChangeBtns('managementRange')">
                {{ getStatus('managementRange') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="registeredCapital" label="注册资本">
            <div class="flex">
              <a-input v-model:value="form.registeredCapital" placeholder="请输入注册资本" suffix="万元"  :disabled="getStatus('registeredCapital')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('registeredCapital')" v-if="showChangeBtns('registeredCapital')">
                {{ getStatus('registeredCapital') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="establishTime" label="成立日期">
            <div class="flex">
              <a-date-picker v-model:value="form.establishTime" placeholder="请选择成立日期" style="width:100%" valueFormat="YYYY-MM-DD" :disabled="getStatus('establishTime')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('establishTime')" v-if="showChangeBtns('establishTime')">
                {{ getStatus('establishTime') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="businessTerm" label="营业期限">
            <div class="flex">
              <a-date-picker v-model:value="form.businessTerm" placeholder="请选择营业期限" style="width:100%" valueFormat="YYYY-MM-DD" :disabled="getStatus('businessTerm')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('businessTerm')" v-if="showChangeBtns('businessTerm')">
                {{ getStatus('businessTerm') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="contactName" label="联系人">
            <div class="flex">
              <a-input v-model:value="form.contactName" placeholder="请输入联系人" :disabled="getStatus('contactName')" />
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('contactName')" v-if="showChangeBtns('contactName')">
                {{ getStatus('contactName') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="phone" label="联系电话">
            <div class="flex">
              <a-input v-model:value="form.phone" placeholder="请输入联系电话" :disabled="getStatus('phone')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('phone')" v-if="showChangeBtns('phone')">
                {{ getStatus('phone') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="creditCode" label="统一社会信用代码">
            <div class="flex">
              <a-input v-model:value="form.creditCode" placeholder="请输入统一社会信用代码" :disabled="getStatus('creditCode')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('creditCode')" v-if="showChangeBtns('creditCode')">
                {{ getStatus('creditCode') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="businessLicenseUrl" label="营业执照">
            <div class="flex">
              <Upload v-model="form.businessLicenseUrl" :disabled="getStatus('businessLicenseUrl')" :maxCount="1"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('businessLicenseUrl')" v-if="showChangeBtns('businessLicenseUrl')">
                {{ getStatus('businessLicenseUrl') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
        </template>
        <!-- 旅行社、酒店、景区、监理、古维 -->
        <template v-if="['TRAVEL', 'HOTEL', 'TICKET', 'SUPERVISE', 'ANCIENT_UYGUR'].includes(userInfo.sysCompany.businessType)">
          <a-form-item name="accountType" label="公司账户类型">
            <div class="flex">
              <a-radio-group v-model:value="form.accountType" :disabled="getStatus('accountType')">
                <a-radio :value="1">对公账户</a-radio>
                <a-radio :value="2">对私账户</a-radio>
              </a-radio-group>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('accountType')" v-if="showChangeBtns('accountType')">
                {{ getStatus('accountType') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="bankAccountName" label="公司账户名称">
            <div class="flex">
              <a-input v-model:value="form.bankAccountName" placeholder="请输入公司账户名称" :disabled="getStatus('bankAccountName')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('bankAccountName')" v-if="showChangeBtns('bankAccountName')">
                {{ getStatus('bankAccountName') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="bank" label="开户行">
            <div class="flex">
              <a-input v-model:value="form.bank" placeholder="请输入开户行" :disabled="getStatus('bank')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('bank')" v-if="showChangeBtns('bank')">
                {{ getStatus('bank') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="bankAccount" label="公司账号">
            <div class="flex">
              <a-input v-model:value="form.bankAccount" placeholder="请输入公司账号" :disabled="getStatus('bankAccount')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('bankAccount')" v-if="showChangeBtns('bankAccount')">
                {{ getStatus('bankAccount') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
        </template>
        <!-- 旅行社特殊字段 -->
        <template v-if="userInfo.sysCompany.businessType == 'TRAVEL'">
          <a-form-item name="businessLicenseUrl1" label="经营许可证">
            <div class="flex">
              <Upload v-model="form.businessLicenseUrl1" :disabled="getStatus('businessLicenseUrl1')" :maxCount="1"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('businessLicenseUrl1')" v-if="showChangeBtns('businessLicenseUrl1')">
                {{ getStatus('businessLicenseUrl1') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="licenseNo" label="12301旅行社许可证号">
            <div class="flex">
              <a-input v-model:value="form.licenseNo" placeholder="请输入法定代表人" :disabled="getStatus('licenseNo')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('licenseNo')" v-if="showChangeBtns('licenseNo')">
                {{ getStatus('licenseNo') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="isIndividual" label="是否为散客中心">
            <div class="flex">
              <a-radio-group v-model:value="form.isIndividual" :disabled="getStatus('isIndividual')">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('isIndividual')" v-if="showChangeBtns('isIndividual')">
                {{ getStatus('isIndividual') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
        </template>
        <!-- 酒店特殊字段 -->
        <template v-if="userInfo.sysCompany.businessType == 'HOTEL'">
          <a-form-item name="unitStatus" label="开业状态">
            <div class="flex">
              <a-radio-group v-model:value="form.unitStatus" :disabled="getStatus('unitStatus')">
                <a-radio :value="0">开业</a-radio>
                <a-radio :value="1">停业</a-radio>
              </a-radio-group>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('unitStatus')" v-if="showChangeBtns('unitStatus')">
                {{ getStatus('unitStatus') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="hotelStarId" label="星级">
            <div class="flex">
              <a-select v-model:value="form.hotelStarId" placeholder="请选择酒店星级" :disabled="getStatus('hotelStarId')">
                <a-select-option v-for="item in hotelStarList" :value="item.oid" :key="item.oid">
                {{ item.starCode }}
                </a-select-option>
              </a-select>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('hotelStarId')" v-if="showChangeBtns('hotelStarId')">
                {{ getStatus('hotelStarId') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="derate" label="是否支持减免">
            <div class="flex">
              <a-radio-group v-model:value="form.derate" :disabled="getStatus('derate')">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('derate')" v-if="showChangeBtns('derate')">
                {{ getStatus('derate') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
        </template>
        <!-- 景区特殊字段 -->
        <template v-if="userInfo.sysCompany.businessType == 'TICKET'">
          <a-form-item name="unitStatus" label="开业状态">
            <div class="flex">
              <a-radio-group v-model:value="form.unitStatus" :disabled="getStatus('unitStatus')">
                <a-radio :value="true">开业</a-radio>
                <a-radio :value="false">停业</a-radio>
              </a-radio-group>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('unitStatus')" v-if="showChangeBtns('unitStatus')">
                {{ getStatus('unitStatus') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="scenicLevel" label="等级">
            <div class="flex">
              <a-select v-model:value="form.scenicLevel" placeholder="请选择景区等级" :disabled="getStatus('scenicLevel')">
                <a-select-option v-for="item in scenicLevelList" :value="item.levelId">
                {{ item.levelName }}
                </a-select-option>
              </a-select>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('scenicLevel')" v-if="showChangeBtns('scenicLevel')">
                {{ getStatus('scenicLevel') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="derate" label="是否支持减免">
            <div class="flex">
              <a-radio-group v-model:value="form.derate" :disabled="getStatus('derate')">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('derate')" v-if="showChangeBtns('derate')">
                {{ getStatus('derate') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
        </template>
        <!-- 餐饮特殊字段 -->
        <template v-if="userInfo.sysCompany.businessType == 'CATERING'">
          <a-form-item name="unitStatus" label="开业状态">
            <div class="flex">
              <a-radio-group v-model:value="form.unitStatus" :disabled="getStatus('unitStatus')">
                <a-radio :value="1">开业</a-radio>
                <a-radio :value="0">停业</a-radio>
              </a-radio-group>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('unitStatus')" v-if="showChangeBtns('unitStatus')">
                {{ getStatus('unitStatus') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="rangeTime" label="营业时间">
            <div class="flex">
              <a-range-picker v-model:value="form.rangeTime" @change="changeTime" :disabled="getStatus('rangeTime')" value-format="YYYY-MM-DD"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('rangeTime')" v-if="showChangeBtns('rangeTime')">
                {{ getStatus('rangeTime') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="shopPhone" label="店铺联系电话">
            <div class="flex">
              <a-input v-model:value="form.shopPhone" placeholder="请输入店铺联系电话" :disabled="getStatus('shopPhone')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('shopPhone')" v-if="showChangeBtns('shopPhone')">
                {{ getStatus('shopPhone') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item name="cateringDesc" label="其他">
            <div class="flex">
              <a-input v-model:value="form.cateringDesc" placeholder="其他描述" :disabled="getStatus('cateringDesc')"/>
              <a-button type="primary" class="status-btn" @click="changeDisabledStatus('cateringDesc')" v-if="showChangeBtns('cateringDesc')">
                {{ getStatus('cateringDesc') ? '修改' : '确定' }}
              </a-button>
            </div>
          </a-form-item>
        </template>
        <!-- 景区、酒店减免规则字段 -->
        <template v-if="['HOTEL', 'TICKET'].includes(userInfo.sysCompany.businessType)">
          <a-form-item name="fullRule" label="减免规则">
            <div style="display: flex;align-items: start;">
              <div style="display: flex;align-items: center;">
                <span style="margin: 0 5px;">满</span>
                <a-input 
                  placeholder="请配置数字" 
                  style="width: 150px;"
                  v-model:value="form.fullRule"
                  oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')" :disabled="getStatus('fullRule')"/>
                  <a-button type="primary" class="status-btn" @click="changeDisabledStatus('fullRule')" v-if="showChangeBtns('fullRule')">
                    {{ getStatus('fullRule') ? '修改' : '确定' }}
                  </a-button>
              </div>
              <a-form-item name="reduceRule">
                <div style="display: flex;align-items: center;">
                  <span style="margin: 0 5px;">减</span>
                  <a-input 
                    placeholder="请配置数字" 
                    style="width: 150px;"
                    v-model:value="form.reduceRule"
                    oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')" :disabled="getStatus('reduceRule')"/>
                    <a-button type="primary" class="status-btn" @click="changeDisabledStatus('reduceRule')" v-if="showChangeBtns('reduceRule')">
                      {{ getStatus('reduceRule') ? '修改' : '确定' }}
                    </a-button>
                </div>
              </a-form-item>
            </div>
          </a-form-item>
        </template>
        <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              style="margin-right:20px"
              :loading="loading"
              v-if="form.informationAuditStatus != 1">
              <!-- 除酒店、景点、旅行社外不提交审核 -->
              <template v-if="['TRAVEL', 'HOTEL', 'TICKET', 'CATERING'].includes(userInfo.sysCompany.businessType)">
                提交审核
              </template>
              <template v-else>
                保存
              </template>
            </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import api from '@/api';
import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { getUserInfo } from '@/utils/util';
import Upload from '@/components/common/imageWrapper.vue';

const formRef = ref()
const loading = ref(false)
const enterpriseState = ref()
const businessManageOptions = useBusinessManageOption();
const state = reactive<any>({
  form: {}
})
const { form } = toRefs(state);
const travelStore = useTravelStore();
const formRules: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'change', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  addressIds: [{ required: true, trigger: 'change', message: '请选择所属地区' }],
  addressDetail: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  legalPerson: [{ required: true, trigger: 'blur', message: '请输入法定代表人' }],
  managementRange: [{ required: true, trigger: 'blur', message: '请输入经营范围' }],
  registeredCapital: [{ required: true, trigger: 'blur', message: '请输入注册资本' }],
  establishTime: [{ required: true, trigger: 'change', message: '请选择成立日期' }],
  businessTerm: [{ required: true, trigger: 'change', message: '请选择营业期限' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入联系人' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
  creditCode: [{ required: true, trigger: 'blur', message: '请输入统一社会信用代码' }],
  // businessLicenseUrl: [{ required: true, trigger: 'change', message: '请上传营业执照' }],
  accountType: [{ required: true, trigger: 'change', message: '请选择公司账户类型' }],
  bankAccountName: [{ required: true, trigger: 'blur', message: '请输入公司账户名称' }],
  bank: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
  bankAccount: [{ required: true, trigger: 'blur', message: '请输入公司账号' }],
  // businessLicenseUrl1: [{ required: true, trigger: 'change', message: '请上传经营许可' }],
  // licenseNo: [{ required: true, trigger: 'blur', message: '请输入12301旅行社许可证号' }],
  // isIndividual: [{ required: true, trigger: 'change', message: '请选择是否为散客中心' }],
  unitStatus: [{ required: true, trigger: 'change', message: '请选择开业状态' }],
  hotelStarId: [{ required: true, trigger: 'change', message: '请选择酒店星级' }],
  scenicLevel: [{ required: true, trigger: 'change', message: '请选择景区等级' }],
  derate: [{ required: true, trigger: 'change', message: '请选择是否支持减免' }],
  rangeTime: [{ required: true, trigger: 'change', message: '请选择营业时间' }],
  shopPhone: [{ required: true, trigger: 'blur', message: '请输入店铺联系电话' }],
  cateringDesc: [{ required: true, trigger: 'blur', message: '请输入其他描述' }],
  fullRule: [{ required: true, trigger: 'blur', message: '请输入减免规则' }],
  reduceRule: [{ required: true, trigger: 'blur', message: '请输入减免规则' }],
}
const userInfo = getUserInfo();
const submitFunc = ref();
const validateArray: Ref<Array<any>> = ref([]);
const businessTypeOption = computed(() => businessManageOptions.businessTypeOption);
const hotelStarList = ref();
const scenicLevelList = ref();

// 获取酒店星级下拉数据
const getHotelStarList = async () => {
  hotelStarList.value = await api.getHotelStarList();
}
// 获取景区等级下拉数据
const getScenicLevels = async () => {
  scenicLevelList.value = await api.getScenicLevels();
}

const getImage = (options: any) => {
  console.log('getImage:', options);
  
}

const initOpeion = async () => {
  await businessManageOptions.getBusinessTypeOption();
  // infoFunc:获取企业基本信息函数名
  let infoFunc = null;
  console.log('userInfo.sysCompany.businessType:', userInfo.sysCompany.businessType);
  switch (userInfo.sysCompany.businessType) {
    case 'TRAVEL':
      infoFunc = api.getTravelInformation();
    break;
    case 'HOTEL':
      infoFunc = api.getInfoByCompanyId(userInfo.sysCompany.oid);
    break;
    case 'TICKET':
      infoFunc = api.getScenicById(userInfo.sysCompany.oid);
    break;
    case 'CATERING':
      infoFunc = api.getCateringInfo(userInfo.sysCompany.oid);
    break;
    // 其他业态
    default:
      infoFunc = api.getCompanyInformation(userInfo.sysCompany.oid);
    break;
  }
  let data = await infoFunc;
  state.form = { ...data, ...data.companyBo};
  if (state.form?.areaId) state.form.addressIds = [state.form.provinceId, state.form.cityId, state.form.areaId];
  state.form.rangeTime = [state.form.startTime, state.form.endTime];
  console.log('state.form:', state.form);
  
  // submitFunc:提交编辑审核函数名
  if (Object.keys(travelStore.businessTypeOptions).includes(userInfo.sysCompany.businessType)) {
    submitFunc.value = travelStore.businessTypeOptions[userInfo.sysCompany.businessType].submitFunc;
  } else {
    submitFunc.value = 'editCompany';
  }
  // 右上角文字描述判断
  enterpriseState.value = travelStore.enterpriseState[state.form.informationAuditStatus]?.descriptions;

  // 判断字段是否为空，如为空则显示待补充信息
  // formRef.value.validate().then((res: any) => {
  //   enterpriseState.value = travelStore.enterpriseState[state.form.informationAuditStatus]?.descriptions;
	// }).catch((err: any) => {
  //   console.log(err)
  //   // enterpriseState.value = '信息不完善，待补充。';
  //   formRef.value.clearValidate();
  // });

  validateArray.value = Object.keys(form.value).map((item: any) => {
    return {
      name: item,
      disabled: item.value ? false : true
    }
  });
};

// 更改字段修改确定状态
const changeDisabledStatus = (name: string) => {
  validateArray.value.forEach((item: any) => {
    if (item.name === name) {
      item.disabled = !item.disabled;
    }
  })
}

// 获取字段是否禁用状态
const getStatus = (name: string) => {
  return validateArray.value?.find((it: any) => it.name === name)?.disabled && ![0].includes(form.value.informationAuditStatus);
}

// 是否隐藏修改确定按钮
const showChangeBtns = (name: string) => {
  return validateArray.value.map((it:any) => it.name).some((it: any) => it === name) && ![0, 1].includes(form.value.informationAuditStatus);
}

// 餐饮营业时间
const changeTime = (date: string, dateString: string) => {
  form.value.startTime = dateString[0];
  form.value.endTime = dateString[1];
}

const submit = () => {
  let queryData = form.value;
  if (userInfo.sysCompany.businessType == 'HOTEL') {
    queryData.hotelName = queryData.name;
  }
  if (queryData.addressIds?.length) {
    queryData.provinceId = queryData.addressIds[0];
    queryData.cityId = queryData.addressIds[1];
    queryData.areaId = queryData.addressIds[2];
    delete queryData.addressIds;
  }
  console.log('提交表单：', queryData)
  console.log('submitFunc', submitFunc.value)
  api[submitFunc.value](queryData).then((res: any) => {
    console.log('res:', res);
    message.success('保存成功');
    initOpeion();
  }).catch((err: any) => {
    console.error(err);
  })
}

onMounted(() => {
  initOpeion();
  getHotelStarList();
  getScenicLevels();
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
  .flex {
    display: flex;
  }

  .status-btn {
    margin-left: 5px;
    display: block;
  }
}
</style>