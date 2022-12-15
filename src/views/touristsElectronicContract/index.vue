<template>
  <CommonSearch>
    <search-item label="合同状态">
      <a-select v-model:value="tableData.param.contractStatus" placeholder="请选择合同状态" allowClear>
        <a-select-option v-for="item in contractStatusOption" :value="item.codeValue" :key="item.codeValue">{{ item.name
        }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="合同编号">
      <a-input v-model:value="tableData.param.contractNo" placeholder="请输入合同编号" allowClear />
    </search-item>
    <search-item label="线路名称">
      <a-input v-model:value="tableData.param.lineName" placeholder="请输入线路名称" allowClear />
    </search-item>
    <template #button>
      <a-button @click="onQuery" v-permission="'查询'">查询</a-button>
    </template>
  </CommonSearch>
  <div class="add_box">
    <div>共 {{ tableData.total }} 条可用的电子合同</div>
    <div>
      <a-button type="primary" @click="addOrUpdate({ handle: 'add' })" v-permission="'新增'">新增</a-button>
    </div>
  </div>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'contractAmount'">
        {{ record.contractAmount / 100 }}
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="checkDetails(record.oid)" v-permission="'查看'">查看</a>
          <a @click="addOrUpdate({ row: record, handle: 'update' })" v-show="(record.contractStatus === 1)"
            v-permission="'编辑'">编辑</a>
          <a-popconfirm title="确认撤销这条数据吗？" ok-text="确认" cancel-text="取消" @confirm="withdraw(record.oid)"
            v-show="([2, 3].includes(record.contractStatus))">
            <a v-permission="'撤销'">撤销</a>
          </a-popconfirm>
        </div>
      </template>
    </template>
  </CommonTable>
  <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
    :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import api from '@/api';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue/es';
const router = useRouter();
const route = useRoute()
const goTo = (name: string, value?: any) => {
  /* let newObj: any = {
    oid: encodeURIComponent(JSON.stringify(value.oid)),
    businessType: encodeURIComponent(JSON.stringify(value.businessType)),
    fromPath: encodeURIComponent(JSON.stringify('apply')),
  } */
  router.push({
    name: name,
    query: value
  })
}
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      contractStatus: undefined,
      contractNo: '',
      lineName: '',
      pageNo: 1,
      pageSize: 10,
    },
  },
});
const { tableData } = toRefs(state)
const columns = [{
  title: '序号',
  dataIndex: 'index',
  key: 'index',
},
{
  title: '合同编号',
  dataIndex: 'contractNo',
  key: 'contractNo',
},
{
  title: '合同类型',
  dataIndex: 'contractTypeName',
  key: 'contractTypeName',
},
{
  title: '线路名称',
  dataIndex: 'lineNames',
  key: 'lineNames',
},
{
  title: '关联行程单号',
  dataIndex: 'itineraryNo',
  key: 'itineraryNo',
},
{
  title: '合同创建方',
  dataIndex: 'contractEstablish',
  key: 'contractEstablish',
},
{
  title: '合同创建人',
  dataIndex: 'creatorName',
  key: 'creatorName',
},
{
  title: '合同状态',
  dataIndex: 'contractStatusName',
  key: 'contractStatusName',
},
{
  title: '合同人数',
  dataIndex: 'touristPeopleNumber',
  key: 'touristPeopleNumber',
},
{
  title: '天数',
  dataIndex: 'contractDays',
  key: 'contractDays',
},
{
  title: '合同金额（元）',
  dataIndex: 'contractAmount',
  key: 'contractAmount',
},
{
  title: '录入时间',
  dataIndex: 'createTime',
  key: 'createTime',
},
{
  title: '合同生效时间',
  dataIndex: 'takeEffectTime',
  key: 'takeEffectTime',
},
{
  title: '操作',
  key: 'action',
  fixed: 'right',
  width: 208
}]
const contractStatusOption = [
  { codeValue: 1, name: '草稿' },
  { codeValue: 2, name: '已登记' },
  { codeValue: 3, name: '已签署' },
  { codeValue: 4, name: '已成团' },
  { codeValue: 5, name: '已出团' },
  { codeValue: 6, name: '旅行社解除' },
  { codeValue: 7, name: '已解除' },
]
const withdraw = async (id: number) => {
  const res = await api.revokeContract(id)
  if (res) {
    message.success('撤销成功!')
  } else {
    message.error('撤销失败！')
  }
}
const checkDetails = (id: number) => {
  goTo('electronicContratDetails', { id })
}
interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = async ({ row, handle }: addInterface) => {
  if (handle === 'add') {
    goTo('addElectronicContrat', { operation: handle })
  } else if (handle === 'update') {
    goTo('addElectronicContrat', { operation: handle, oid: row.oid })
  }
}
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}
const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
const onSearch = async () => {
  let { content, total } = await api.selectIndividualContractList(state.tableData.param)
  state.tableData.data = content
  state.tableData.total = total
}
const onQuery = () => {
  state.tableData.param.pageNo = 1;
  onSearch()
}
onActivated(() => {
  if (route.params?.isRefresh === '1') {
    onSearch()
  }
})
onMounted(() => {
  onSearch()
})
</script>

<style scoped lang="scss">
.add_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid black;
  margin: 0 20px 10px;
  padding: 20px 0;
}
</style>