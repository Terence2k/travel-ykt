<template>
  <div class="add_box">
    <div class="title">
      <span>
        我的企业基本信息
      </span>
      <span
        class="enterprise_state">
        {{ enterpriseState }}
      </span>
    </div>
    <div class="form_body">
      <a-form ref="formRef" :scrollToFirstError="true" :model="form" :rules="formRules" name="add-business" autocomplete="off" labelAlign="left"
        :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" @finish="submit">
        <a-form-item name="businessType" label="企业类型">
          <a-select v-model:value="form.businessType" placeholder="请选择企业类型">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :key="item.codeValue">{{
            item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="name" label="企业名称">
          <div class="flex">
            <a-input v-model:value="form.name" placeholder="请输入企业名称"/>
          </div>
        </a-form-item>
        <a-form-item name="addressIds" label="所属地区">
          <div class="flex">
            <address-selector placeholder="请选择所属地区" v-model:value="form.addressIds"/>
          </div>
        </a-form-item>
        <a-form-item name="addressDetail" label="详细地址">
          <div class="flex">
            <a-input v-model:value="form.addressDetail" placeholder="请输入企业详细地址"/>
          </div>
        </a-form-item>

        <template v-if="!['CULTURE_BUREAU'].includes(userInfo.sysCompany.businessType)">
          <a-form-item name="establishTime" label="成立日期">
            <div class="flex">
              <picker v-model="form.establishTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择成立日期" style="width:100%"/>
            </div>
          </a-form-item>
          <a-form-item name="businessTerm" label="营业期限">
            <div class="flex">
              <picker v-model="form.businessTerm" type="date" value-format="YYYY-MM-DD" placeholder="请选择营业期限" style="width:100%"/>
            </div>
          </a-form-item>
        </template>
        
        <a-form-item name="contactName" label="联系人">
          <div class="flex">
            <a-input v-model:value="form.contactName" placeholder="请输入联系人"/>
          </div>
        </a-form-item>
        <a-form-item name="phone" label="联系电话">
          <div class="flex">
            <a-input v-model:value="form.phone" placeholder="请输入联系电话"/>
          </div>
        </a-form-item>

        
        <template v-if="!['CULTURE_BUREAU'].includes(userInfo.sysCompany.businessType)">
          <a-form-item name="creditCode" label="统一社会信用代码">
            <div class="flex">
              <a-input v-model:value="form.creditCode" placeholder="请输入统一社会信用代码"/>
            </div>
          </a-form-item>
          <a-form-item name="businessLicenseUrl" label="营业执照">
            <div class="flex">
              <Upload v-model="form.businessLicenseUrl" :maxCount="1"/>
            </div>
          </a-form-item>
        </template>
        <!-- 旅行社特殊字段 -->
        <template v-if="userInfo.sysCompany.businessType == 'TRAVEL'">
          <a-form-item name="businessLicenseUrl1" label="经营许可证">
            <div class="flex">
              <Upload v-model="form.businessLicenseUrl1" :maxCount="1"/>
            </div>
          </a-form-item>
          <a-form-item name="licenseNo" label="12301旅行社许可证号">
            <div class="flex">
              <a-input v-model:value="form.licenseNo" placeholder="请输入法定代表人"/>
            </div>
          </a-form-item>
          <a-form-item name="isIndividual" label="是否为散客中心">
            <div class="flex">
              <a-radio-group v-model:value="form.isIndividual">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </div>
          </a-form-item>
          <a-form-item name="individualDeparturePlace" label="散客常用出发地">
            <div class="flex">
              <a-input v-model:value="form.individualDeparturePlace" placeholder="请输入散客常用出发地"/>
            </div>
          </a-form-item>
          <a-form-item name="individualReturnPlace" label="散客常用返回地">
            <div class="flex">
              <a-input v-model:value="form.individualReturnPlace" placeholder="请输入散客常用返回地"/>
            </div>
          </a-form-item>
        </template>
        <!-- 酒店特殊字段 -->
        <template v-if="userInfo.sysCompany.businessType == 'HOTEL'">
          <a-form-item name="unitStatus" label="开业状态">
            <div class="flex">
              <a-radio-group v-model:value="form.unitStatus">
                <a-radio :value="0">开业</a-radio>
                <a-radio :value="1">停业</a-radio>
              </a-radio-group>
            </div>
          </a-form-item>
          <a-form-item name="hotelStarId" label="星级">
            <div class="flex">
              <a-select v-model:value="form.hotelStarId" placeholder="请选择酒店星级">
                <a-select-option v-for="item in hotelStarList" :value="item.oid" :key="item.oid">
                {{ item.starCode }}
                </a-select-option>
              </a-select>
            </div>
          </a-form-item>
          <a-form-item name="derate" label="是否支持减免">
            <div class="flex">
              <a-radio-group v-model:value="form.derate">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </div>
          </a-form-item>
        </template>
        <!-- 景区特殊字段 -->
        <template v-if="userInfo.sysCompany.businessType == 'TICKET'">
          <a-form-item name="unitStatus" label="开业状态">
            <div class="flex">
              <a-radio-group v-model:value="form.unitStatus">
                <a-radio :value="true">开业</a-radio>
                <a-radio :value="false">停业</a-radio>
              </a-radio-group>
            </div>
          </a-form-item>
          <a-form-item name="scenicLevel" label="等级">
            <div class="flex">
              <a-select v-model:value="form.scenicLevel" placeholder="请选择景区等级">
                <a-select-option v-for="item in scenicLevelList" :value="item.levelId">
                {{ item.levelName }}
                </a-select-option>
              </a-select>
            </div>
          </a-form-item>
          <a-form-item name="derate" label="是否支持减免">
            <div class="flex">
              <a-radio-group v-model:value="form.derate">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </div>
          </a-form-item>
        </template>
        <!-- 餐饮特殊字段 -->
        <template v-if="userInfo.sysCompany.businessType == 'CATERING'">
          <a-form-item name="unitStatus" label="开业状态">
            <div class="flex">
              <a-radio-group v-model:value="form.unitStatus">
                <a-radio :value="1">开业</a-radio>
                <a-radio :value="0">停业</a-radio>
              </a-radio-group>
            </div>
          </a-form-item>
          <a-form-item name="rangeTime" label="营业时间">
            <div class="flex" style="width:300px">
              <picker v-model="form.rangeTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeTime" value-format="YYYY-MM-DD"/>
            </div>
          </a-form-item>
          <a-form-item name="shopPhone" label="店铺联系电话">
            <div class="flex">
              <a-input v-model:value="form.shopPhone" placeholder="请输入店铺联系电话"/>
            </div>
          </a-form-item>
          <a-form-item name="cateringDesc" label="其他">
            <div class="flex">
              <a-input v-model:value="form.cateringDesc" placeholder="其他描述"/>
            </div>
          </a-form-item>
        </template>
        <!-- 景区、酒店减免规则字段 -->
        <template v-if="['HOTEL', 'TICKET'].includes(userInfo.sysCompany.businessType)">
          <a-form-item label="减免规则">
            <div style="display: flex;align-items: start;">
              <a-form-item name="fullRule">
                <div style="display: flex;align-items: center;">
                  <span style="margin: 0 5px;">满</span>
                  <a-input 
                    placeholder="请配置数字" 
                    style="width: 150px;"
                    v-model:value="form.fullRule"
                    oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')"/>
                </div>
              </a-form-item>
              <a-form-item name="reduceRule">
                <div style="display: flex;align-items: center;">
                  <span style="margin: 0 5px;">减</span>
                  <a-input 
                    placeholder="请配置数字" 
                    style="width: 150px;"
                    v-model:value="form.reduceRule"
                    oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')"/>
                </div>
              </a-form-item>
            </div>
          </a-form-item>
        </template>
        <!-- 资质及账号信息（对公账号注册为法人类型，个人账号将被注册为自然人类型） -->
        <div style="margin: 70px 0" v-if="!['CULTURE_BUREAU'].includes(userInfo.sysCompany.businessType)">
          <!-- <span style="color: red;">资质及账号信息（对公账号注册为法人类型，个人账号将被注册为自然人类型）</span> -->
          <a-form-item name="bankAccountType" label="账号类型">
            <div class="flex">
              <a-radio-group v-model:value="form.bankAccountType">
                <a-radio :value="1">工行对公账号</a-radio>
                <a-radio :value="2">他行对公账号</a-radio>
                <a-radio :value="3">工行个人账号</a-radio>
              </a-radio-group>
            </div>
          </a-form-item>
          <a-form-item name="legalPerson" label="法人姓名">
            <div class="flex">
              <a-input v-model:value="form.legalPerson" placeholder="请输入法人姓名"/>
            </div>
          </a-form-item>
          <a-form-item name="legalPersonIdNumber" label="法人身份证">
            <div class="flex">
              <a-input v-model:value="form.legalPersonIdNumber" placeholder="请输入法人身份证号码"/>
            </div>
          </a-form-item>
          <a-form-item name="businessLicenseNo" label="营业执照号码" v-if="[1, 2].includes(form.bankAccountType)">
            <div class="flex">
              <a-input v-model:value="form.businessLicenseNo" placeholder="请输入营业执照号码"/>
            </div>
          </a-form-item>
          <a-form-item name="bankNo" label="开户行行号">
            <div class="flex">
              <a-input v-model:value="form.bankNo" placeholder="请输入开户行行号"/>
            </div>
          </a-form-item>
          <a-form-item name="bank" label="开户行名称">
            <div class="flex">
              <a-input v-model:value="form.bank" placeholder="请输入开户行名称"/>
            </div>
          </a-form-item>
          <a-form-item name="bankAccount" label="银行卡号">
            <div class="flex">
              <a-input v-model:value="form.bankAccount" placeholder="请输入结算银行卡号"/>
            </div>
          </a-form-item>
          <a-form-item name="bankAccountName" label="账号名称">
            <div class="flex">
              <a-input v-model:value="form.bankAccountName" placeholder="请输入结算银行卡号账号名称"/>
            </div>
          </a-form-item>
          <template v-if="form.bankAccountType === 3">
            <a-form-item name="companyEnglishName" label="英文名">
              <div class="flex">
                <a-input v-model:value="form.companyEnglishName" placeholder="请输入企业英文名"/>
              </div>
            </a-form-item>
            <a-form-item name="contactEmail" label="联系人邮箱">
              <div class="flex">
                <a-input v-model:value="form.contactEmail" placeholder="请输入联系人邮箱"/>
              </div>
            </a-form-item>
            <a-form-item name="postalCode" label="邮政编码">
              <div class="flex">
                <a-input v-model:value="form.postalCode" placeholder="请输入注册所在地邮政编码"/>
              </div>
            </a-form-item>
            <a-form-item name="registeredCapital" label="注册资本">
              <div class="flex">
                <a-input v-model:value="form.registeredCapital" placeholder="请输入注册资本" suffix="万元"/>
              </div>
            </a-form-item>
          </template>
        </div>
        <!-- 驳回原因 -->
        <template v-if="form.informationAuditStatus === 3">
          <p style="color: red;">{{ enterpriseState }}</p>
          <div class="flex" style="color: red;">
            <span style="margin: 0 30px 24px 0;">驳回原因:</span>
            {{ form.rejectReason }}
          </div>
          <div class="flex" style="color: red;">
            <span style="margin: 0 30px 24px 0;">驳回时间:</span>
            {{ form.lastUpdateTime }}
          </div>
        </template>
        <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              style="margin-right:20px"
              :loading="loading"
              v-if="form.informationAuditStatus != 1"
              v-permission="['TRAVEL', 'HOTEL', 'TICKET', 'CATERING'].includes(userInfo.sysCompany.businessType) ? '提交审核' : '保存'">
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
	<BaseModal title="企业信息提交审核" v-model="confirmDialog">
    是否要将本次修改完善的企业信息提交给行政机关单位管理员审核？
		<template v-slot:footer>
			<a-button @click="confirmDialog = false">取消</a-button>
			<a-button type="primary" @click="uploadData">确定</a-button>
		</template>
  </BaseModal>
	<BaseModal title="企业信息提交审核" v-model="successDialog">
    已提交审核，审核通过后您将收到短信通知。
		<template v-slot:footer>
			<a-button type="primary" @click="successDialog = false">确定</a-button>
		</template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import api from '@/api';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import type { Rule } from 'ant-design-vue/es/form';
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { getUserInfo } from '@/utils/util';
import Upload from '@/components/common/imageWrapper.vue';
import picker from '@/components/common/datePicker.vue';
import BaseModal from '@/components/common/BaseModal.vue';

const formRef = ref()
const loading = ref(false)
const enterpriseState = ref()
const businessManageOptions = useBusinessManageOption();
const state = reactive<any>({
  form: {}
})
const { form } = toRefs(state);
const travelStore = useTravelStore();
const confirmDialog = ref(false);
const successDialog = ref(false);

const validateFullRule = async (_rule: Rule, value: string) => {
  if (!value && form.value.derate) {
    return Promise.reject('请输入减免规则');
  } else {
    return Promise.resolve();
  }
};
const validateReduceRule = async (_rule: Rule, value: string) => {
  if (!value && form.value.derate) {
    return Promise.reject('请输入减免规则');
  } else {
    return Promise.resolve();
  }
};
const formRules: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'change', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  addressIds: [{ required: true, trigger: 'change', message: '请选择所属地区' }],
  bankAddressIds: [{ required: true, trigger: 'change', message: '请选择开户行所在地' }],
  addressDetail: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  bankAccountType: [{ required: true, trigger: 'change', message: '请选择账号类型' }],
  legalPerson: [{ required: true, trigger: 'blur', message: '请输入法定代表人' }],
  legalPersonIdNumber: [{ required: true, trigger: 'blur', message: '请输入法人身份证号码' }],
  businessLicenseNo: [{ required: true, trigger: 'blur', message: '请输入营业执照号码' }],
  bankNo: [{ required: true, trigger: 'blur', message: '请输入开户行行号' }],
  bank: [{ required: true, trigger: 'blur', message: '请输入开户行名称' }],
  registeredCapital: [{ required: true, trigger: 'blur', message: '请输入注册资本' }],
  creditCode: [{ required: true, trigger: 'blur', message: '请输入统一社会信用代码' }],
  businessLicenseUrl: [{ required: true, trigger: 'change', message: '请上传营业执照' }],
  bankAccountName: [{ required: true, trigger: 'blur', message: '请输入结算银行卡号账号名称' }],
  companyEnglishName: [{ required: true, trigger: 'blur', message: '请输入企业英文名' }],
  contactEmail: [{ required: true, trigger: 'blur', message: '请输入联系人邮箱' }],
  postalCode: [{ required: true, trigger: 'blur', message: '请输入注册所在地邮政编码' }],
  bankAccount: [{ required: true, trigger: 'blur', message: '请输入结算银行卡号' }],
  unitStatus: [{ required: true, trigger: 'change', message: '请选择开业状态' }],
  hotelStarId: [{ required: true, trigger: 'change', message: '请选择酒店星级' }],
  scenicLevel: [{ required: true, trigger: 'change', message: '请选择景区等级' }],
  derate: [{ required: true, trigger: 'change', message: '请选择是否支持减免' }],
  rangeTime: [{ required: true, trigger: 'change', message: '请选择营业时间' }],
  shopPhone: [{ required: true, trigger: 'blur', message: '请输入店铺联系电话' }],
  cateringDesc: [{ required: true, trigger: 'blur', message: '请输入其他描述' }],
  fullRule: [{ required: true, trigger: 'blur', validator: validateFullRule }],
  reduceRule: [{ required: true, trigger: 'blur', validator: validateReduceRule }],
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
  if (state.form?.bankAccountProvince && state.form?.bankAccountCity) state.form.bankAddressIds = [Number(state.form.bankAccountProvince), Number(state.form.bankAccountCity)];
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


  validateArray.value = Object.keys(form.value).map((item: any) => {
    return {
      name: item,
      disabled: form.value[item] ? true : false,
      value: form.value[item]
    }
  });
};

// 0未提交 1待审核 2审核通过 3审核未通过
// 是否隐藏修改确定按钮
// const showChangeBtns = (name: string) => {
//   let resValue = validateArray.value.find((it: any) => it.name === name)?.value;
//   if (!resValue && [0].includes(form.value.informationAuditStatus)) enterpriseState.value = '信息不完善，待补充。';
//   // 如果有值 && 需要判断的字段是否有包括 && 当前审核状态不为未提交和待审核
//   return resValue && validateArray.value.map((it:any) => it.name).find((it: any) => it === name) && ![0, 1].includes(form.value.informationAuditStatus);
// }

// 餐饮营业时间
const changeTime = (date: string, dateString: string) => {
  form.value.startTime = dateString[0];
  form.value.endTime = dateString[1];
}

const uploadData = () => {
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
  if (queryData.bankAddressIds?.length) {
    queryData.bankAccountProvince = queryData.bankAddressIds[0];
    queryData.bankAccountCity = queryData.bankAddressIds[1];
    delete queryData.bankAddressIds;
  }
  console.log('提交表单：', queryData)
  console.log('submitFunc', submitFunc.value)
  api[submitFunc.value](queryData).then((res: any) => {
    console.log('res:', res);
    successDialog.value = true;
    initOpeion();
  }).catch((err: any) => {
    console.error(err);
  })
  confirmDialog.value = false;
}

const submit = () => {
  if (['TRAVEL', 'HOTEL', 'TICKET', 'CATERING'].includes(userInfo.sysCompany.businessType)) {
    confirmDialog.value = true;
  } else {
    uploadData();
  }
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