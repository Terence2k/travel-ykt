<template>
  <div class="tabs_box">
    <a-badge :count="auditTableData.total" class="rebadge" />
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="已审核">
        <CommonTable :dataSource="tableData.data" :columns="columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'businessLicenseUrl'">
              <a-image width="100%" :src="record.businessLicenseUrl" />
            </template>
            <template v-if="column.key === 'action'">
              <a @click="goTo(record, 'details')">查看</a>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025">{{ tableData.total }}</span> 个企业</div>
          <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
            :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="待审核">
        <CommonTable :dataSource="auditTableData.data" :columns="auditColumns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'businessLicenseUrl'">
              <a-image width="100%" :src="record.businessLicenseUrl" />
            </template>
            <template v-if="column.key === 'action'">
              <a @click="auditEnterprise(record)">去审核</a>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025">{{ auditTableData.total }}</span> 个待审核企业信息</div>
          <CommonPagination v-model:current="auditTableData.param.pageNo"
            v-model:page-size="auditTableData.param.pageSize" :total="auditTableData.total"
            @change="auditOnHandleCurrentChange" @showSizeChange="auditPageSideChange" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="审核驳回">
        <CommonTable :dataSource="failTableData.data" :columns="failColumns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'businessLicenseUrl'">
              <a-image width="100%" :src="record.businessLicenseUrl" />
            </template>
            <template v-if="column.key === 'action'">
              <a @click="goTo(record, 'details')">查看</a>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025">{{ failTableData.total }}</span> 个被驳回的企业信息审核记录</div>
          <CommonPagination v-model:current="failTableData.param.pageNo"
            v-model:page-size="failTableData.param.pageSize" :total="failTableData.total"
            @change="failOnHandleCurrentChange" @showSizeChange="failPageSideChange" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
  <CommonModal :title="modalTitle" v-model:visible="auditVisible" @close="auditClose" @conform="auditConform"
    :conform-text="conformText" :cancel-text="cancelText" width="50%">
    <div class="table_box">
      <table class="info_table" cellpadding="16px" border="1">
        <tr class="row">
          <td class="key">入会申请时间</td>
          <td class="value">{{ details.submitTime }}</td>
        </tr>
        <tr class="row">
          <td class="key">企业类型</td>
          <td class="value">{{ details.businessTypeName }}</td>
        </tr>
        <tr class="row">
          <td class="key">企业名称</td>
          <td class="value">{{ details.name }}</td>
        </tr>
        <tr class="row">
          <td class="key">统一社会信用代码</td>
          <td class="value">{{ details.creditCode }}</td>
        </tr>
        <tr class="row">
          <td class="key">管理员姓名</td>
          <td class="value">{{ details.contactName }}</td>
        </tr>
        <tr class="row">
          <td class="key">管理员手机号</td>
          <td class="value">{{ details.phone }}</td>
        </tr>
        <tr class="row">
          <td class="key">所属地区</td>
          <td class="value">{{ details.regionName }}</td>
        </tr>
        <tr class="row">
          <td class="key">营业执照</td>
          <td class="value">
            <a-image width="200px" :src="details.businessLicenseUrl" />
          </td>
        </tr>
        <tr class="row">
          <td class="key">{{ keyName }}</td>
          <td class="value">{{ details.applicationRemarks }}</td>
        </tr>
      </table>
      <div class="tip" v-if="isRegiste">该企业已正式入驻一卡通平台，当前无挂靠集团。如您同意其入会，则与贵集团缔结挂靠关系。</div>
      <div class="tip" v-else>该企业申请退会。如您同意其退会，则与贵集团取消挂靠关系。</div>
    </div>
  </CommonModal>
  <CommonModal :title="registerAuditTitle" v-model:visible="registerAuditVisible" @close="registerAuditClose"
    @conform="registerAuditConform" :conform-text="'确定'">
    <span v-if="isRegiste">
      您即将批准 {{ details.name }} 的入会挂靠申请，是否确认？
    </span>
    <span v-else>
      您即将批准 {{ details.name }} 的退会申请，是否确认？
    </span>
  </CommonModal>
  <CommonModal :title="failTitle" v-model:visible="failVisible" @close="failClose" @cancel="failClose"
    @conform="failConform" :conform-text="'确定'">
    <a-form ref="failFormRef" :model="failForm" :rules="failFormRules" name="fail-form" autocomplete="off"
      labelAlign="left" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item name="auditRemark" label="驳回原因">
        <a-textarea v-model:value="failForm.rejectReason" placeholder="请输入驳回原因" :rows="2">
        </a-textarea>
      </a-form-item>
    </a-form>
  </CommonModal>
  <CommonModal title="审核企业变更信息" v-model:visible="changeAuditVisible" @close="auditClose" @cancel="changeAuditCancel"
    @conform="auditConform" :conform-text="'同意变更'" :cancel-text="'驳回变更'" width="50%">
    <div class="table_box">
      <table class="change_table" cellpadding="16px" border="1">
        <tr class="row">
          <th class="key_hd">变更项目</th>
          <th class="key_hd">变更前内容</th>
          <th class="key_hd">变更后内容</th>
        </tr>
        <tr class="row" v-for="(item, index) in changeKeys" :key="index">
          <td class="key">{{ keyNameList[item] }}</td>

          <td class="value" v-if="['manageUrl', 'businessLicenseUrl'].includes(item) && oldArrList[item]">
            <a-image width="200px" :src="oldArrList[item]" />
          </td>
          <td class="value" v-else-if="item === 'regionCode'">
            <address-selector v-if="oldArrList[item][0]" key="oldadd" style="width:100%"
              v-model:value="oldArrList[item]" disabled>
            </address-selector>
          </td>
          <td class="value" v-else>{{ getComputedVal(item, oldArrList[item]) }}</td>

          <td class="value" v-if="['manageUrl', 'businessLicenseUrl'].includes(item) && newArrList[item]">
            <a-image width="200px" :src="newArrList[item]" />
          </td>
          <td class="value" v-else-if="item === 'regionCode'">
            <address-selector v-if="newArrList[item][0]" key="newadd" style="width:100%"
              v-model:value="newArrList[item]" disabled>
            </address-selector>
          </td>
          <td class="value" v-else>{{ getComputedVal(item, newArrList[item]) }}</td>
        </tr>
      </table>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import type { Rule } from 'ant-design-vue/es/form';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const goTo = (value: any, name: string) => {
  let newObj: any = {
    oid: encodeURIComponent(JSON.stringify(value.travelId)),
    businessType: encodeURIComponent(JSON.stringify(value.businessType))
  }
  router.push({
    name: name,
    params: newObj
  })
}
const props = defineProps<{
  groupId?: number
}>()
const activeKey = ref('1')
const auditVisible = ref(false)
const registerAuditVisible = ref(false)
const failVisible = ref(false)
const changeAuditVisible = ref(false)
const isRegiste = ref(true)
const failFormRules: Record<string, Rule[]> = {
  rejectReason: [{ required: true, trigger: 'blur', message: '请输入驳回原因' }],
}
const registerAuditTitle = computed(() => {
  return isRegiste.value ? '旅行社入会确认' : '旅行社退会确认'
})
const failTitle = computed(() => {
  return isRegiste.value ? '驳回旅行社入会' : '驳回旅行社退会'
})


