<template>
  <search v-model:value="tableData.param" @query="onQuery" :isTravel="isSuper" v-show="activeKey === '1'"></search>
  <search v-model:value="tableData1.param" @query="onQuery" :isTravel="isSuper" v-show="activeKey === '2'"></search>
  <div class="tabs_box">
    <a-badge :count="tableData1.total" class="rebadge" />
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="已审核" v-if="getTabPermission('已审核')">
        <CommonTable :dataSource="tableData.data" :columns="columns">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'storeName'">
              <span v-if="record.operatorRole === '中心操作员'">/</span>
              <span v-else>{{ record.storeName }}</span>
            </template>
            <template v-if="column.key === 'auditState'">
              {{ cmpAuditState(record) }}
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <a @click="checkDetails(record)" v-permission="'已审核_查看'">查看</a>
                <a @click="addOrUpdate({ row: record, handle: 'update' })" v-permission="'已审核_修改'">修改</a>
                <!-- <a-popconfirm title="是否要禁用该操作员？禁用后该操作员不可再登录一卡通平台。" ok-text="确认" cancel-text="取消"
                  @confirm="disable(0, record.userId)">
                  <a v-show="record.enableSatus">禁用</a>
                </a-popconfirm>
                <a-popconfirm title="是否要启用该操作员？启用后该操作员可恢复登录、散拼业务权限。" ok-text="确认" cancel-text="取消"
                  @confirm="disable(1, record.userId)">
                  <a v-show="!record.enableSatus">启用</a>
                </a-popconfirm> -->
              </div>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025;">{{ tableData.total }}</span> 个门店操作员账号</div>
          <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
            :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="待审核" v-if="getTabPermission('待审核')">
        <CommonTable :dataSource="tableData1.data" :columns="columns1">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'storeName'">
              <span v-if="record.operatorRole === '中心操作员'">/</span>
              <span v-else>{{ record.storeName }}</span>
            </template>
            <template v-if="column.key === 'auditState'">
              {{ cmpAuditState(record) }}
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <template v-if="isSuper">
                  <a @click="auditStore(record)" v-permission="'待审核_去审核'">去审核</a>
                </template>
                <a @click="checkDetails(record)" v-permission="'待审核_查看'">查看</a>
              </div>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025;">{{ tableData1.total }}</span> 个待审核账号</div>
          <CommonPagination v-model:current="tableData1.param.pageNo" v-model:page-size="tableData1.param.pageSize"
            :total="tableData1.total" @change="onHandleCurrentChange1" @showSizeChange="pageSideChange1" />
        </div>
      </a-tab-pane>
      <template #rightExtra>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })" v-permission="'新建账号'">新建账号</a-button>
      </template>
    </a-tabs>
  </div>

  <CommonModal :title="submitTitle" v-model:visible="modalVisible" @cancel="modalCancel" @close="modalCancel"
    :conform-text="'提交'" @conform="submitStore">
    <a-form ref="addOperatorRef" :model="form" :rules="formRules" name="addOperator" autocomplete="off"
      :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item name="companyId" label="所属旅行社">
        <a-select placeholder="请选择所属旅行社" v-model:value="form.companyId" allowClear :disabled="!isSuper || !isAdd">
          <a-select-option v-for="item in companyOptions" :value="item.oid">{{
            item.name
          }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="operatorRoleId" label="操作员角色">
        <a-select placeholder="请选择操作员角色" v-model:value="form.operatorRoleId" allowClear :disabled="!isAdd"
          @change="(val: any, option: any) => { operatorChange(option) }">
          <a-select-option v-for="item in operatorRoleOptions" :value="item.oid" :key="item.roleName">{{
            item.roleName
          }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="storeId" label="选择门店" v-show="form.operatorRoleId === 33">
        <a-select placeholder="请选择门店" v-model:value="form.storeId" allowClear :disabled="!isAdd">
          <a-select-option v-for="item in storeOptions" :value="item.oid">{{
            item.name
          }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="operatorName" label="操作员姓名">
        <a-input v-model:value="form.operatorName" placeholder="请输入操作员姓名">
        </a-input>
      </a-form-item>
      <a-form-item name="operatorPhone" label="操作员电话">
        <a-input v-model:value="form.operatorPhone" placeholder="请输入操作员电话">
        </a-input>
      </a-form-item>
      <a-form-item name="certificateNo" label="证件号">
        <a-input v-model:value="form.certificateNo" placeholder="请输入证件号">
        </a-input>
      </a-form-item>
      <a-form-item name="account" label="设置登录账号">
        <a-input v-model:value="form.account" placeholder="请创建登录账号" :disabled="!isAdd">
        </a-input>
      </a-form-item>
      <a-form-item name="password" label="设置登录密码" v-if="isAdd">
        <a-input v-model:value="form.password" placeholder="请输入密码">
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
  <CommonModal title="查看散客门店操作员" v-model:visible="detailsVisible" :conform-text="'关闭'" @conform="detailsClose"
    @cancel="detailsClose" :is-cancel="false">
    <div class="table_box">
      <table class="info_table" cellpadding="16px" border="1">
        <tr class="row" v-for="(value, key) in cumpDetailsKeys(detailsForm.operatorRole)">
          <td class="key">{{ value }}</td>
          <td class="value">{{ detailsForm[key] }}</td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <!-- <CommonModal title="状态修改成功" v-model:visible="disableVisible" :conform-text="'确认'" @conform="disableVisible = false"
    :is-cancel="false">
    {{ disableTip }}
  </CommonModal> -->
  <CommonModal :title="`${detailsForm.operatorRole ? detailsForm.operatorRole : ''}账号开通审核`"
    v-model:visible="auditVisible" @cancel="auditCancel" @close="failVisible = true" :conform-text="'同意'"
    :cancel-text="'驳回'" @conform="registerAuditVisible = true">
    当前有旅行社创建了新的{{ detailsForm.operatorRole }}账号，待您审核：
    <div class="table_box">
      <table class="info_table" cellpadding="16px" border="1">
        <tr class="row" v-for="(value, key) in cumpDetailsKeys(detailsForm.operatorRole)">
          <td class="key">{{ value }}</td>
          <td class="value">{{ detailsForm[key] }}</td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <CommonModal title="操作员账号修改审核" v-model:visible="changeVisible" @cancel="changeCancel" @close="failVisible = true"
    :conform-text="'同意'" :cancel-text="'驳回'" @conform="registerAuditVisible = true" width="50%">
    <div class="table_box">
      当前有旅行社修改了{{ detailsForm.operatorRole }}账号信息，待您审核：
      <table class="change_table" cellpadding="16px" border="1">
        <tr class="row">
          <th class="key_hd">信息项</th>
          <th class="key_hd">修改前</th>
          <th class="key_hd">修改后</th>
        </tr>
        <tr class="row" v-for="(item, index) in changeKeys" :key="index">
          <td class="key">{{ compareKeys[item] }}</td>
          <td class="value">{{ oldArrList[item] }}</td>
          <td class="value">{{ newArrList[item] }}</td>
        </tr>
      </table>
      申请提交时间：{{ detailsForm.lastUpdateTime }}
    </div>
  </CommonModal>
  <CommonModal :title="registerAuditTitle" v-model:visible="registerAuditVisible" @close="registerAuditVisible = false"
    @conform="registerAuditConform(1)" :conform-text="'确定'" :key="registerAuditTitle">
    <span v-if="isRegiste">
      您即将批准 {{ detailsForm['operatorName'] }} 操作员账号新开通的申请
    </span>
    <span v-else>
      您即将批准 {{ detailsForm['operatorName'] }} 操作员账号信息修改的申请，是否已检查无误？
    </span>
  </CommonModal>
  <CommonModal :title="failTitle" v-model:visible="failVisible" @close="failClose" @cancel="failClose"
    @conform="registerAuditConform(2, true)" :conform-text="'确定'" :key="failTitle">
    <!-- <a-form ref="failFormRef" :model="failForm" :rules="failFormRules" name="fail-form" autocomplete="off"
      labelAlign="left" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item name="auditRemark" label="驳回原因">
        <a-textarea v-model:value="failForm.auditRemark" placeholder="请输入驳回原因" :rows="2">
        </a-textarea>
      </a-form-item>
    </a-form> -->
    <span v-if="isRegiste">
      您是否驳回 {{ detailsForm['operatorName'] }} 操作员账号新开通的申请？
    </span>
    <span v-else>
      您是否驳回 {{ detailsForm['operatorName'] }} 操作员账号信息修改的申请？
    </span>
  </CommonModal>
</template>

<script setup lang="ts">
import search from '@/views/individualGroupOperators/search.vue'
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
import { cloneDeep } from "lodash";
import { getTabPermission } from '@/utils/util';
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
      auditStatus: 1, // 已审核
      companyId: undefined,
      travelName: '', // 旅行社名称
      storeName: '', // 店名
      operatorName: ''
    },
  },
  tableData1: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      auditStatus: 2, // 待审核
      companyId: undefined,
      travelName: '', // 旅行社名称
      storeName: '', // 店名
      operatorName: ''
    },
  },
  modalVisible: false,
  detailsVisible: false,
  submitResultVisible: false,
  auditVisible: false,
  changeVisible: false,
  isAdd: true,
  isSuper: false,
  // disableTip: '',
  // disableVisible: false
});
const activeKey = ref('1')
const form = ref({
  companyId: undefined,
  operatorRoleId: undefined,
  storeId: undefined,
  operatorName: '',
  operatorPhone: '',
  certificateNo: '',
  account: '',
  operatorRole: '',
  enableSatus: undefined,
  password: undefined
})
type detailsKeysType = {
  companyName?: string,
  operatorRole?: string,
  storeName?: string,
  operatorName?: string,
  operatorPhone?: string,
  certificateNo?: string,
  account?: string,
  createTime?: string,
  auditState?: string,
  /* auditStatusName?: string,
  enableSatusName?: string, */
  lastUpdateTime?: string
}
type optionsType = {
  oid: string | number,
  name: string
}
const newArrList = ref<any>({})
const oldArrList = ref<any>({})
const changeKeys = ref<string[]>([])
const detailsForm = ref<detailsKeysType>({})
const auditForm = ref()
const addOperatorRef = ref()
const formRules = {}
const failForm = reactive({
  oid: '',
  userId: '',
  /* 
  1 审核通过
  2 审核不通过
   */
  auditResult: 2
})
const registerAuditVisible = ref(false)
const failVisible = ref(false)
const isRegiste = ref(true)
const failFormRef = ref()
const registerAuditTitle = computed(() => {
  return isRegiste.value ? '操作员账号新开通审核确认' : '操作员账号修改审核确认'
})
const failTitle = computed(() => {
  return isRegiste.value ? '驳回操作员账号新开通申请' : '驳回操作员账号修改申请'
})
const detailsItem = computed(() => (type: string, key: any, val: any) => {
  if (type === '中心操作员' && key === 'storeName') {
    return '/'
  } else {
    return val
  }
})
const cumpDetailsKeys = computed(() => (type: string | undefined) => {
  if (type === '中心操作员') {
    const cloneDetailsKeys = cloneDeep(detailsKeys)
    Reflect.deleteProperty(cloneDetailsKeys, 'storeName')
    return cloneDetailsKeys
  } else {
    return detailsKeys
  }
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
  changeVisible,
  // disableTip,
  // disableVisible
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
    return '新建散客拼团操作员'
  } else {
    return '编辑散客拼团操作员'
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
    title: '所属门店',
    dataIndex: 'storeName',
    key: 'storeName',
  },
  {
    title: '操作员角色',
    dataIndex: 'operatorRole',
    key: 'operatorRole',
  },
  {
    title: '操作员姓名',
    dataIndex: 'operatorName',
    key: 'operatorName',
  },
  {
    title: '操作员电话',
    dataIndex: 'operatorPhone',
    key: 'operatorPhone',
  },
  {
    title: '登录账号',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '证件号',
    dataIndex: 'certificateNo',
    key: 'certificateNo',
  },
  {
    title: '审核状态',
    dataIndex: 'auditState',
    key: 'auditState',
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
    title: '所属门店',
    dataIndex: 'storeName',
    key: 'storeName',
  },
  {
    title: '操作员角色',
    dataIndex: 'operatorRole',
    key: 'operatorRole',
  },
  {
    title: '操作员姓名',
    dataIndex: 'operatorName',
    key: 'operatorName',
  },
  {
    title: '操作员电话',
    dataIndex: 'operatorPhone',
    key: 'operatorPhone',
  },
  {
    title: '登录账号',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '证件号',
    dataIndex: 'certificateNo',
    key: 'certificateNo',
  },
  /* {
    title: '审核状态',
    dataIndex: 'auditStatusName',
    key: 'auditStatusName',
  },
  {
    title: '信息审核状态',
    dataIndex: 'informationAuditStatusName',
    key: 'informationAuditStatusName',
  }, */
  {
    title: '审核状态',
    dataIndex: 'auditState',
    key: 'auditState',
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
const detailsKeys = {
  companyName: '所属旅行社',
  operatorRole: '操作员角色',
  storeName: '所属门店',
  operatorName: '操作员姓名',
  operatorPhone: '操作员电话',
  certificateNo: '证件号',
  account: '登录账号',
  createTime: '创建时间',
  auditState: '审核状态',
  /* auditStatusName: '审核状态',
  informationAuditStatusName: '信息审核状态', */
  enableSatusName: '启用状态',
}
const compareKeys = {
  operatorName: '操作员姓名',
  operatorPhone: '操作员电话',
  certificateNo: '证件号',
  enableSatusName: '启用状态',
}
let storeOptions = ref<optionsType[]>([])
const failFormRules: Record<string, Rule[]> = {
  auditRemark: [{ required: true, trigger: 'blur', message: '请输入驳回原因' }],
}
const businessManageOptions = useBusinessManageOption();
const initOpeion = async () => {
  await businessManageOptions.getCompanyByBusinessType('TRAVEL');
  await businessManageOptions.getCenterAndOutletOperator();
};
const companyOptions: any = computed(() => businessManageOptions.companyOptions);
const operatorRoleOptions: any = computed(() => businessManageOptions.operatorRoleOptions);
const cmpAuditState = (record: any) => {
  const state1 = '审核未通过'
  const state2 = '审核通过'
  const state3 = '待审核'
  if (record.auditStatus === 2) {
    return state1
  } else if (record.auditStatus === 1 && record.informationAuditStatus === 2) {
    return state2
  } else if (record.auditStatus === 1 && record.informationAuditStatus === 0) {
    return state2
  } else if (record.auditStatus === 1 && record.informationAuditStatus === 3) {
    return state1
  } else if (record.auditStatus === 1 && record.informationAuditStatus === 1) {
    return state3
  } else if (record.auditStatus === 0) {
    return state3
  }
}
const getStoreList = async () => {
  const res = await api.individualStoreListByCompanyId(form.value.companyId)
  storeOptions.value = res?.map((item: { oid: string | number, storeName: string }) => {
    return {
      oid: item.oid,
      name: item.storeName
    }
  })
}

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
  const { content, total } = await api.selectIndividualStoreUserList(state.tableData.param)
  state.tableData.data = content
  state.tableData.total = total
}
const onAuditSearch = async () => {
  const { content, total } = await api.selectIndividualStoreUserList(state.tableData1.param)
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
  addOperatorRef.value.resetFields()
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
/* const disable = async (status: any, oid: string) => {
  let formData = new FormData();
  formData.append('oid', oid);
  formData.append('status', status);
  api.editStatus(formData).then((res: any) => {
    if (status === 0) {
      state.disableTip = '操作员启用状态修改成功，当前已禁用。'
    } else if (status === 1) {
      state.disableTip = '操作员启用状态修改成功，当前已启用。'
    }
    state.disableVisible = true;
    onSearch();
  })
} */
const tabsChange = () => { }
const operatorChange = (val: any) => {
  form.value.operatorRole = val.key
}
const submitStore = () => {
  addOperatorRef.value.validateFields().then(async () => {
    if (state.isAdd) {// 新增
      let res = await api.createIndividualStoreUser(form.value)
      if (res) {
        modalCancel()
        if (state.isSuper) {
          message.success('新建散客拼团操作员成功！')
          onSearch()
        } else {
          message.success('散客拼团操作员信息提交成功，系统将自动通知相关管理人员进行审核，请注意关注审核结果')
          onAuditSearch()
        }
      } else {
        message.error(res)
      }
    } else {// 修改
      let res = await api.editIndividualStoreUser(form.value)
      if (res) {
        if (state.isSuper) {
          message.success('编辑散客拼团操作员成功！')
        } else {
          message.success('散客拼团操作员信息提交成功，系统将自动通知相关管理人员进行审核，请注意关注审核结果')
        }
        modalCancel()
        onSearch()
        onAuditSearch()
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
  failForm.oid = record.oid
  failForm.userId = record.userId
  detailsForm.value = await getDetails(record.oid)
  detailsForm.value.auditState = cmpAuditState(detailsForm.value)
  if (record.auditStatus === 0) {
    isRegiste.value = true
    state.auditVisible = true
  } else if (record.auditStatus === 1 && record.informationAuditStatus === 1) {
    isRegiste.value = false
    state.changeVisible = true
    getChangeInfo(record.oid)
  }
}
const registerAuditConform = async (auditResult: number, isReject?: boolean) => {
  if (!isRegiste.value) { //信息修改 2.通过 3不通过
    if (auditResult === 1) {
      failForm.auditResult = 2
    } else if (auditResult === 2) {
      failForm.auditResult = 3
    }
  } else { // 账号创建审核
    failForm.auditResult = auditResult //1.通过 2不通过
  }
  let res
  if (isRegiste.value) { // 添加账号
    res = await api.auditIndividualStoreUser(toRaw(failForm))
  } else { // 修改账号
    res = await api.auditIndividualStoreUserInformation(toRaw(failForm))
  }
  if (isReject) {
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
  } else {
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
  let userInfo: any = window.localStorage.getItem('userInfo');
  userInfo = JSON.parse(userInfo);
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
  const res = await api.findIndividualStoreUserById(oid)
  return res ? res : {}
}
const getChangeInfo = async (oid: string | number) => {
  const res = await api.auditIndividualStoreUserInformationContrast(oid)
  const newList = res?.new
  const oldList = res?.old
  const keyList = Object.keys(compareKeys)
  keyList.forEach((key: string) => {
    if (newList[key] != oldList[key]) {
      newArrList.value[key] = newList[key]
      oldArrList.value[key] = oldList[key]
      changeKeys.value.push(key)
    }
  })
}
const checkDetails = async (record: any) => {
  detailsForm.value = await getDetails(record.oid)
  detailsForm.value.auditState = cmpAuditState(detailsForm.value)
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
  getStoreList()
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