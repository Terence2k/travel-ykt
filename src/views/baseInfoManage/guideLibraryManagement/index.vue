<template>

  <CommonSearch>
    <search-item label="导游搜索">
      <a-input v-model:value="tableData.param.searchKey" placeholder="搜索导游姓名、证件号码" allowClear />
    </search-item>
    <search-item label="导游星级">
      <a-select placeholder="请选择导游星级" v-model:value="tableData.param.guideLevel" allowClear>
        <a-select-option v-for="item in guideStartOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <template #button>
      <a-button @click="onQuery" v-permission="'查询'">查询</a-button>
    </template>
  </CommonSearch>
  <div class="content">
    <CommonTable :dataSource="tableData.data" :columns="columns">
      <template #button>
        <div class="tips">已同步 <span style="color:#de0025;">{{ tableData.total }}</span> 名一机管平台导游，最后一次同步时间：{{
            tableData.total
        }}
        </div>
        <a-button type="primary" @click="synchronizationVisible = true" v-permission="'一键同步'">一键同步</a-button>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
        </template>
        <template v-if="column.key === 'action'">
          <div class="action-btns">
            <a @click="checkDetails(record)" v-permission="'查看'">查看</a>
            <a @click="changGuideStatus(record.guideStatus, record)" v-permission="record.guideStatus === 1 ? '禁用' : '启用'">{{ record.guideStatus === 1 ? '禁用' : '启用'
            }}</a>
          </div>
        </template>
      </template>
    </CommonTable>
    <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
      :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
  </div>
  <CommonModal title="导游信息" v-model:visible="detailsVisible" @cancel="closeDetails" @close="closeDetails"
    :conform-text="'关闭'" :isCancel="false" @conform="closeDetails" width="50%">
    <div class="details_item">
      <span class="key">导游名称：</span>
      <span class="value">{{ detailsForm.guideName }}</span>
    </div>
    <div class="details_item">
      <span class="key">导游证号：</span>
      <span class="value">{{ detailsForm.guideCertificateNo }}</span>
    </div>
    <div class="details_item">
      <span class="key">身份证号：</span>
      <span class="value">{{ detailsForm.certificateNo }}</span>
    </div>
    <div class="details_item">
      <span class="key">联系电话：</span>
      <span class="value">{{ detailsForm.phone }}</span>
    </div>
    <div class="details_item">
      <span class="key">性别：</span>
      <span class="value">{{ detailsForm.genderName }}</span>
    </div>
    <div class="details_item">
      <span class="key">导游星级：</span>
      <span class="value">{{ detailsForm.guideLevelName }}</span>
    </div>
    <div class="details_item">
      <span class="key">一机管状态：</span>
      <span class="value">{{ detailsForm.yjgGuideStatusName }}</span>
    </div>
    <div class="details_item">
      <span class="key">导游证有效期：</span>
      <span class="value">{{ detailsForm.guideCertificateExpireTime }}</span>
    </div>
    <div class="details_item">
      <span class="key">一卡通同步时间：</span>
      <span class="value">{{ detailsForm.createTime }}</span>
    </div>
  </CommonModal>
  <CommonModal title="导游禁用确认" v-model:visible="disableVisible" @cancel="disableVisible = false"
    @close="disableVisible = false" :conform-text="'确认禁用'" @conform="disableConform">
    确认禁用该导游？禁用后，任何旅行社无法再向其发起委派邀请，也无法给其派发带团任务
  </CommonModal>
  <CommonModal title="导游启用确认" v-model:visible="enableVisible" @cancel="enableVisible = false"
    @close="enableVisible = false" :conform-text="'确认启用'" @conform="enableConform">
    确认启用该导游？启用后，可恢复旅行社向其发起委派邀请、给其派发带团任务。
  </CommonModal>
  <CommonModal title="操作成功" v-model:visible="disableResVisible" @cancel="disableResVisible = false"
    @close="disableResVisible = false" :conform-text="'确定'" @conform="disableResVisible = false" :isCancel="false">
    您已禁用导游 {{ guider }} 。如需重新启用，可重新点击【启用】。
  </CommonModal>
  <CommonModal title="操作成功" v-model:visible="enableResVisible" @cancel="enableResVisible = false"
    @close="enableResVisible = false" :conform-text="'确定'" @conform="enableResVisible = false" :isCancel="false">
    您已启用导游 {{ guider }} 。如需重新禁用，可重新点击【禁用】。
  </CommonModal>
  <CommonModal title="一键同步确认" v-model:visible="synchronizationVisible" @cancel="synchronizationVisible = false"
    @close="synchronizationVisible = false" :conform-text="'开始同步'" :cancel-text="'稍后再试'"
    @conform="synchronizationConform" :isCancel="false">
    您即将发起公共导游库数据同步，开始同步后系统将自动从【一部手机管旅游】平台获取最新最全的导游增量数据。
  </CommonModal>
  <CommonModal title="正在同步" v-model:visible="synchronizationWaitingVisible" :is-cancel="false" :is-conform="false"
    :maskClosable="false" :closable="false">
    正在从一机管平台同步导游数据…
  </CommonModal>
  <CommonModal title="同步成功" v-model:visible="successVisible" :is-cancel="false" :conform-text="'确定'"
    @conform="successVisible = false">
    {{ resInfo }}
  </CommonModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import api from '@/api';
