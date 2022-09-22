<template>
  <div class="form_box">
    <div class="text">
      <span style="margin-right: 20px;cursor:pointer" @click="goTo">
        <arrow-left-outlined />
      </span>
      <span>企业注册</span>
    </div>
    <a-form :model="form" :rules="formRules" @finish="handleFinish" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
      autocomplete="off">
      <a-form-item name="unitType" label="企业类型">
        <a-select ref="select" v-model:value="form.unitType" placeholder="请选择企业类型">
          <a-select-option v-for="item in businessTypeOption" :key="item.name" :value="item.oid">{{ item.name }}
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
        <a-select placeholder="请选择所属地区" v-model:value="form.region">
          <a-select-option value="sd">
            sd
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="businessLicenseUrl" label="营业执照">
        <img-upload v-model:uploadedFile="form.businessLicenseUrl"></img-upload>
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
import api from '@/api';
import { useScenicSpotOption } from '@/stores/modules/scenicSpot';
import { any } from '_vue-types@3.0.2@vue-types';
const scenicSpotOptions = useScenicSpotOption();
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
const form = reactive({
  unitType: '',
  name: '',
  creditCode: '',
  phone: '',
  contactName: '',
  provinceId: '',
  cityId: '',
  areaId: '',
  businessLicenseUrl: undefined,
  account: '',
  region: '',
});
const router = useRouter();
const goTo = () => {
  router.push({
    path: '/login/userLogin'
  })
}

//初始化下拉列表
const initOpeion = async () => {
  // await scenicSpotOptions.getBusinessTypeOption();
  await scenicSpotOptions.getAllAreaProvice(0);
};
// 下拉选择
const popupScroll = () => {
  console.log('popupScroll');
};

//下拉列表
// const businessTypeOption = computed(() => scenicSpotOptions.businessTypeOption);
const proviceList = computed(() => scenicSpotOptions.proviceList);
// const cityList = computed(() => scenicSpotOptions.cityList);
// const areaList = computed(() => scenicSpotOptions.areaList);

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

const handleFinish = async (values: any) => {
  // console.log(checked, values);
  console.log(values);
  loading.value = true;

  api.companyRegister(form).then((res: any) => {
    console.log(res)
  }).catch((err: string) => {
    console.log(err)
  })
  loading.value = false;
  // if (res) {
  //   message.success("成功");
  //   // router.replace({ path: state.redirect || '/', query: state.otherQuery });
  //   router.replace("/");
  // }
};

onMounted(() => {
  initOpeion()
})
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

  /*   ::v-deep(.ant-tabs-tab) {
    padding: 10px 2px;
  }

  ::v-deep(.ant-tabs-nav) {
    &::before {
      border-bottom: none;
    }
  }

  ::v-deep(.ant-input-affix-wrapper-focused) {
    box-shadow: none !important;
  } */

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

  /*   .reset-input {
    height: 48px;
    line-height: 48px;
    border: none;
    border-bottom: 1px solid #E7E7E7;
    padding: 0;

    .reset-prefix {
      width: 81px;
      font-size: 16px;
      color: #000;
      padding-right: 12px;
    }
  } */

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