<template>
  <CommonSearch v-show="activeKey === '1'">
    <!-- <search-item label="启用状态">
      <a-select placeholder="请选择启用状态" v-model:value="tableData.param.enableSatus" allowClear>
        <a-select-option v-for="item in enableOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="审核状态">
      <a-select placeholder="请选择审核状态" v-model:value="tableData.param.businessType" allowClear>
        <a-select-option v-for="item in auditOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item> -->
    <search-item label="旅行社" v-show="isSuper">
      <a-input v-model:value="tableData.param.travelName" placeholder="请输入旅行社名称" allowClear />
    </search-item>
    <search-item label="门店名称">
      <a-input v-model:value="tableData.param.storeName" placeholder="请输入门店名称" allowClear />
    </search-item>
    <template #button>
      <a-button @click="onQuery">查询</a-button>
    </template>
  </CommonSearch>
  <CommonSearch v-show="activeKey === '2'">
    <!-- <search-item label="启用状态">
      <a-select placeholder="请选择启用状态" v-model:value="tableData1.param.enableSatus" allowClear>
        <a-select-option v-for="item in enableOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item> -->
    <search-item label="旅行社" v-show="isSuper">
      <a-input v-model:value="tableData1.param.travelName" placeholder="请输入旅行社名称" allowClear />
    </search-item>
    <search-item label="门店名称">
      <a-input v-model:value="tableData1.param.storeName" placeholder="请输入门店名称" allowClear />
    </search-item>
    <template #button>
      <a-button @click="onQuery">查询</a-button>
    </template>
  </CommonSearch>
  <div class="tabs_box">
    <a-badge :count="tableData1.total" class="rebadge" />
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="已审核">
        <CommonTable :dataSource="tableData.data" :columns="columns">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <a @click="checkDetails(record.oid)">查看</a>
                <a @click="addOrUpdate({ row: record, handle: 'update' })">修改</a>
                <!-- <a-popconfirm title="是否要禁用该门店？禁用后该门店所有操作员不可以再登录发起散客合同。" ok-text="确认" cancel-text="取消"
                  @confirm="disable(0, record.oid)">
                  <a v-show="record.enableSatus">禁用</a>
                </a-popconfirm>
                <a-popconfirm title="是否要启用该门店？启用后该门店所有操作员账号可以恢复使用散客合同。" ok-text="确认" cancel-text="取消"
                  @confirm="disable(1, record.oid)">
                  <a v-show="!record.enableSatus">启用</a>
                </a-popconfirm> -->
              </div>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025;">{{ tableData.total }}</span> 个散客门店</div>
          <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
            :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="待审核">
        <CommonTable :dataSource="tableData1.data" :columns="columns1">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <template v-if="record?.isAudit">
                  <a @click="auditStore(record)">去审核</a>
                </template>
                <a @click="checkDetails(record.oid)">查看</a>
              </div>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025;">{{ tableData1.total }}</span> 个待审核的散客门店</div>
          <CommonPagination v-model:current="tableData1.param.pageNo" v-model:page-size="tableData1.param.pageSize"
            :total="tableData1.total" @change="onHandleCurrentChange1" @showSizeChange="pageSideChange1" />
        </div>
      </a-tab-pane>
      <template #rightExtra>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">创建新门店</a-button>
      </template>
    </a-tabs>
  </div>

  <CommonModal :title="submitTitle" v-model:visible="modalVisible" @cancel="modalCancel" @close="modalCancel"
    :conform-text="'提交'" @conform="submitStore">
    <a-form ref="addStoreRef" :model="form" :rules="formRules" name="addStore" autocomplete="off"
      :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item name="companyId" label="所属旅行社">
        <a-select placeholder="请选择所属旅行社" v-model:value="form.companyId" allowClear :disabled="!isSuper">
          <a-select-option v-for="item in companyOptions" :value="item.oid">{{
              item.name
          }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="storeName" label="门店名称">
        <a-input v-model:value="form.storeName" placeholder="请输入门店名称">
        </a-input>
      </a-form-item>
      <a-form-item name="storeAddress" label="门店地址">
        <a-input v-model:value="form.storeAddress" placeholder="请输入门店地址">
        </a-input>
      </a-form-item>
      <a-form-item name="storePhone" label="门店电话">
        <a-input v-model:value="form.storePhone" placeholder="请输入门店联系电话">
        </a-input>
      </a-form-item>
      <a-form-item name="personLiableName" label="门店负责人">
        <a-input v-model:value="form.personLiableName" placeholder="请输入门店负责人">
        </a-input>
      </a-form-item>
      <a-form-item name="personLiablePhone" label="负责人电话">
        <a-input v-model:value="form.personLiablePhone" placeholder="请输入负责人电话">
        </a-input>
      </a-form-item>
      <a-form-item name="contractPurview" label="门店合同权限">
        <a-select placeholder="请选择门店合同权限" v-model:value="form.contractPurview" allowClear>
          <a-select-option v-for="item in contractOptions" :value="item.oid">{{
              item.name
          }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="filingNo" label="备案号">
        <a-input v-model:value="form.filingNo" placeholder="请输入备案号">
        </a-input>
      </a-form-item>
      <a-form-item name="authorizationCode" label="授权码">
        <a-input v-model:value="form.authorizationCode" placeholder="请输入授权码">
        </a-input>
      </a-form-item>
      <a-form-item name="enableSatus" label="启用状态" v-if="!isAdd">
        <a-radio-group v-model:value="form.enableSatus">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </CommonModal>
  <CommonModal title="门店详情" v-model:visible="detailsVisible" :conform-text="'确认'" @conform="detailsClose"
    @cancel="detailsClose" :is-cancel="false">
    <div class="table_box">
      <table class="info_table" cellpadding="16px" border="1">
        <tr class="row" v-for="(value, key) in detailsKeys">
          <td class="key">{{ value }}</td>
          <td class="value">{{ detailsForm[key] }}</td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <CommonModal :title="submitResultTitle" v-model:visible="submitResultVisible" :conform-text="'确认'"
    @conform="addStoreSuccess" @cancel="addStoreSuccess" :is-cancel="false">
    <div v-if="isAdd">
      <div v-if="isSuper">门店创建成功，系统将自动通知该旅行社企业管理员，继续给门店操作员创建账号</div>
      <div v-else>门店信息提交成功，系统将自动通知相关管理人员进行审核，请注意关注审核结果</div>
    </div>
    <div v-else>
      <div v-if="isSuper">门店信息修改成功</div>
      <div v-else>门店信息提交成功，系统将自动通知相关管理人员进行审核，请注意关注审核结果</div>
    </div>
  </CommonModal>
  <CommonModal title="散客门店新开通审核" v-model:visible="auditVisible" @cancel="auditCancel" @close="failVisible = true"
    :conform-text="'同意开通'" :cancel-text="'驳回'" @conform="registerAuditVisible = true">
    当前有新创建的散客门店待您审核，审核同意后该门店可以正常发起散客电子合同：
    <div class="table_box">
      <table class="info_table" cellpadding="16px" border="1">
        <tr class="row" v-for="(value, key) in detailsKeys">
          <td class="key">{{ value }}</td>
          <td class="value">{{ detailsForm[key] }}</td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <CommonModal title="散客门店信息修改审核" v-model:visible="changeVisible" @cancel="changeCancel" @close="failVisible = true"
    :conform-text="'同意修改'" :cancel-text="'驳回'" @conform="registerAuditVisible = true" width="50%">
    <div class="table_box">
      <table class="change_table" cellpadding="16px" border="1">
        <tr class="row">
          <th class="key_hd">信息项</th>
          <th class="key_hd">修改前</th>
          <th class="key_hd">修改后</th>
        </tr>
        <tr class="row" v-for="(item, index) in changeKeys" :key="index">
          <td class="key">{{ detailsKeys[item] }}</td>
          <td class="value">{{ oldArrList[item] }}</td>
          <td class="value">{{ newArrList[item] }}</td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <CommonModal :title="registerAuditTitle" v-model:visible="registerAuditVisible" @close="registerAuditVisible = false"
    @conform="registerAuditConform" :conform-text="'确定'" :key="registerAuditTitle">
    <span v-if="isRegiste">
      您即将批准 {{ detailsForm['storeName'] }} 散客门店新开通的申请
    </span>
    <span v-else>
      您即将批准 {{ detailsForm['storeName'] }} 散客门店信息修改的申请，是否已检查无误？
    </span>
  </CommonModal>
  <CommonModal :title="failTitle" v-model:visible="failVisible" @close="failClose" @cancel="failClose"
    @conform="failConform" :conform-text="'确定'" :key="failTitle">
    <!-- <a-form ref="failFormRef" :model="failForm" :rules="failFormRules" name="fail-form" autocomplete="off"
      labelAlign="left" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item name="auditRemark" label="驳回原因">
        <a-textarea v-model:value="failForm.auditRemark" placeholder="请输入驳回原因" :rows="2">
        </a-textarea>
      </a-form-item>
    </a-form> -->
    <span v-if="isRegiste">
      您是否驳回 {{ detailsForm['storeName'] }} 散客门店新开通的申请？
    </span>
    <span v-else>
      您是否驳回 {{ detailsForm['storeName'] }} 散客门店信息修改的申请？
    </span>
  </CommonModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
const router = useRouter();
const route = useRoute()
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      companyId: undefined,
      auditStatus: 1, // 已审核
      enableSatus: undefined, // 启用禁用
      travelName: undefined, // 旅行社名称
      storeName: undefined, // 店名
    },
  },
  tableData1: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      companyId: undefined,
      auditStatus: 2, // 待审核
      enableSatus: undefined, // 启用禁用
      travelName: undefined, // 旅行社名称
      storeName: undefined, // 店名
    },
  },
  modalVisible: false,
  detailsVisible: false,
  submitResultVisible: false,
  auditVisible: false,
  changeVisible: false,
  isAdd: true,
  isSuper: false,
});
const activeKey = ref('1')
const form = ref({
  companyId: undefined,
  storeName: '',
  storeAddress: '',
  storePhone: '',
  personLiableName: '',
  personLiablePhone: '',
  contractPurview: undefined,
  filingNo: '',
  authorizationCode: '',
  enableSatus: 0
})
const newArrList = ref<any>({})
const oldArrList = ref<any>({})
const changeKeys = ref<string[]>([])
const detailsForm = ref({})
const auditForm = ref()
const addStoreRef = ref()
const formRules = {}
const failForm = reactive({
  auditTypeCode: 18, // 18: 创建散客门店.,19:修改散客门店信息
  auditRemark: '',
  uuid: '',
  roleId: '',
  businessType: '',
  /* 
  2 审核通过
  3 审核不通过
   */
  auditStatus: 2
})
const registerAuditVisible = ref(false)
const failVisible = ref(false)
const isRegiste = ref(true)
const failFormRef = ref()
const registerAuditTitle = computed(() => {
  return isRegiste.value ? '散客门店新开通审核确认' : '散客门店信息修改审核确认'
})
const failTitle = computed(() => {
  return isRegiste.value ? '驳回散客门店新开通申请' : '驳回散客门店信息修改申请'
})
const enableOption = [
  { codeValue: 1, name: '已启用' },
  { codeValue: 0, name: '已禁用' }
]
const auditOption = [
  { codeValue: 1, name: '通过' },
  { codeValue: 0, name: '未通过' }
]
const travelAgencyOption = []
const {
  tableData,
  tableData1,
  modalVisible,
  detailsVisible,
  submitResultVisible,
  isAdd,
  isSuper,
  auditVisible,
  changeVisible
} = toRefs(state)
const submitResultTitle = computed(() => {
  if (state.isAdd) {
    if (state.isSuper) {
      return '门店创建成功'
    } else {
      return '门店提交成功'
    }
  } else {
    return '信息修改提交成功'
  }
})
const submitTitle = computed(() => {
  if (state.isAdd) {
    return '创建散客门店'
  } else {
    return '修改门店信息'
  }
})
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '所属旅行社',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName',
  },
  {
    title: '门店地址',
    dataIndex: 'storeAddress',
    key: 'storeAddress',
  },
  {
    title: '门店电话',
    dataIndex: 'storePhone',
    key: 'storePhone',
  },
  {
    title: '门店负责人',
    dataIndex: 'personLiableName',
    key: 'personLiableName',
  },
  {
    title: '负责人电话',
    dataIndex: 'personLiablePhone',
    key: 'personLiablePhone',
  },
  {
    title: '启用状态',
    dataIndex: 'enableSatusName',
    key: 'enableSatusName',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const columns1 = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '所属旅行社',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName',
  },
  {
    title: '门店地址',
    dataIndex: 'storeAddress',
    key: 'storeAddress',
  },
  {
    title: '门店电话',
    dataIndex: 'storePhone',
    key: 'storePhone',
  },
  {
    title: '门店负责人',
    dataIndex: 'personLiableName',
    key: 'personLiableName',
  },
  {
    title: '负责人电话',
    dataIndex: 'personLiablePhone',
    key: 'personLiablePhone',
  },
  {
    title: '审核类型',
    dataIndex: 'auditType',
    key: 'auditType',
  },
  /* {
    title: '门店审核状态',
    dataIndex: 'auditStatusName',
    key: 'auditStatusName',
  },
  {
    title: '信息审核状态',
    dataIndex: 'informationAuditStatusName',
    key: 'informationAuditStatusName',
  }, */
  {
    title: '启用状态',
    dataIndex: 'enableSatusName',
    key: 'enableSatusName',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const detailsKeys = {
  companyName: '所属旅行社',
  storeName: '门店名称',
  storeAddress: '门店地址',
  storePhone: '门店电话',
  personLiableName: '门店负责人',
  personLiablePhone: '负责人电话',
  contractPurviewName: '门店合同权限',
  filingNo: '备案号',
  authorizationCode: '授权码',
  enableSatusName: '启用状态',
  auditType: '审核类型',
  /* auditStatusName: '门店审核状态',
  informationAuditStatusName: '信息审核状态', */
  createTime: '门店创建时间'
}
const contractOptions = [
  { oid: 1, name: '线上合同+线下合同' },
  { oid: 2, name: '仅线上合同' },
  { oid: 3, name: '仅线下合同' },
]
const failFormRules: Record<string, Rule[]> = {
  auditRemark: [{ required: true, trigger: 'blur', message: '请输入驳回原因' }],
}
const businessManageOptions = useBusinessManageOption();
const initOpeion = async () => {
  await businessManageOptions.getCompanyByBusinessType('TRAVEL');
};
const companyOptions = computed(() => businessManageOptions.companyOptions);
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}
const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
const onHandleCurrentChange1 = (val: number) => {
  state.tableData1.param.pageNo = val;
  onAuditSearch();
}
const pageSideChange1 = (current: number, size: number) => {
  state.tableData1.param.pageSize = size;
  onAuditSearch();
}
const onSearch = async () => {
  const { content, total } = await api.selectIndividualStoreList(state.tableData.param)
  state.tableData.data = content
  state.tableData.total = total
}
const onAuditSearch = async () => {
  const { content, total } = await api.selectIndividualStoreList(state.tableData1.param)
  const uuids: (string | number)[] = []
  content?.forEach((item: any) => {
    if (item.auditUuid) {
      uuids.push(item.auditUuid)
    }
  })
  if (uuids.length > 0) {
    let res1 = await api.getAuditButton({ uuIds: uuids })
    if (res1?.length > 0) {
      content?.forEach((item: any) => {
        res1.forEach((citem: any) => {
          if (item.auditUuid === citem.uuid) {
            item.uuid = citem.uuid
            item.roleId = citem.roleId
            item.auditBusinessType = citem.auditBusinessType
            item.isAudit = true
          }
        })
      })
    }
  }
  state.tableData1.data = content
  state.tableData1.total = total
}
const onQuery = () => {
  if (activeKey.value === '1') {
    state.tableData.param.pageNo = 1;
    onSearch()
  } else if (activeKey.value === '2') {
    state.tableData1.param.pageNo = 1;
    onAuditSearch()
  }
}
const modalCancel = () => {
  state.modalVisible = false
  addStoreRef.value.resetFields()
}
interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = async ({ row, handle }: addInterface) => {
  modalVisible.value = true
  if (handle === 'add') {
    state.isAdd = true
  } else if (handle === 'update') {
    state.isAdd = false
    form.value = await getDetails(row.oid)
  }
}
const disable = async (state: number, oid: string) => {
  let res = await api.updataTeamType({ oid, state })
  if (res === '修改成功') {
    message.success(res)
    onSearch();
  } else {
    message.success('禁用失败！')
  }
}
const tabsChange = () => { }
const submitStore = () => {
  addStoreRef.value.validateFields().then(async () => {
    if (state.isAdd) {// 新增
      let res
      if (state.isSuper) { // 一卡通、文旅局
        res = await api.createIndividualStoreAdmin(form.value)
      } else { // 旅行社
        res = await api.createIndividualStore(form.value)
      }
      if (res) {
        state.submitResultVisible = true
      } else {
        message.error(res)
      }
    } else {// 修改
      let res
      if (state.isSuper) { // 一卡通、文旅局
        res = await api.editIndividualStoreAdmin(form.value)
      } else { // 旅行社
        res = await api.editIndividualStore(form.value)
      }
      if (res) {
        state.submitResultVisible = true
      } else {
        message.error(res)
      }
    }
  }).catch((error: Error) => {
    console.log(error);
  })
}
const addStoreSuccess = () => {
  state.submitResultVisible = false
  modalCancel()
  onSearch()
  onAuditSearch()
}
const auditStore = async (record: any) => {
  failForm.uuid = record.uuid
  failForm.roleId = record.roleId
  failForm.businessType = record.auditBusinessType
  if (record.auditStatus === 0) {
    failForm.auditTypeCode = 18 // 18: 创建散客门店.,19:修改散客门店信息
    isRegiste.value = true
    state.auditVisible = true
    detailsForm.value = await getDetails(record.oid)
  } else if (record.auditStatus === 1 && record.informationAuditStatus === 1) {
    failForm.auditTypeCode = 19 // 18: 创建散客门店.,19:修改散客门店信息
    isRegiste.value = false
    state.changeVisible = true
    getChangeInfo(record.oid)
  }
}
const registerAuditConform = async () => {
  // 审核通过
  failForm.auditStatus = 2
  let res = await api.auditCompany(toRaw(failForm))
  if (res) {
    message.success('审核成功！')
    auditVisible.value = false
    registerAuditVisible.value = false
    changeVisible.value = false
    onSearch()
    onAuditSearch()
  } else {
    message.error('审核失败！')
  }
}
const failConform = async () => {
  // 审核不通过
  failForm.auditStatus = 3
  let res = await api.auditCompany(toRaw(failForm))
  if (res) {
    message.success('驳回成功！')
    auditVisible.value = false
    failVisible.value = false
    changeVisible.value = false
    onSearch()
    onAuditSearch()
  } else {
    message.error('驳回失败！')
  }
  /* failFormRef.value.validateFields().then(async () => {
    // 审核不通过
    failForm.auditStatus = 3
    let res = await api.auditCompany(toRaw(failForm))
    if (res) {
      message.success('驳回成功！')
      auditVisible.value = false
      failVisible.value = false
      changeVisible.value = false
      onSearch()
      onAuditSearch()
    } else {
      message.error('驳回失败！')
    }
  }) */
}
const failClose = () => {
  // failFormRef.value.resetFields()
  failVisible.value = false
}
const auditCancel = () => {
  state.auditVisible = false
  detailsForm.value = {}
}
const changeCancel = () => {
  newArrList.value = {}
  oldArrList.value = {}
  changeKeys.value = []
}
const changeConform = () => { }

