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
            企业名称
          </div>
          <div>
            {{ form.name }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            企业类型
          </div>
          <div>
            {{ form.businessTypeName }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            所属地区
          </div>
          <div>
            {{ form.regionName }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            信用代码
          </div>
          <div>
            {{ form.creditCode }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            营业执照
          </div>
          <div class="img_box">
            <a-image width="100%" :src="form.businessLicenseUrl" />
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            姓名
          </div>
          <div>
            {{ form.contactName }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            手机号
          </div>
          <div>
            {{ form.phone }}
          </div>
        </div>
        <div class="row_info">
          <div class="info_key">
            账号
          </div>
          <div>
            {{ form.account }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
const router = useRouter();
const route = useRoute();
const back = () => {
  router.push({
    path: '/baseInfo/businessManagement/apply'
  })
}
const form = reactive({
  name: undefined,
  businessTypeName: undefined,
  regionName: undefined,
  creditCode: undefined,
  businessLicenseUrl: undefined,
  contactName: undefined,
  phone: undefined,
  account: undefined
})
watch(
  () => route.query,
  (val: any) => {
    const {
      name,
      businessTypeName,
      regionName,
      creditCode,
      businessLicenseUrl,
      contactName,
      phone,
      account,
    } = val
    form.name = name
    form.businessTypeName = businessTypeName
    form.regionName = regionName
    form.creditCode = creditCode
    form.businessLicenseUrl = businessLicenseUrl
    form.contactName = contactName
    form.phone = phone
    form.account = account
  },
  {
    immediate: true
  }
)
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