const keyName = computed(() => {
  return isRegiste.value ? '入会申请理由' : '退会申请理由'
})
const modalTitle = computed(() => {
  return isRegiste.value ? '旅行社入会申请' : '旅行社退会申请'
})
const conformText = computed(() => {
  return isRegiste.value ? '同意入会' : '同意退会'
})
const cancelText = computed(() => {
  return isRegiste.value ? '驳回入会' : '驳回退会'
})
const getComputedVal = computed(() => (key: string, val: any) => {
  if (key === 'accountType') {
    return val == 1 ? '对公账户' : '对私账户'
  } else if (key === 'unitStatus') {
    return val == 1 ? '停业' : '开业'
  } else if (key === 'isReduced') {
    return val == 1 ? '是' : '否'
  } else {
    return val
  }
})
const failForm = reactive({
  oid: '',
  // 入会通过 2  入会拒绝3  退会通过6  退回拒绝5
  state: 2,
  rejectReason: ''
})
const failFormRef = ref()
type detailsType = {
  submitTime?: string,
  businessTypeName?: string,
  name?: string,
  creditCode?: string | number,
  contactName?: string,
  phone?: string | number,
  regionName?: string,
  businessLicenseUrl?: string,
  applicationRemarks?: string,
}
const details = reactive<detailsType>({
  submitTime: undefined,
  businessTypeName: undefined,
  name: undefined,
  creditCode: undefined,
  contactName: undefined,
  phone: undefined,
  regionName: undefined,
  businessLicenseUrl: undefined,
  applicationRemarks: undefined
})
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const commonColumns = [
  {
    title: '企业名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '企业类型',
    dataIndex: 'businessTypeName',
    key: 'businessTypeName',
  },
  {
    title: '所属地区',
    dataIndex: 'regionName',
    key: 'regionName',
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'creditCode',
    key: 'creditCode',
  },
  {
    title: '营业执照',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '信息来源',
    dataIndex: 'informationSources',
    key: 'informationSources',
  },
  {
    title: '管理员姓名',
    dataIndex: 'contactName',
    key: 'contactName',
  },
  {
    title: '管理员手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
]
const columns = [
  ...commonColumns,
  {
    title: '审核通过时间',
    dataIndex: 'submitTime',
    key: 'submitTime',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const auditColumns = [
  ...commonColumns,
  {
    title: '信息提交时间',
    dataIndex: 'submitTime',
    key: 'submitTime',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const failColumns = [
  ...commonColumns,
  {
    title: '审核驳回时间',
    dataIndex: 'submitTime',
    key: 'submitTime',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const commonParams = {
  groupId: -1,
}
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      state: 2,
      groupId: props.groupId
    },
  },
  auditTableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      state: 1,
      groupId: props.groupId
    },
  },
  failTableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      state: 3,
      groupId: props.groupId
    },
  }
});
const {
  tableData,
  auditTableData,
  failTableData,
} = toRefs(state)
const keyNameList = {
  // businessType: '企业类型',
  name: '企业名称',
  regionCode: '企业所属地区',
  // provinceId: '省',
  // cityId: '市',
  // areaId: '县',
  addressDetail: '企业详情地址',
  legalPerson: '法定代表人',
  managementRange: '经营范围',
  registeredCapital: '注册资本',
  establishTime: '成立日期',
  businessTerm: '营业期限',
  contactName: '联系人',
  phone: '联系电话',
  accountType: '公司账户类型',
  bankAccountName: '公司账户名称',
  bank: '开户行',
  bankAccount: '公司账号',
  creditCode: '统一社会信用代码',
  businessLicenseUrl: '营业执照',
  // manageUrl: '经营许可证',
  hotelStarCode: '星级',
  unitStatus: '开业状态', //  0-开业 1-停业
  isReduced: '是否支持减免', // 0-否 1-是
  reduceRule: '减免规则',
  startTime: '开始营业时间', // '营业时间',
  endTime: '结束营业时间',
  shopPhone: '店铺联系电话',
  cateringDesc: '其他'
}
const newArrList = ref<any>({})
const oldArrList = ref<any>({})
const changeKeys = ref<string[]>([])

