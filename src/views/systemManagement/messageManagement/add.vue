<template>
  <div class="content">
    <a-form ref="addRef" :model="form" :rules="rules" name="addStore" autocomplete="off" :label-col="labelCol"
      labelAlign="left" class="add_form">
      <a-form-item name="noticeName" label="公告名称">
        <a-input v-model:value="form.noticeName" placeholder="请输入公告名称" show-count :maxlength="50">
        </a-input>
      </a-form-item>
      <a-form-item name="noticeType" label="公告类型">
        <a-select placeholder="请选择公告类型" v-model:value="form.noticeType" allowClear>
          <a-select-option v-for="item in typeOptions" :value="item.codeValue">{{
            item.name
          }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="displayChannel" label="展示渠道">
        <a-checkbox-group v-model:value="form.displayChannel" name="displayChannel" :options="options"
          @change="channelChange" />
      </a-form-item>
      <a-form-item name="companyIds" label="可见企业" v-if="companyVisible">
        <a-tree v-model:checkedKeys="form.companyIds" checkable :tree-data="businessOptions" :field-names="fieldNames"
          @check="companyChecked">
        </a-tree>
      </a-form-item>
      <a-form-item name="enclosure" label="附件">
        <fileUpload v-model="form.enclosure" :maxCount="1" ref="enclosureRef" />
        <span class="text">支持上传pdf、doox、图片</span>
      </a-form-item>
      <a-form-item name="noticeContent" label="说明">
        <a-textarea v-model:value="form.noticeContent" placeholder="请输入公告内容" show-count :maxlength="5000"
          :auto-size="{ minRows: 3, maxRows: 10 }" />
      </a-form-item>
      <div class="text">说明/附件需至少填写一个</div>
      <a-button type="primary" @click="submitToAudit" style="margin-right: 20px">提交审核</a-button>
      <a-button type="primary" @click="back">取消</a-button>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import fileUpload from '@/components/common/fileWrapper.vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';
import { message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
const navigatorBar = useNavigatorBar();
const router = useRouter();
const route = useRoute();
const back = () => {
  navigatorBar.clearNavigator();
  addRef.value?.resetFields()
  router.push({
    name: 'messageManagement'
  })
}
const labelWidth = '100px'
const labelCol = { style: { width: labelWidth } }
const addRef = ref()
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
}
const form = ref<formType>({
  oid: undefined,
  noticeName: undefined,
  noticeType: undefined,
  isExhibitionPc: undefined,
  isExhibitionApp: undefined,
  isExhibitionHome: undefined,
  companyIds: [],
  enclosure: undefined,
  noticeContent: undefined,
  displayChannel: [],
  companyBos: []
})
const isAdd = ref(true)
const rules = {
  noticeName: [{ required: true, trigger: 'blur', message: '请输入公告名称' }],
  noticeType: [{ required: true, trigger: 'blur', message: '请选择公告类型' }],
  displayChannel: [{ required: true, trigger: 'change', message: '请选择展示渠道' }],
  companyIds: [{ required: true, trigger: 'blur', message: '请选择可见企业', type: 'array', }],
}
const typeOptions = ref<{
  codeValue: string,
  name: string
}[]>([])
const businessOptions = ref([])
const enclosureRef = ref()
const options = [
  { label: 'PC消启中心', value: 1 },
  { label: 'App消息中心', value: 2 },
  { label: '首页', value: 3 },
];
const companyVisible = ref(true)
const fieldNames = {
  children: 'child',
  title: 'name',
};
const channelChange = (val: any) => {
  if (val.includes(3)) {
    companyVisible.value = false
  } else {
    companyVisible.value = true
  }
}
const getParams = () => {
  let {
    oid,
    noticeName,
    noticeType,
    enclosure,
    noticeContent,
    displayChannel,
    companyIds,
  } = form.value
  let isExhibitionPc = false, isExhibitionApp = false, isExhibitionHome = false
  displayChannel?.forEach((item: number) => {
    if (item === 1) {
      isExhibitionPc = true
    } else if (item === 2) {
      isExhibitionApp = true
    } else if (item === 3) {
      isExhibitionHome = true
    }
  })
  const visibleCompany1: number[] = []
  if (!form.value.displayChannel?.includes(3)) {
    companyIds?.forEach((item: any) => {
      if (item.indexOf('3-') !== -1) {
        const arr = item.split('-')
        visibleCompany1.push(Number(arr[1]))
      }
    })
  }
  return {
    oid,
    noticeName,
    noticeType,
    enclosure,
    noticeContent,
    isExhibitionPc,
    isExhibitionApp,
    isExhibitionHome,
    companyIds: visibleCompany1,
  }
}
const submitToAudit = () => {
  addRef.value.validateFields().then(async () => {
    if (form.value.enclosure || form.value.noticeContent) {
      if (isAdd.value) {
        api.addNotice(getParams()).then((res: any) => {
          if (res) {
            message.success('提交审核成功！')
            back()
          } else {
            message.error('提交审核失败！')
          }
        })
      } else {
        api.editNotice(getParams()).then((res: any) => {
          if (res) {
            message.success('提交审核成功！')
            back()
          } else {
            message.error('提交审核失败！')
          }
        })
      }
    } else {
      message.error('说明/附件需至少填写一个')
    }
  }).catch((error: Error) => {
    console.log(error);
  })

}
const setData = (res: any) => {
  return res.map((item: any) => {
    if (item.childList?.length > 0) {
      return {
        name: item.name,
        key: item.level + '-' + item.oid,
        child: setData(item.childList)
      }
    } else {
      return {
        name: item.name,
        key: item.level + '-' + item.oid,
      }
    }
  })
}
const getBusinessList = () => {
  api.getNoticeCompany().then((res: any) => {
    businessOptions.value = setData(res)
  })
}
const getType = () => {
  api.dropDownQueryListChildByCodeValue('ANNOUNCEMENT_TYPE').then((res: any) => {
    typeOptions.value = res
  })
}
const getEditDetails = () => {
  api.findNoticeDetails(form.value.oid).then((res: any) => {
    form.value = res
    form.value.displayChannel = []
    if (form.value.isExhibitionPc) {
      form.value.displayChannel.push(1)
    }
    if (form.value.isExhibitionApp) {
      form.value.displayChannel.push(2)
    }
    if (form.value.isExhibitionHome) {
      form.value.displayChannel.push(3)
    }
    form.value.companyIds = form.value.companyBos?.map((item: any) => {
      return '3-' + item.oid
    })
  })
}
const companyChecked = () => {
  if (form.value.companyIds && form.value.companyIds.length > 0) {
    addRef.value.clearValidate('companyIds')
  } else {
    addRef.value.validateFields('companyIds')
  }
}
watch(
  () => route.query,
  (newVal) => {
    if (newVal.operation === 'add') {
      isAdd.value = true
      navigatorBar.setNavigator(['系统管理', '消息管理', '新增']);
    } else if (newVal.operation === 'update') {
      isAdd.value = false
      form.value.oid = newVal.oid
      getEditDetails()
      getBusinessList()
      getType()
      navigatorBar.setNavigator(['系统管理', '消息管理', '编辑']);
    }
  },
  { immediate: true }
)
onMounted(() => {
  getBusinessList()
  getType()
})
</script>
<style lang="less" scoped>
.content {
  padding: 20px;

  .add_form {
    width: 30%;
  }

  .text {
    color: #dddddd;
    margin-bottom: 20px;
  }
}
</style>
