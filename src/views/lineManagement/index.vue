<template>
  <search v-model:value="tableData.param" @query="onQuery" v-show="activeKey === '1'"></search>
  <search v-model:value="tableData1.param" @query="onQuery" v-show="activeKey === '2'"></search>

  <div class="tabs_box">
    <a-badge :count="tableData1.total" class="rebadge" />
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="已审核">
        <CommonTable :dataSource="tableData.data" :columns="columns">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'storeName'">
              <span v-if="record.operatorRole === '中心操作员'">/</span>
              <span v-else>{{ record.storeName }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <a @click="checkDetails(record)">查看</a>
                <a @click="addOrUpdate({ row: record, handle: 'update' })">修改</a>
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
          <div>共 <span style="color:#de0025;">{{ tableData.total }}</span> 条线路</div>
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
            <template v-if="column.key === 'storeName'">
              <span v-if="record.operatorRole === '中心操作员'">/</span>
              <span v-else>{{ record.storeName }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <template v-if="isSuper">
                  <a @click="auditStore(record)">去审核</a>
                </template>
                <a @click="checkDetails(record)">查看</a>
              </div>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025;">{{ tableData1.total }}</span> 条线路</div>
          <CommonPagination v-model:current="tableData1.param.pageNo" v-model:page-size="tableData1.param.pageSize"
            :total="tableData1.total" @change="onHandleCurrentChange1" @showSizeChange="pageSideChange1" />
        </div>
      </a-tab-pane>
      <template #rightExtra>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">创建新路线</a-button>
        <a-button type="primary" @click="changeVisible = true">test</a-button>
      </template>
    </a-tabs>
  </div>

  <CommonModal :title="state.title" v-model:visible="modalVisible" @cancel="cancel" @close="cancel"
    :conform-text="'提交审核'" width="40%">
    <a-form ref="teamRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="labelCol"
      :wrapper-col="{ span: 24 }">
      <a-form-item name="lineName" label="线路名称">
        <a-input v-model:value="form.lineName" placeholder="请输入线路名称，30字以内" show-count :maxlength="30">
        </a-input>
      </a-form-item>
      <a-form-item name="lineDescribe" label="线路描述">
        <a-textarea v-model:value="form.lineDescribe" placeholder="请输入线路描述，300字以内" show-count :maxlength="300" />
      </a-form-item>
      <a-form-item label="适用范围">
        <a-form-item name="suitableRange" v-if="rolesLevel === 1">
          <a-radio-group v-model:value="form.suitableRange">
            <a-radio :style="radioStyle" :value="1">全部旅行社全部门店可用</a-radio>
            <a-radio :style="radioStyle" :value="2">指定旅行社</a-radio>
            <a-radio :style="radioStyle" :value="3">指定门店</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="suitableRange" v-if="rolesLevel === 2">
          <a-radio-group v-model:value="form.suitableRange">
            <a-radio :style="radioStyle" :value="2">本旅行社</a-radio>
            <a-radio :style="radioStyle" :value="3">指定门店</a-radio>
          </a-radio-group>
          <!-- 选择门店 -->
        </a-form-item>
        <a-form-item name="suitableRange" v-if="rolesLevel === 3">
          <a-radio-group v-model:value="form.suitableRange">
            <a-radio :style="radioStyle" :value="3">本门店</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-show="travelVisible">
          <a-select placeholder="选择旅行社" v-model:value="form.value" allowClear @change="">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue">{{
                item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-show="storeVisible">
          <a-select placeholder="选择门店" v-model:value="form.business" allowClear @change="() => { }">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue" :disabled="item.disabled">{{
                item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <!-- <a-form-item name="mobile" label="包含景区">
        <a-select placeholder="请选择一个景区" mode="multiple" v-model:value="form.scene" allowClear>
          <a-select-option v-for="item in sceneOption" :value="item.codeValue">{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="mobile" label="包含酒店">
        <a-select placeholder="请选择一个酒店" mode="multiple" v-model:value="form.scene" allowClear>
          <a-select-option v-for="item in sceneOption" :value="item.codeValue">{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item> -->
      <!-- <a-form-item v-for="(domain, index) in form.domains" :key="domain.key" :label="index === 0 ? '包含景区' : ' '"
        :colon="index === 0 ? true : false" :name="['domains', index, 'value']">
        <div style="display: flex">
          <a-select placeholder="请选择一个景区" v-model:value="domain.value" allowClear
            :class="{ mr8: form.domains.length > 1 }" @change="() => (sceneChange(form.domains, sceneOption1))">
            <a-select-option v-for="item in sceneOption1" :value="item.codeValue" :disabled="item.disabled">{{ item.name
            }}
            </a-select-option>
          </a-select>
          <MinusCircleOutlined v-if="form.domains.length > 1" class="dynamic-delete-button"
            @click="removeDomain(domain, form.domains, sceneOption1)" />
        </div>
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addDomain(form.domains)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item>
      <a-form-item v-for="(domain, index) in form.domains1" :key="domain.key" :label="index === 0 ? '包含酒店' : ' '"
        :colon="index === 0 ? true : false" :name="['domains1', index, 'value']">
        <div style="display: flex">
          <a-select placeholder="请选择一个酒店" v-model:value="domain.value" allowClear
            :class="{ mr8: form.domains1.length > 1 }" @change="() => (sceneChange(form.domains1, sceneOption2))">
            <a-select-option v-for="item in sceneOption2" :value="item.codeValue" :disabled="item.disabled">{{ item.name
            }}
            </a-select-option>
          </a-select>
          <MinusCircleOutlined v-if="form.domains1.length > 1" class="dynamic-delete-button"
            @click="removeDomain(domain, form.domains1, sceneOption2)" />
        </div>
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addDomain(form.domains1)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item> -->


      <div v-for="(domain, index) in form.domains" :key="domain.key" style="display: flex;">
        <a-form-item :label="index === 0 ? '选择线路内商家' : ' '" :colon="index === 0 ? true : false"
          :name="['domains', index, 'value']" :wrapper-col="{ offset: 0, span: 24 }" style="flex: 1">
          <a-select placeholder="请选择业态" v-model:value="domain.value" allowClear @change="">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue">{{
                item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label=" " :name="['domains', index, 'business']" :colon="false" :label-col="{ offset: 1, }"
          :wrapper-col="{ offset: 0, span: 24 }" :class="{ mr8: form.domains.length > 1 }" style="flex: 1">
          <a-select placeholder="请选择商家" v-model:value="domain.business" allowClear
            @change="() => { sceneChange(form.domains, businessOption(domain.value)) }">
            <a-select-option v-for="item in businessOption(domain.value)" :value="item.codeValue"
              :disabled="item.disabled">{{
                  item.name
              }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <MinusCircleOutlined v-if="form.domains.length > 1" class="dynamic-delete-button"
          @click="removeDomain(domain, form.domains, businessOption(domain.value))" />
      </div>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addDomain(form.domains)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item>

      <div v-for="(sight, index) in form.sights" :key="sight.key" style="display: flex;">
        <a-form-item :name="['sights', index, 'value']" :label="index === 0 ? '一口价' : ' '"
          :colon="index === 0 ? true : false" :wrapper-col="{ offset: 0, span: 24 }" style="flex: 1">
          <a-select v-model:value="sight.id" @change="sightsChange" allowClear>
            <a-select-option v-for="item in sceneOption3" :value="item.codeValue" :disabled="item.disabled">{{
                item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label=" " :name="['sights', index, 'price']" :colon="false" :label-col="{ offset: 1, }"
          :wrapper-col="{ offset: 0, span: 24 }" :class="{ mr8: form.sights.length > 1 }" style="flex: 1">
          <a-input v-model:value="sight.price" />
        </a-form-item>
        <MinusCircleOutlined v-if="form.sights.length > 1" @click="removeSights(sight, form.sights, sceneOption3)"
          class="dynamic-delete-button" />
      </div>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addSight(form.sights)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item>

      <a-form-item name="isReduced" label="启用状态">
        <a-radio-group v-model:value="form.isReduced">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </CommonModal>
  <CommonModal title="查看线路详情" v-model:visible="detailsVisible" :conform-text="'关闭'" @conform="detailsClose"
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
  <CommonModal title="审核线路" v-model:visible="auditVisible" @cancel="auditCancel" @close="failVisible = true"
    :conform-text="'通过'" :cancel-text="'驳回'" @conform="registerAuditVisible = true">
    提交审核时间：
    <div class="table_box">
      <table class="info_table" cellpadding="16px" border="1">
        <tr class="row" v-for="(value, key) in detailsKeys">
          <td class="key">{{ value }}</td>
          <td class="value">{{ detailsForm[key] }}</td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <CommonModal title="线路修改审核" v-model:visible="changeVisible" @cancel="changeCancel" @close="failVisible = true"
    :conform-text="'通过'" :cancel-text="'驳回'" @conform="registerAuditVisible = true" width="50%">
    <div class="table_box">
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
    </div>
  </CommonModal>
  <CommonModal :title="registerAuditTitle" v-model:visible="registerAuditVisible" @close="registerAuditVisible = false"
    @conform="registerAuditConform" :conform-text="'确定'" :key="registerAuditTitle">
    <span v-if="isRegiste">
      您即将批准 昆明康辉旅行社 创建的散客线路玉龙雪山1日游当日往返线路，审核通过，可用于发起散客电子合同、散客拼团。请仔细确认
    </span>
    <span v-else>
      您即将批准 昆明康辉旅行社 修改的散客线路玉龙雪山1日游当日往返线路，审核通过，可用于发起散客电子合同、散客拼团。请仔细确认
    </span>
  </CommonModal>
  <CommonModal :title="failTitle" v-model:visible="failVisible" @close="failClose" @cancel="failClose"
    @conform="failConform" :conform-text="'确定'" :key="failTitle">
    <a-form layout="vertical" ref="failFormRef" :model="failForm" :rules="failFormRules" name="fail-form"
      autocomplete="off" labelAlign="left">
      <a-form-item name="auditRemark" :label="`驳回 昆明康辉旅行社 的线路${isRegiste ? '创建' : '修改'}，填写驳回理由：`">
        <a-textarea v-model:value="failForm.auditRemark" placeholder="请输入驳回原因" :rows="2">
        </a-textarea>
      </a-form-item>
    </a-form>
  </CommonModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import search from '@/views/lineManagement/search.vue';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import { useRouter, useRoute } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
const router = useRouter();
const route = useRoute();
interface Domain {
  value: string | undefined | number;
  business: string | undefined | number;
  key: number;
}
interface Sights {
  key: number;
  price: string | undefined | number;
  id: string | undefined | number;
}
const state = reactive({
  title: '创建散客拼团线路',
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      suitableRange: undefined,
      lineName: undefined,
      auditStatus: 1, // 已审核
    },
  },
  tableData1: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      suitableRange: undefined,
      lineName: undefined,
      auditStatus: 2, // 待审核
    },
  },
  rolesLevel: 3, // 1:文旅局超管、一卡通超管,2:旅行社超管、中心操作员,3:门店操作员
  modalVisible: false,
  detailsVisible: false,
  auditVisible: false,
  failVisible: false,
  registerAuditVisible: false,
  changeVisible: false,
  isRegiste: true,
});
const {
  tableData,
  tableData1,
  rolesLevel,
  modalVisible,
  detailsVisible,
  auditVisible,
  failVisible,
  registerAuditVisible,
  changeVisible,
  isRegiste,
} = toRefs(state)
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});
const activeKey = ref('1')
type detailsKeysType = {
  lineName?: string,
  lineDescribe?: string,
  creatorName?: string,
  suitableRangeName?: string,
  hotelCompanyName?: string,
  ticketCompanyName?: string,
  priceTypeName?: string,
  enableSatusName?: string,
  auditStatusName?: string,
}
const detailsForm = ref<detailsKeysType>({})
const detailsKeys = {
  lineName: '线路名称',
  lineDescribe: '线路描述',
  creatorName: '创建人',
  suitableRangeName: '适用范围',
  hotelCompanyName: '包含酒店',
  ticketCompanyName: '包含景区',
  priceTypeName: '一口价',
  enableSatusName: '启用状态',
  auditStatusName: '审核状态',
}
const compareKeys = {
  operatorName: '操作员姓名',
  operatorPhone: '操作员电话',
  certificateNo: '证件号',
  enableSatusName: '启用状态',
}
const form = reactive({
  domains: [{
    value: undefined,
    business: undefined,
    key: Date.now(),
  }],
  domains1: [{
    value: undefined,
    key: Date.now(),
  }],
  sights: [{
    id: undefined,
    price: undefined,
    key: Date.now(),
  }]
})
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
const failFormRules: Record<string, Rule[]> = {
  auditRemark: [{ required: true, trigger: 'blur', message: '请输入驳回原因' }],
}
const teamRef = ref()
const failFormRef = ref()
const formRules = {}
const newArrList = ref<any>({})
const oldArrList = ref<any>({})
const changeKeys = ref<string[]>([])
const labelCol = { style: { width: '110px' } }
const enableOption = [
  { codeValue: 0, name: '本社全部部门可用' },
  { codeValue: 1, name: '仅创建门店可用' },
]
const businessTypeOption = [
  { codeValue: 0, name: '景区' },
  { codeValue: 1, name: '酒店' },
  { codeValue: 2, name: '餐厅' },
]
const sceneOption = ref([
  { codeValue: 0, markValue: '0_0', name: '景区1' },
  { codeValue: 1, markValue: '0_1', name: '景区2' },
  { codeValue: 2, markValue: '0_2', name: '景区3' },
  { codeValue: 3, markValue: '0_3', name: '景区4' },
  { codeValue: 4, markValue: '0_4', name: '景区5' },
  { codeValue: 5, markValue: '0_5', name: '景区6' },
  { codeValue: 6, markValue: '0_6', name: '景区7' },
  { codeValue: 7, markValue: '0_7', name: '景区8' },
  { codeValue: 8, markValue: '0_8', name: '景区9' },
])
const restaurantOption = ref([
  { codeValue: 0, markValue: '2_0', name: '餐厅1' },
  { codeValue: 1, markValue: '2_1', name: '餐厅2' },
  { codeValue: 2, markValue: '2_2', name: '餐厅3' },
  { codeValue: 3, markValue: '2_3', name: '餐厅4' },
  { codeValue: 4, markValue: '2_4', name: '餐厅5' },
  { codeValue: 5, markValue: '2_5', name: '餐厅6' },
  { codeValue: 6, markValue: '2_6', name: '餐厅7' },
  { codeValue: 7, markValue: '2_7', name: '餐厅8' },
  { codeValue: 8, markValue: '2_8', name: '餐厅9' },
])
const sceneOption1 = ref([
  { codeValue: 0, name: '景区1' },
  { codeValue: 1, name: '景区2' },
  { codeValue: 2, name: '景区3' },
  { codeValue: 3, name: '景区4' },
  { codeValue: 4, name: '景区5' },
  { codeValue: 5, name: '景区6' },
  { codeValue: 6, name: '景区7' },
  { codeValue: 7, name: '景区8' },
  { codeValue: 8, name: '景区9' },
])
const hotelOption = ref([
  { codeValue: 0, markValue: '1_0', name: '酒店1' },
  { codeValue: 1, markValue: '1_1', name: '酒店2' },
  { codeValue: 2, markValue: '1_2', name: '酒店3' },
  { codeValue: 3, markValue: '1_3', name: '酒店4' },
  { codeValue: 4, markValue: '1_4', name: '酒店5' },
  { codeValue: 5, markValue: '1_5', name: '酒店6' },
  { codeValue: 6, markValue: '1_6', name: '酒店7' },
  { codeValue: 7, markValue: '1_7', name: '酒店8' },
  { codeValue: 8, markValue: '1_8', name: '酒店9' },
])
const sceneOption3 = ref([
  { codeValue: 0, name: '成人价' },
  { codeValue: 1, name: '老人价' },
  { codeValue: 2, name: '儿童价' },
  { codeValue: 3, name: '会员一口价' },
])
const businessOption = computed(() => (val: number | undefined) => {
  if (val === 0) {
    return sceneOption.value
  } else if (val === 1) {
    return hotelOption.value
  } else if (val === 2) {
    return restaurantOption.value
  } else {
    return []
  }
})
const registerAuditTitle = computed(() => {
  return isRegiste.value ? '二次确认' : '二次确认'
})
const failTitle = computed(() => {
  return isRegiste.value ? '驳回确认' : '驳回确认'
})
const travelVisible = computed(() => {
  if (rolesLevel.value === 1) {
    if (form.suitableRange === 3) {
      return true
    }
  } else {
    return false
  }
})
const storeVisible = computed(() => {
  if (rolesLevel.value === 1) {
    if (form.suitableRange === 3) {
      return true
    }
  } else {
    return false
  }
})
const tabsChange = () => { };
const checkDetails = async (record: any) => {
};
const detailsClose = () => {
  state.detailsVisible = false
  detailsForm.value = {}
}
const auditCancel = () => {
  state.auditVisible = false
  detailsForm.value = {}
}
const registerAuditConform = () => { }
const failConform = async () => {
  // 审核不通过
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
const changeCancel = () => {
  newArrList.value = {}
  oldArrList.value = {}
  changeKeys.value = []
}



const setOption = () => {
  sceneOption1.value.forEach(element => {
    element.disabled = false
  });
}
setOption()
const sightsChange = () => {
  let selected: any[] = []
  form.sights.forEach(item => {
    if (item.id !== undefined) {
      selected.push(item.id)
    }
  })
  if (selected.toString()) {
    if (selected.includes(3)) {
      sceneOption3.value.forEach(element => {
        element.disabled = true
      });
    } else {
      sceneOption3.value.forEach(element => {
        if (selected.includes(element.codeValue)) {
          element.disabled = true
        } else {
          if (element.codeValue === 3) {
            element.disabled = true
          } else {
            element.disabled = false
          }
        }
      });
    }
  } else {
    sceneOption3.value.forEach(element => {
      element.disabled = false
    });
  }
}
const sceneChange = (domainsList: Domain[], options: any[]) => {
  let selected: any[] = []
  selected = domainsList.map(item => {
    if (item.business !== undefined) {
      return item.value + '_' + item.business
    }
  })
  options.forEach(element => {
    if (selected.includes(element.markValue)) {
      element.disabled = true
    } else {
      element.disabled = false
    }
  });
}
const sceneDeselect = (val: number | string | undefined, options: any[]) => {
  if (val === undefined) return
  for (let i = 0, l = options.length; i < l; i++) {
    const element = options[i];
    if (element.codeValue === val) {
      options[i].disabled = false
      break
    }
  }
}

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '线路名称',
    dataIndex: 'lineName',
    key: 'lineName',
  },
  {
    title: '一口价',
    dataIndex: 'priceTypeName',
    key: 'priceTypeName',
  },
  {
    title: '包含景区',
    dataIndex: 'ticketCompanyName',
    key: 'ticketCompanyName',
  },
  {
    title: '包含酒店',
    dataIndex: 'hotelCompanyName',
    key: 'hotelCompanyName',
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  },
  {
    title: '适用范围',
    dataIndex: 'suitableRangeName',
    key: 'suitableRangeName',
  },
  {
    title: '启用状态',
    dataIndex: 'enableSatusName',
    key: 'enableSatusName',
  },
  {
    title: '审核结果',
    dataIndex: 'auditStatusName',
    key: 'auditStatusName',
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
    title: '线路名称',
    dataIndex: 'lineName',
    key: 'lineName',
  },
  {
    title: '一口价',
    dataIndex: 'priceTypeName',
    key: 'priceTypeName',
  },
  {
    title: '包含景区',
    dataIndex: 'ticketCompanyName',
    key: 'ticketCompanyName',
  },
  {
    title: '包含酒店',
    dataIndex: 'hotelCompanyName',
    key: 'hotelCompanyName',
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  },
  {
    title: '适用范围',
    dataIndex: 'suitableRangeName',
    key: 'suitableRangeName',
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    key: 'submitTime',
  },
  {
    title: '审核类型',
    dataIndex: 'auditType',
    key: 'auditType',
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
const onHandleCurrentChange1 = (val: number) => {
  state.tableData1.param.pageNo = val;
  onAuditSearch();
}
const pageSideChange1 = (current: number, size: number) => {
  state.tableData1.param.pageSize = size;
  onAuditSearch();
}
const onSearch = () => { }
const onAuditSearch = () => { }
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
    state.title = '创建散客拼团线路'
  } else if (handle === 'update') {
    state.title = '编辑散客拼团线路'
  }
}
const addDomain = (domainsList: Domain[]) => {
  domainsList.push({
    value: undefined,
    business: undefined,
    key: Date.now(),
  });
};
const addSight = (sightsList: Sights[]) => {
  sightsList.push({
    price: undefined,
    id: undefined,
    key: Date.now(),
  });
};
const removeDomain = (item: Domain, domainsList: Domain[], options: any[]) => {
  let index = domainsList.indexOf(item);
  if (index !== -1) {
    domainsList.splice(index, 1);
  }
  sceneChange(domainsList, options)
  // sceneDeselect(item.value, options)
};
const removeSights = (item: Sights, domainsList: Sights[], options: any[]) => {
  let index = domainsList.indexOf(item);
  if (index !== -1) {
    domainsList.splice(index, 1);
  }
  sightsChange()
};
const getUserInfo = () => {
  let userInfo: any = window.localStorage.getItem('userInfo');
  userInfo = JSON.parse(userInfo);
  const { sysCompany: { oid }, sysRoles } = userInfo
  const roleCode = sysRoles.map((item: any) => {
    // 文旅局超管、一卡通超管、旅行社超管、中心操作员、门店操作员
    if (['CULTURE_BUREAU_SUPER_ADMIN', 'PLATFORM_SUPER_ADMIN', 'TRAVEL_SUPER_ADMIN', 'CENTER_OPERATOR', 'OUTLET_OPERATOR'].includes(item.roleCode)) {
      return item.roleCode
    }
  })
  if (roleCode.includes('CULTURE_BUREAU_SUPER_ADMIN') || roleCode.includes('PLATFORM_SUPER_ADMIN')) {
    // 文旅局超管、一卡通超管
    state.rolesLevel = 1
  } else if (roleCode.includes('TRAVEL_SUPER_ADMIN') || roleCode.includes('CENTER_OPERATOR')) {
    // 旅行社超管、中心操作员
    state.rolesLevel = 2
  } else if (roleCode.includes('OUTLET_OPERATOR')) {
    // 门店操作员
    state.rolesLevel = 3
  }
}
onMounted(() => {
  getUserInfo()
})
</script>

<style scoped lang="scss">
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
  padding: 0 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.mr8 {
  margin-right: 8px;
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