const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}

const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
const auditOnHandleCurrentChange = (val: number) => {
  state.auditTableData.param.pageNo = val;
  onAuditSearch();
}
const auditPageSideChange = (current: number, size: number) => {
  state.auditTableData.param.pageSize = size;
  onAuditSearch();
}
const failOnHandleCurrentChange = (val: number) => {
  state.failTableData.param.pageNo = val;
  onFailSearch();
}
const failPageSideChange = (current: number, size: number) => {
  state.failTableData.param.pageSize = size;
  onFailSearch();
}
const onSearch = () => {
  api.findByStateTravelMembershipList(state.tableData.param).then((res: any) => {
    state.tableData.data = res.content;
    state.tableData.total = res.total;
  })
}
const onAuditSearch = async () => {
  let res = await api.findByStateTravelMembershipList(state.auditTableData.param)
  state.auditTableData.data = res.content;
  state.auditTableData.total = res.total;
}
const onFailSearch = () => {
  api.findByStateTravelMembershipList(state.failTableData.param).then((res: any) => {
    state.failTableData.data = res.content;
    state.failTableData.total = res.total;
  })
}
const tabsChange = (val: string) => {
  switch (val) {
    case '1':
      if (state.tableData.data.length === 0) {
        onSearch()
      }
      break;
    case '2':
      if (state.auditTableData.data.length === 0) {
        onAuditSearch()
      }
      break;
    case '3':
      if (state.failTableData.data.length === 0) {
        onFailSearch()
      }
      break;
  }
}

