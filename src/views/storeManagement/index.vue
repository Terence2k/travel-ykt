<template>
  <CommonSearch>
    <search-item label="启用状态">
      <a-select placeholder="请选择启用状态" v-model:value="tableData.param.businessType" allowClear>
        <a-select-option v-for="item in enableOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="旅行社">
      <a-input v-model:value="tableData.param.name" placeholder="请输入旅行社名称" />
    </search-item>
    <search-item label="门店名称">
      <a-input v-model:value="tableData.param.name" placeholder="请输入门店名称" />
    </search-item>
    <template #button>
      <a-button @click="onQuery">查询</a-button>
    </template>
  </CommonSearch>
  <div class="tabs_box">
    <a-badge :count="tableData.total" class="rebadge" />
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="已审核通过">
        <CommonTable :dataSource="tableData.data" :columns="columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <a @click="addOrUpdate({ row: record, handle: 'update' })">修改</a>
                <a-popconfirm title="是否要禁用该门店？禁用后该门店所有操作员不可以再登录发起散客合同。禁用该门店，需要相关管理员审核后生效" ok-text="确认" cancel-text="取消"
                  @confirm="disable(0, record.oid)">
                  <a v-show="record.state === 1">禁用</a>
                </a-popconfirm>
                <a-popconfirm title="是否要启用该门店？启用后该门店所有操作员账号可以恢复使用散客合同。启用该门店，需要相关管理员审核后生效" ok-text="确认" cancel-text="取消"
                  @confirm="disable(1, record.oid)">
                  <a v-show="record.state === 0">启用</a>
                </a-popconfirm>
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
        <CommonTable :dataSource="tableData1.data" :columns="columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <a @click="auditStore">去审核</a>
                <a @click="">查看</a>
              </div>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025;">{{ tableData1.total }}</span> 个待审核的散客门店</div>
          <CommonPagination v-model:current="tableData1.param.pageNo" v-model:page-size="tableData.param.pageSize"
            :total="tableData1.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
        </div>
      </a-tab-pane>
      <template #rightExtra>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">创建新门店</a-button>
        <a-button type="primary" @click="detailsVisible = true">详情</a-button>
        <a @click="auditStore">去审核</a>
      </template>
    </a-tabs>
  </div>

  <CommonModal :title="submitTitle" v-model:visible="modalVisible" @cancel="cancel" @close="cancel" :conform-text="'提交'"
    @conform="submitStore">
    <a-form ref="teamRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }">
      <a-form-item name="username" label="所属旅行社">
        <a-select placeholder="请选择所属旅行社" v-model:value="form.business" allowClear>
          <a-select-option v-for="item in travelAgencyOption" :value="item.codeValue">{{
              item.name
          }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="username" label="门店名称">
        <a-input v-model:value="form.username" placeholder="请输入门店名称">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="门店地址">
        <a-input v-model:value="form.mobile" placeholder="请输入门店地址">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="门店电话">
        <a-input v-model:value="form.mobile" placeholder="请输入门店联系电话">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="门店负责人">
        <a-input v-model:value="form.mobile" placeholder="请输入门店负责人">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="负责人电话">
        <a-input v-model:value="form.mobile" placeholder="请输入负责人电话">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="备案号">
        <a-input v-model:value="form.mobile" placeholder="请输入备案号">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="授权码">
        <a-input v-model:value="form.mobile" placeholder="请输入授权码">
        </a-input>
      </a-form-item>
      <a-form-item name="isReduced" label="启用状态">
        <a-radio-group v-model:value="form.isReduced">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </CommonModal>
  <CommonModal title="门店详情" v-model:visible="detailsVisible" :conform-text="'确认'" @conform="detailsVisible = false"
    :is-cancel="false">
    <div class="table_box">
      <table class="change_table" cellpadding="16px" border="1">
        <tr class="row">
          <td class="key">门店名称</td>
          <td class="value">火车站店</td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <CommonModal :title="submitResultTitle" v-model:visible="submitResultVisible" :conform-text="'确认'"
    @conform="submitResultVisible = false" :is-cancel="false">
    <div v-if="isAdd">
      <div v-if="true">门店创建成功，系统将自动通知该旅行社企业管理员，继续给门店操作员创建账号</div>
      <div v-else>门店信息提交成功，系统将自动通知相关管理人员进行审核，请注意关注审核结果</div>
    </div>
    <div v-else>门店信息提交成功，系统将自动通知相关管理人员进行审核，请注意关注审核结果</div>
  </CommonModal>
  <CommonModal title="散客门店新开通审核" v-model:visible="auditVisible" @cancel="auditCancel" @close="auditCancel"
    :conform-text="'同意开通'" :cancel-text="'驳回'" @conform="auditConform"></CommonModal>
  <CommonModal title="散客门店信息修改审核" v-model:visible="changeVisible" @cancel="changeCancel" @close="changeCancel"
    :conform-text="'同意修改'" :cancel-text="'驳回'" @conform="changeConform"></CommonModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
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
      businessType: undefined,
      regionCode: undefined,
      auditStatus: undefined,
      name: undefined,
      provinceId: undefined,
      cityId: undefined,
      areaId: undefined
    },
  },
  tableData1: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      businessType: undefined,
      regionCode: undefined,
      auditStatus: undefined,
      name: undefined,
      provinceId: undefined,
      cityId: undefined,
      areaId: undefined
    },
  },
  modalVisible: false,
  detailsVisible: false,
  submitResultVisible: false,
  auditVisible: false,
  changeVisible: false,
  isAdd: true
});
const activeKey = ref('1')
const form = reactive({})
const teamRef = ref()
const formRules = {}
const enableOption = [
  { codeValue: 1, name: '已启用' },
  { codeValue: 0, name: '已禁用' }
]
const travelAgencyOption = []
const {
  tableData,
  tableData1,
  modalVisible,
  detailsVisible,
  submitResultVisible,
  isAdd,
  auditVisible,
  changeVisible
} = toRefs(state)
const submitResultTitle = computed(() => {
  if (state.isAdd) {
    if (true) {
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
    dataIndex: 'businessTypeName',
    key: 'businessTypeName',
  },
  {
    title: '门店名称',
    dataIndex: 'businessTypeName',
    key: 'businessTypeName',
  },
  {
    title: '门店地址',
    dataIndex: 'regionName',
    key: 'regionName',
  },
  {
    title: '门店电话',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '门店负责人',
    dataIndex: 'creditCode',
    key: 'creditCode',
  },
  {
    title: '负责人电话',
    dataIndex: 'creditCode',
    key: 'creditCode',
  },
  {
    title: '审核状态',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '启用状态',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}

const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
const onSearch = () => { }
const onQuery = () => {
  state.tableData.param.pageNo = 1;
  onSearch()
}
const cancel = () => {
  state.modalVisible = false
}
interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
  modalVisible.value = true
  if (handle === 'add') {
  } else if (handle === 'update') {
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
  state.submitResultVisible = true
}
const auditStore = () => { }
const auditCancel = () => { }
const auditConform = () => { }
const changeCancel = () => { }
const changeConform = () => { }
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
    left: 195px;
    top: 25px;
  }
}

.table-area {
  padding: unset;
}

.table_box {
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

    .key {
      width: 150px;
      background: rgba(245, 247, 250, 0.39);
    }

    .value {
      min-width: 300px;
    }
  }
}
</style>