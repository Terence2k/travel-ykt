<template>
  <div class="form_box">
    <div class="text">
      <span style="margin-right: 20px;cursor:pointer" @click="goTo">
        <arrow-left-outlined />
      </span>
      <span>企业注册</span>
    </div>
    <a-form ref="businessLoginRef" :model="form" :rules="formRules" @finish="handleFinish" :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }" autocomplete="off">
      <a-form-item name="unitType" label="企业类型">
        <a-select v-model:value="form.unitType" placeholder="请选择企业类型">
          <a-select-option v-for="item in businessTypeOption" :value="item.oid">{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="name" label="企业名称">
        <a-input v-model:value="form.name" placeholder="请输入企业名称">
        </a-input>
      </a-form-item>
      <a-form-item name="creditCode" label="信用代码">
        <a-input v-model:value="form.creditCode" placeholder="请输入信用代码">
        </a-input>
      </a-form-item>
      <a-form-item name="account" label="账号">
        <a-input v-model:value="form.account" placeholder="请输入账号">
        </a-input>
      </a-form-item>
      <a-form-item name="phone" label="手机号">
        <a-input v-model:value="form.phone" placeholder="请输入手机号">
        </a-input>
      </a-form-item>
      <a-form-item name="contactName" label="管理员">
        <a-input v-model:value="form.contactName" placeholder="请输入管理员姓名">
        </a-input>
      </a-form-item>
      <a-form-item name="region" label="所属地区">
        <address-selector placeholder="请选择所属地区" v-model:value="form.region" @change="regionChange"></address-selector>
      </a-form-item>
      <a-form-item name="businessLicenseUrl" label="营业执照">
        <img-upload ref="imgUploadRef" v-model:uploadedFile="form.businessLicenseUrl" @done="uploadDown"></img-upload>
      </a-form-item>
      <a-button html-type="submit" class="btn" type="primary" :loading="loading">提交</a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftOutlined
} from '@ant-design/icons-vue';
import imgUpload from '@/views/baseInfoManage/businessManagement/components/imgUpload.vue';
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import { Form, message } from 'ant-design-vue';
import api from '@/api';
const formRules: any = {
  unitType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  creditCode: [{ required: true, trigger: 'blur', message: '请输入信用代码' }],
  account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入管理员姓名' }],
  region: [{ required: true, trigger: 'blur', message: '请选择所属地区' }],
  businessLicenseUrl: [{ required: true, trigger: 'blur', message: '请上传营业执照照片' }],
};
const loading = ref(false);
const businessLoginRef = ref();
const imgUploadRef = ref();
const form = reactive({
  unitType: undefined,
  name: '',
  creditCode: '',
  phone: '',
  contactName: '',
  provinceId: '',
  cityId: '',
  areaId: '',
  businessLicenseUrl: undefined,
  account: '',
  region: [],
});

const router = useRouter();
const goTo = () => {
  router.push({
    path: '/login/userLogin'
  })
}

const businessTypeOption = [
  { oid: 116, name: '酒店' },
  { oid: 117, name: '餐饮' },
  { oid: 118, name: '景区' },
  { oid: 119, name: '旅行社' },
  { oid: 158, name: '一卡通' },
  { oid: 159, name: '监理' },
  { oid: 160, name: '协会' },
  { oid: 161, name: '集团' },
  { oid: 162, name: '文旅局' },
];

const restForm = () => {
  businessLoginRef.value.resetFields()
  imgUploadRef.value.clear()
}

const handleFinish = async (values: any) => {
  loading.value = true;
  api.companyRegister(form).then((res: any) => {
    if (res == '提交成功，请耐心等待审核通过!') {
      message.success(res);
      restForm()
    } else {
      message.error(res);
    }
  }).catch((err: string) => {
    console.log(err)
  })
  loading.value = false;
};

const regionChange = () => {
  form.provinceId = form.region ? form.region[0] : ''
  form.cityId = form.region ? form.region[1] : ''
  form.areaId = form.region ? form.region[2] : ''
}

const uploadDown = () => {
  form.businessLicenseUrl = form.businessLicenseUrl ? form.businessLicenseUrl[0] : undefined
}
</script>

<style scoped lang="less">
.form_box {
  margin-top: 24px;
  padding: 28px 37px 32px;
  background-color: #fff;
  border-radius: 4px;

  .btn {
    width: 100%;
    height: 48px;
    border-radius: 6px;
    color: #ffffff;
    font-size: 16px;

    &:hover {
      opacity: 0.85;
      border: none;
    }
  }

  .icon {
    color: #666666;
  }

  .text {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    letter-spacing: 1.1px;
    margin-bottom: 10px;
  }

  .gray_text {
    font-size: 12px;
    color: #666666;
  }

  .copyright {
    margin-top: 20px;
    font-size: 12px;
    color: #999999;
    opacity: 0.85;
  }

  .register {
    text-align: right;
    padding-top: 16px;
    margin-bottom: 12px;

    .register-text {
      color: #5EC28F;
      cursor: pointer;
    }
  }
}
</style>