const auditEnterprise = async (record: any) => {
  failForm.oid = record.oid
  details.name = record.name
  auditVisible.value = true
  let key: keyof detailsType
  for (key in details) {
    if (Object.prototype.hasOwnProperty.call(details, key)) {
      details[key] = record[key];
    }
  }
  if (record.informationSources === '入会申请') {
    isRegiste.value = true
  } else if (record.informationSources === '退会申请') {
    isRegiste.value = false
  }
}



const auditClose = () => {
  failVisible.value = true
}
const auditConform = () => {
  registerAuditVisible.value = true
}
const registerAuditClose = () => {
  registerAuditVisible.value = false
}
const registerAuditConform = async () => {
  if (isRegiste.value) {
    // 入会通过2
    failForm.state = 2
  } else {
    // 退会通过6
    failForm.state = 6
  }
  let res = await api.reviewRetreatApplyJoin(toRaw(failForm))
  if (res) {
    message.success('审核成功！')
    auditVisible.value = false
    registerAuditVisible.value = false
    changeAuditVisible.value = false
    onSearch()
    onAuditSearch()
  } else {
    message.error('审核失败！')
  }
}
const failClose = () => {
  failFormRef.value.resetFields()
  failVisible.value = false
}
const failConform = () => {
  failFormRef.value.validateFields().then(async () => {
    if (isRegiste.value) {
      // 入会拒绝3
      failForm.state = 3
    } else {
      // 退回拒绝5
      failForm.state = 5
    }
    let res = await api.reviewRetreatApplyJoin(toRaw(failForm))
    if (res) {
      message.success('驳回成功！')
      auditVisible.value = false
      failVisible.value = false
      changeAuditVisible.value = false
      onFailSearch()
      onAuditSearch()
    } else {
      message.error('驳回失败！')
    }
  })
}
const changeAuditCancel = () => {
  newArrList.value = {}
  oldArrList.value = {}
  changeKeys.value = []
}
onActivated(() => {
  if (route.params?.isRefresh === '1') {
    onSearch()
  }
})
onMounted(() => {
  onSearch()
  onAuditSearch()
  // onFailSearch()
})
</script>

<style scoped lang="scss">
:deep(.ant-tabs-tab + .ant-tabs-tab) {
  margin: 0 0 0 60px;
}

.tabs_box {
  position: relative;
  padding: 20px;

  .rebadge {
    position: absolute;
    left: 165px;
    top: 25px;
  }
}

.table-area {
  padding: unset;
}

.buttom_box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table_box {
  max-height: 80vh;
  padding: 1px 0;
  overflow: auto;

  .tip {
    margin-top: 20px;
  }

  .row {
    width: 100%;
    font-size: 14px;
    font-family: Microsoft YaHei UI;
    font-weight: 400;
    color: #1E2226;
    border: 1px solid #E9E9E9;
  }

  .change_table {
    width: 100%;

    .key,
    .key_hd {
      width: 150px;
    }

    .key_hd {
      background: rgba(245, 247, 250, 0.39);
    }

    .value {
      min-width: 300px;
    }
  }

  .info_table {
    width: 100%;

    .key {
      width: 150px;
      background: rgba(245, 247, 250, 0.39);
    }
  }
}
</style>
