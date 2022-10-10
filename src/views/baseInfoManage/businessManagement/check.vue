<template>
  <div class="content_box">
    <div class="check_box">
      <div class="title">
        <span>
          企业信息
        </span>
        <span class="close_btn" @click="back">
          <close-outlined />
        </span>
      </div>
      <div class="check_info">
        <div class="row_info">
          <div class="info_key">
            <span style="color:#ff4d4f">*</span>
            企业名称
          </div>
          <div>
            {{ form.name }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            <span style="color:#ff4d4f">*</span>
            企业类型
          </div>
          <div>
            {{ form.businessTypeName }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            <span style="color:#ff4d4f">*</span>
            所属地区
          </div>
          <div>
            {{ form.regionName }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            <span style="color:#ff4d4f">*</span>
            信用代码
          </div>
          <div>
            {{ form.creditCode }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            <span style="color:#ff4d4f">*</span>
            营业执照
          </div>
          <div class="img_box">
            <a-image width="100%" :src="form.businessLicenseUrl" />
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            <span style="color:#ff4d4f">*</span>
            姓名
          </div>
          <div>
            {{ form.contactName }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            <span style="color:#ff4d4f">*</span>
            手机号
          </div>
          <div>
            {{ form.phone }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            <span style="color:#ff4d4f">*</span>
            账号
          </div>
          <div>
            {{ form.account }}
          </div>
        </div>
      </div>
      <div class="title">
        审核意见
      </div>
      <div class="check_opetion">
        <a-form ref="checkFormRef" :model="checkForm" :rules="formRules" name="basic" autocomplete="off"
          labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
          <a-form-item label="审核意见" name="auditResult" :colon="false">
            <a-radio-group name="auditResult" v-model:value="checkForm.auditResult">
              <a-radio :value="2">通过</a-radio>
              <a-radio :value="3">不通过</a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- <a-form-item label="用户角色" name="roldId" :colon="false">
            <a-select name="roldId" v-model:value="checkForm.roldId" placeholder="请选择所属角色" style="width:390px">
              <a-select-option v-for="item in rolesList" :value="item.oid">{{item.roleName}}</a-select-option>
            </a-select>
          </a-form-item> -->
        </a-form>
      </div>
    </div>
    <div class="btn_box">
      <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">提交</a-button>
    </div>
  </div>
  <CommonModal title="新增字典详情" v-model:visible="modalVisible" @close="modalVisible = false"
    @conform="modalVisible=false">
    企业注册使用的账号：as_123已成功开通系统账号。
  </CommonModal>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue'
import { CloseOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import { message } from 'ant-design-vue';
const checkFormRef = ref();
const router = useRouter();
const route = useRoute()
// const rolesList = ref([])
const back = () => {
  router.push({
    name: 'apply'
  })
  checkFormRef.value.resetFields()
}
const state = reactive({
  modalVisible: false
})
const { modalVisible } = toRefs(state)

type propsType = {
  name?: string,
  businessType?: string | number,
  businessTypeName?: string,
  regionName?: string,
  creditCode?: string,
  businessLicenseUrl?: string,
  contactName?: string,
  phone?: string,
  account?: string,
  oid?: string | number
}
const form = reactive<propsType>({})
type checkFormType = {
  oid?: number | string,
  account?: number | string,
  roldId?: number | string,
  auditResult: 2 | 3
}
const checkForm = reactive<checkFormType>({
  auditResult: 2
})
watch(() => route.params, (val: propsType) => {
  let key: keyof propsType;
  for (key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) {
      form[key] = JSON.parse(decodeURIComponent(val[key] as string))
    }
  }
  checkForm.oid = form.oid
  checkForm.account = form.account
}, {
  immediate: true
})

/* const getListByBusinessType = async () => {
  let data = await api.listByBusinessType({ status: 1, pageNo: 1, pageSize: 10000, availableRange: form.businessType })
  rolesList.value = data.content
} */

const formRules: any = {
  auditResult: [{ required: true, trigger: 'blur', message: '请选择是否通过' }],
  roldId: [{ required: true, trigger: 'blur', message: '请选择所属角色' }],
};
const loading = ref(false)
const submit = () => {
  checkFormRef.value.validateFields().then(async () => {
    loading.value = true
    let res = await api.auditCompany(toRaw(checkForm))
    loading.value = false
    if (res) {
      message.success('审核成功！')
      router.push({
        name: 'apply',
        params: {
          isRefresh: 1
        }
      })
    } else {
      message.error('审核失败！')
    }
  }).catch((err: any) => {
    console.log(err);
  })
}
onActivated(() => {
  // getListByBusinessType()
})
</script>

<style scoped lang="scss">
.content_box {
  position: relative;
  width: 100%;
  height: 100%;

  .check_box {
    width: 100%;
    padding: 24px 20px 0;

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

    .check_info {
      margin-top: 20px;

      .row_info {
        display: flex;
        margin-bottom: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei UI;
        font-weight: 400;
        color: #1E2226;

        .info_key {
          width: 174px;
        }

        .img_box {
          width: 120px;
          height: 120px;
          background: rgba(246, 246, 246, 0.39);
          border: 1px solid #E8E8E8;
          border-radius: 2px;
        }
      }
    }

    .check_opetion {
      margin-top: 16px;
    }
  }

  .btn_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 64px;
    line-height: 64px;
    padding: 0 20px;
    border-top: 1px solid #F1F2F5;
  }
}
</style>