const guideStartOption = [
  {
    codeValue: 1,
    name: '一星级'
  },
  {
    codeValue: 2,
    name: '二星级'
  },
  {
    codeValue: 3,
    name: '三星级'
  },
  {
    codeValue: 4,
    name: '四星级'
  },
  {
    codeValue: 5,
    name: '五星级'
  },
]
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      searchKey: undefined,
      guideLevel: undefined
    },
  },
});
const detailsVisible = ref(false)
const disableVisible = ref(false)
const enableVisible = ref(false)
const disableResVisible = ref(false)
const enableResVisible = ref(false)
const synchronizationVisible = ref(false)
const synchronizationWaitingVisible = ref(false)
const successVisible = ref(false)
const resInfo = ref('')
const { tableData } = toRefs(state)
const detailsForm = ref({
  guideName: '',
  guideCertificateNo: '',
  certificateNo: '',
  phone: '',
  genderName: '',
  guideLevelName: '',
  yjgGuideStatusName: '',
  guideCertificateExpireTime: '',
  createTime: '',
})
const oid = ref()
const guider = ref('')
const columns = [{
  title: '序号',
  dataIndex: 'index',
  key: 'index',
},
{
  title: '导游姓名',
  dataIndex: 'guideName',
  key: 'guideName',
},
{
  title: '身份证号',
  dataIndex: 'certificateNo',
  key: 'certificateNo',
},
{
  title: '导游证号',
  dataIndex: 'guideCertificateNo',
  key: 'guideCertificateNo',
},
{
  title: '联系电话',
  dataIndex: 'phone',
  key: 'phone',
},
{
  title: '导游星级',
  dataIndex: 'guideLevelName',
  key: 'guideLevelName',
},
{
  title: '性别',
  dataIndex: 'genderName',
  key: 'genderName',
},
{
  title: '导游证有效期',
  dataIndex: 'guideCertificateExpireTime',
  key: 'guideCertificateExpireTime',
},
{
  title: '一卡通同步时间',
  dataIndex: 'createTime',
  key: 'createTime',
},
{
  title: '一机管状态',
  dataIndex: 'yjgGuideStatusName',
  key: 'yjgGuideStatusName',
},
{
  title: '一卡通状态',
  dataIndex: 'guideStatusName',
  key: 'guideStatusName',
},
{
  title: '操作',
  key: 'action',
  fixed: 'right',
  width: 208
},]
const onQuery = () => {
  state.tableData.param.pageNo = 1;
  onSearch()
}
const onSearch = async () => {
  const { content, total } = await api.guideRepository(state.tableData.param)
  state.tableData.data = content
  state.tableData.total = total
}
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}
const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
const checkDetails = async (record: any) => {
  const {
    guideName,
    guideCertificateNo,
    certificateNo,
    phone,
    genderName,
    guideLevelName,
    yjgGuideStatusName,
    guideCertificateExpireTime,
    createTime
  } = record
  detailsForm.value = {
    guideName,
    guideCertificateNo,
    certificateNo,
    phone,
    genderName,
    guideLevelName,
    yjgGuideStatusName,
    guideCertificateExpireTime,
    createTime
  }
  detailsVisible.value = true
}
const closeDetails = () => {
  detailsVisible.value = false
  detailsForm.value = {}
}
const changGuideStatus = async (guideStatus: number, record: any) => {
  oid.value = record.oid
  guider.value = record.guideName
  if (guideStatus === 1) {
    disableVisible.value = true
  } else if (guideStatus === 0) {
    enableVisible.value = true
  }
}
const disableConform = async () => {
  disableVisible.value = false
  const params = {
    oid: oid.value,
    status: 0
  }
  let res = await api.editGuideStatus(params)
  if (res === null) {
    disableResVisible.value = true
    onSearch();
  }
}
const enableConform = async () => {
  enableVisible.value = false
  const params = {
    oid: oid.value,
    status: 1
  }
  let res = await api.editGuideStatus(params)
  if (res === null) {
    enableResVisible.value = true
    onSearch();
  }
}
const synchronizationConform = async () => {
  synchronizationWaitingVisible.value = true
  synchronizationVisible.value = false
  let res = await api.synchronizeYjgGuide()
  if (res) {
    synchronizationWaitingVisible.value = false
    successVisible.value = true
    resInfo.value = res
    onSearch();
  }
}
onMounted(() => {
  onSearch();
})
</script>

<style scoped lang="less">
.content {
  ::v-deep(.table-area .list-btn) {
    justify-content: space-between;
    align-items: center;
  }
}

.details_item {
  margin-bottom: 20px;
}
</style>