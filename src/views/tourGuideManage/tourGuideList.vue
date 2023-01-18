<template>
  <CommonSearch>
		<SearchItem label="委派状态">
      <a-select ref="select" style="width: 200px" placeholder="请选择委派状态" v-model:value="state.tableData.param.signStatus">
        <a-select-option value="0">邀请中</a-select-option>
				<a-select-option value="1">已签约</a-select-option>
				<a-select-option value="-1">未签约</a-select-option>
			</a-select>
		</SearchItem>
		<SearchItem label="导游姓名">
			<a-input placeholder="请输入导游姓名" style="width: 200px" v-model:value="state.tableData.param.guideName"  />
		</SearchItem>
		<SearchItem label="导游电话">
			<a-input placeholder="请输入导游电话" style="width: 200px" v-model:value="state.tableData.param.phone" />
		</SearchItem>
    <SearchItem label="导游证号">
      <a-input placeholder="请输入导游证号" style="width: 200px" v-model:value="state.tableData.param.guideCertificateNo"/>
    </SearchItem>
		<template #button>
			<a-button @click="reset"  v-permission="'重置'">重置</a-button>
			<a-button style="margin-left:50px" v-permission="'查询'" @click="onSearch">查询</a-button>
		</template>
	</CommonSearch>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <!-- <a-button type="primary" style="margin-right:20px" v-permission="'导出'">导出</a-button> -->
      <a-button type="primary" style="margin-right:20px" v-permission="'一机管同步'" @click="synchronization">一机管同步</a-button>
      <a-button type="primary" @click="addTourGuide" v-permission="'手动签约'">手动签约</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <div class="action-btns">
						<a href="javascript:;" @click="viewProfile(record)" v-permission="'查看资料'">查看资料</a>
						<a href="javascript:;" @click="cancelSigning(record)"  v-permission="'取消签约'" v-if="record.signStatus ==1">取消签约</a>
				</div>
      </template>
    </template>
  </CommonTable>
  <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
    :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
  <BaseModal title="导游信息" v-model="modalVisible" :width="800">
    <div class="guide_state">{{ state.detailsData.signStatusName }}</div>
    <div class="check_info">
      <div class="row_info">
        <div>
          导游名称：
        </div>
        <div>
          {{ state.detailsData.guideName }}
        </div>
      </div>
      <div class="row_info">
        <div>
          导游证号：
        </div>
        <div>
          {{ state.detailsData.guideCertificateNo }}
        </div>
      </div>
      <div class="row_info">
        <div>
          身份证号：
        </div>
        <div>
          {{ state.detailsData.certificateNo }}
        </div>
      </div>
      <div class="row_info">
        <div>
          联系电话：
        </div>
        <div>
          {{ state.detailsData.phone }}
        </div>
      </div>
      <div class="row_info">
        <div>
          委派来源：
        </div>
        <div>
          {{ state.detailsData.signSource }}
        </div>
      </div>
      <div class="row_info">
        <div>
          导游星级：
        </div>
        <div>
          {{ state.detailsData.guideLevelName}}
        </div>
      </div>
      <div class="row_info">
        <div>
          性别：
        </div>
        <div>
          {{ state.detailsData.genderName }}
        </div>
      </div>
      <div class="row_info">
        <div>
          导游证有效期：
        </div>
        <div>
          {{ state.detailsData.signEndDate }}
        </div>
      </div>
      <div class="row_info">
        <div>
          委派到期时间：
        </div>
        <div>
          {{ state.detailsData.signEndDate }}
        </div>
      </div>
      <div class="row_info">
        <div>
          签约附件：
        </div>
        <div v-if="state.num>0">
          <Upload v-model="state.detailsData.signAttachmentList" :maxCount="state.num" disabled />
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <a-button type="primary" @click="cancel">取消</a-button>
    </template>
  </BaseModal>
  <BaseModal title="一键同步确认" v-model="synchronizationVisible" :width="400">
		<p>您即将发起委派导游数据同步，开始同步后系统将自动从【一部手机管旅游】平台获取贵社最新最全的合作导游增量数据。</p>
		<template v-slot:footer>
      <a-button type="primary" style="margin-right:20px" @click="synchronizationVisible=false">稍后再试</a-button>
      <a-button type="primary" @click="add">开始同步</a-button>
    </template>
	</BaseModal>
  <BaseModal title="导游取消委派确认" v-model="cancelVisible" :width="400">
		<p>确认取消该导游的委派关系吗？取消后，无法再给其派发带团任务。</p>
		<template v-slot:footer>
      <a-button type="primary" style="margin-right:20px" @click="cancelVisible=false">取消</a-button>
      <a-button type="primary" @click="cancelSubmit">确认取消</a-button>
    </template>
	</BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import Upload from '@/components/common/imageWrapper.vue';

