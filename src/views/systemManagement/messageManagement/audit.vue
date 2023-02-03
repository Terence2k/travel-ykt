<template>
  <div class="content">
    <div class="details_item">
      <div class="key">公告名称</div>
      <div class="value">{{ form.auditStatusName }}</div>
    </div>
    <div class="details_item">
      <div class="key">公告类型</div>
      <div class="value">{{ form.typeName }}</div>
    </div>
    <div class="details_item">
      <div class="key">展示渠道</div>
      <div class="value">{{ form.channelName }}</div>
    </div>
    <div class="details_item">
      <div class="key">可见企业</div>
      <div class="value">
        <ul class="company_list" v-if="form.companyIds">
          <li v-for="item in form.companyIds">{{ item }}</li>
        </ul>
        <span v-else>/</span>
      </div>
    </div>
    <div class="details_item">
      <div class="key">附件</div>
      <div class="value">
        <template v-if="form.enclosureList">
          <a :href="form.enclosureList" target="_blank"
            v-if="form.enclosureList.indexOf('.png') === -1 && form.enclosureList.indexOf('.jpg') === -1">{{
              getFileName(form.enclosureList)
            }}</a>
          <div style="width:104px;margin: 0 8px 8px 0;" v-else>
            <a-image :src="form.enclosureList" />
          </div>
        </template>
        <template v-else>
          /
        </template>
      </div>
    </div>
    <div class="details_item">
      <div class="key">说明</div>
      <div class="value">
        <p class="notice_content">{{ form.noticeContent || '/' }}</p>
      </div>
    </div>
    <div class="details_item">
      <div class="key">发布人</div>
      <div class="value">{{ form.creatorName }}</div>
    </div>
    <div class="details_item">
      <div class="key">发布企业</div>
      <div class="value">{{ form.creatorCompanyName }}</div>
    </div>
    <div class="details_item">
      <div class="key">创建日期</div>
      <div class="value">{{ form.createTime }}</div>
    </div>
    <a-button type="primary" @click="audit(2)" style="margin-right: 20px">审核通过</a-button>
    <a-button type="primary" @click="audit(3)" style="margin-right: 20px">审核不通过</a-button>
    <a-button type="primary" @click="back">退出</a-button>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import api from '@/api';
import { awsGetPreSignedUrl } from '@/utils/awsUpload';
import { message } from 'ant-design-vue/es';
const router = useRouter();
const route = useRoute();
const back = () => {
  router.push({
    name: 'messageManagement'
  })
}
interface formType {
  oid?: any;
  noticeName?: string;
  noticeType?: string;
  isExhibitionPc?: boolean;
  isExhibitionApp?: boolean;
  isExhibitionHome?: boolean;
  companyIds?: string[];
  enclosure?: string;
  noticeContent?: string;
  displayChannel?: number[];
  companyBos?: any[];
  auditStatusName?: string;
  typeName?: string;
  channelName?: string;
  enclosureList?: string;
  creatorName?: string;
  creatorCompanyName?: string;
  createTime?: string;
}
const form = ref<formType>({
  oid: undefined
})
const getFileName = computed(() => (name: string) => {
  if (name) {
    const arr = name.split('?')
    const str = arr[0]
    const arr1 = str.split('/')
    return arr1[arr1.length - 1]
  } else {
    return '文件'
  }
})
const audit = (auditResult: number) => {
  api.auditNotice({ oid: form.value.oid, auditResult }).then((res: any) => {
    if (res) {
      message.success('审核成功！')
      back()
    } else {
      message.error('审核失败！')
    }
  })
}
const getDetails = () => {
  api.findNoticeDetails(form.value.oid).then(async (res: any) => {
    form.value = res
    const arr = []
    if (form.value.isExhibitionPc) {
      arr.push('PC消启中心')
    }
    if (form.value.isExhibitionApp) {
      arr.push('App消息中心')
    }
    if (form.value.isExhibitionHome) {
      arr.push('首页')
    }
    form.value.channelName = arr.toString()
    if (form.value.enclosure) {
      form.value.enclosureList = await awsGetPreSignedUrl(form.value.enclosure) as string
    } else {
      form.value.enclosureList = undefined
    }
    if (form.value?.companyBos && form.value?.companyBos?.length > 0) {
      form.value.companyIds = form.value?.companyBos.map((item: any) => {
        return item.companyName
      })
    }
  })
}
watch(
  () => route.query,
  (newVal) => {
    if (newVal.oid) {
      form.value.oid = newVal.oid
      getDetails()
    }
  },
  { immediate: true }
)
</script>
<style lang="less" scoped>
.content {
  padding: 0 20px;

  .details_item {
    display: flex;
    margin: 20px 0;

    .key {
      width: 100px;
      text-align: left;
    }

    .value {
      color: #5e5e5e;

      .company_list {
        margin: 0;
        padding: 10px;
        list-style: none;
        max-height: 300px;
        overflow: auto;
        border: 1px solid #f0f2f5;

        li {
          margin-bottom: 5px;
        }
      }

      .notice_content {
        width: 400px;
        text-align: justify;
      }
    }
  }
}
</style>