const getUserInfo = () => {
  let userInfo = window.localStorage.getItem('userInfo');
  userInfo = JSON.parse(userInfo as string);
  const { sysCompany: { oid }, sysRoles } = userInfo
  const roleCode = sysRoles.map((item: any) => {
    if (['CULTURE_BUREAU_SUPER_ADMIN', 'PLATFORM_SUPER_ADMIN', 'TRAVEL_SUPER_ADMIN'].includes(item.roleCode)) {
      return item.roleCode
    }
  })
  if (roleCode.includes('CULTURE_BUREAU_SUPER_ADMIN') || roleCode.includes('PLATFORM_SUPER_ADMIN')) {
    state.tableData1.param.companyId = undefined
    state.tableData.param.companyId = undefined
    state.isSuper = true
  } else if (roleCode.includes('TRAVEL_SUPER_ADMIN')) {
    state.tableData1.param.companyId = oid
    state.tableData.param.companyId = oid
    form.value.companyId = oid
    state.isSuper = false
  }
}

const getDetails = async (oid: string | number) => {
  const res = await api.findIndividualStoreById(oid)
  return res ? res : {}
}
const getChangeInfo = async (oid: string | number) => {
  const res = await api.auditIndividualStoreInformationContrast(oid)
  const newList = res?.new
  const oldList = res?.old
  const keyList = Object.keys(detailsKeys)
  keyList.forEach((key: string) => {
    if (newList[key] != oldList[key]) {
      newArrList.value[key] = newList[key]
      oldArrList.value[key] = oldList[key]
      changeKeys.value.push(key)
    }
  })
}
const checkDetails = async (oid: string | number) => {
  detailsForm.value = await getDetails(oid)
  detailsVisible.value = true
}
const detailsClose = () => {
  detailsVisible.value = false
  detailsForm.value = {}
}
onMounted(() => {
  getUserInfo()
  onSearch()
  onAuditSearch()
  initOpeion()
})
</script>

<style scoped lang="scss">
.buttom_box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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

.table_box {
  max-height: 60vh;
  padding: 1px 0;
  overflow: auto;

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