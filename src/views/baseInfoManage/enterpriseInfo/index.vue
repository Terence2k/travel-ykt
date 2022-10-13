<template>
  <div class="add_box">
    <div class="title">
      <span>
        我的企业基本信息
      </span>
      <!-- <span class="enterprise_state">
        {{ enterpriseState }}
      </span> -->
    </div>
    <div class="form_body">
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
          <!-- <a-cascader
            v-model:value="form.addressIds"
            :load-data="loadData"
            :options="cityOptions"
            @change="(val, option) => handleChange(val, option)" /> -->
          <address-selector placeholder="请选择所属地区" v-model:value="form.addressIds" @change="handleChange">
          </address-selector>
        </a-form-item>
        <a-form-item name="addressDetail" label="企业详情地址">
          <a-input v-model:value="form.addressDetail" placeholder="请输入企业详情地址">
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
          <a-date-picker v-model:value="form.establishTime" placeholder="请选择成立日期" style="width:100%" valueFormat="YYYY-MM-DD"/>
        </a-form-item>
        <a-form-item name="businessTerm" label="营业期限">
          <a-date-picker v-model:value="form.businessTerm" placeholder="请选择营业期限" style="width:100%" valueFormat="YYYY-MM-DD"/>
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
        <a-form-item name="businessLicenseUrl1" label="经营许可证" v-if="form.businessType == 'TRAVEL'">
          <img-upload ref="imgUploadRef" v-model:uploadedFile="form.businessLicenseUrl1" @done="uploadDown">
          </img-upload>
        </a-form-item>
        <!-- <div class="fail" v-if="failVisible">
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
        </div> -->
        <a-form-item>
          <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">提交审核</a-button>
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

const formRef = ref()
const loading = ref(false)
const enterpriseState = ref('信息不完善，待补充。')
const formRules = ref<Record<string, Rule[]>>({})
// formRules.value = formRules6
const businessManageOptions = useBusinessManageOption();
const state = reactive<any>({
  form: {}
})
const cityOptions: Ref<Array<any>> = ref([]);
const { form } = toRefs(state);

const initOpeion = async () => {
  await businessManageOptions.getBusinessTypeOption();
  let { accountBalance, delegateGuide, createTime, group, companyBo } = await api.getTravelInformation();
  state.form = companyBo;
  state.form.accountBalance = accountBalance;
  state.form.delegateGuide = delegateGuide;
  state.form.createTime = createTime;
  state.form.group = group;
  state.form.addressIds = [companyBo.provinceId, companyBo.cityId, companyBo.areaId];
  console.log('state.form.addressIds:', state.form.addressIds)
};
const businessTypeOption = computed(() => businessManageOptions.businessTypeOption);
const uploadDown = () => {
  // form.businessLicenseUrl = form.businessLicenseUrl ? form.businessLicenseUrl[0] : undefined
}

const optionChange = (value: string) => {
  console.log('value:', value);
}

const getCityList = async (data:any, length: number) => {
  const res = await api.commonApi.getCityList(data);
  return res.map((item:any) => {
    return {
      value: item.oid,
      label: item.name,
      isLeaf: length >=3 ? true : false
    }
  })
}

const loadData = (selectedOptions:any) => {
  console.log(selectedOptions)
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  const length = selectedOptions.length + 1
  getCityList(`${targetOption.value}/${length}`, length).then(res => {
    targetOption.children = res
    targetOption.loading = false;
  })
}

const handleChange = (val: any, option: any) => {
			console.log(val, option)
			// state.editableData[key].sourceAddress = val[val.length - 1];
			// state.editableData[key].sourceAddressName = option.map((it:any) => it.label).join('')
		}

const submit = () => {
  const queryData = form.value;
  if (queryData.addressIds?.length) {
    queryData.provinceId = queryData.addressIds[0];
    queryData.cityId = queryData.addressIds[1];
    queryData.areaId = queryData.addressIds[2];
    delete queryData.addressIds;
  }
  console.log('提交表单：', queryData)
  api.submitInformationAudit({companyBo: queryData}).then((res: any) => {
    console.log('res:', res);
    message.success('保存成功');
    initOpeion();
  }).catch((err: any) => {
    console.error(err);
  })
  // formRef.value.validateFields().then(() => { })
}
getCityList('0/1', 0).then(res => {
  cityOptions.value = res;
  console.log('cityOptions:', cityOptions.value);
})
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