const router = useRouter();
const route = useRoute()
const synchronizationVisible=ref(false)
const cancelVisible=ref(false)
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      guideCertificateNo:'',
      guideName:'',
      phone:'',
      signStatus:''
    },
  },
  detailsData:[] as any,
  modalVisible: false,
  cancelGuideId:'',
  num:0
});
const form = reactive({})
const tourGuideTypeOption = []
const { tableData, modalVisible } = toRefs(state)
const columns = [
  {
    title: '导游姓名',
    dataIndex: 'guideName',
    key: 'guideName',
  },
  {
    title: '导游电话',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '导游证号',
    dataIndex: 'guideCertificateNo',
    key: 'guideCertificateNo',
  },
  {
    title: '身份证号',
    dataIndex: 'certificateNo',
    key: 'certificateNo',
  },
  {
    title: '委派状态',
    dataIndex: 'signStatusName',
    key: 'signStatusName',
  },
  {
    title: '导游证有效期',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '委派到期时间',
    dataIndex: 'signEndDate',
    key: 'signEndDate',
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
const synchronization=()=>{
  synchronizationVisible.value=true
}
const onSearch = () => {
  api.travelGuideList(state.tableData.param).then((res:any)=>{
    state.tableData.data=res.content;
    state.tableData.total=res.total
    
  })
}
const reset=()=>{
  state.tableData.param.guideCertificateNo=''
  state.tableData.param.guideName=''
  state.tableData.param.phone=''
  state.tableData.param.signStatus=''
}
const add=()=>{
  api.travelSynchronizeGuide().then((res:any)=>{
    message.success(res)
    synchronizationVisible.value=false
    onSearch()
  })
}
const cancelSigning=(row:any)=>{
  state.cancelGuideId=row.oid
  cancelVisible.value=true
}
const cancelSubmit=()=>{
  let pW = new FormData();
	pW.append('guideId', state.cancelGuideId);
  api.cancelSign(pW).then((res:any)=>{
    message.success('取消成功')
    cancelVisible.value=false
    onSearch()
  })
}
const cancel = () => {
  state.modalVisible = false
  state.num=0
}
const addTourGuide = () => {
  router.push({
    name: 'addTourGuide'
  })
}
const viewProfile = (row:any) => {
  state.modalVisible = true
  state.detailsData=row
  if(row.signAttachmentList)
  {
    state.detailsData.signAttachmentList=row.signAttachmentList.toString()
    state.num=row.signAttachmentList.split(',').length
  }
}

const cancelDelegate = (id: string) => { }
const cancelInvitation = (id: string) => { }
onMounted(() => {
	onSearch();
});
</script>

<style scoped lang="scss">
.guide_state {
  width: 100%;
  text-align: right;
  font-size: 16px;
  font-family: Microsoft YaHei UI;
  font-weight: bold;
  color: #262626;
}

.check_info {

  .row_info {
    display: flex;
    margin-bottom: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei UI;
    font-weight: 400;
    color: #1E2226;
  }
}
</style>