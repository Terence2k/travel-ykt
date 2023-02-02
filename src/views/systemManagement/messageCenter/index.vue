<template>
  <CommonSearch>
    <search-item label="公告类型">
      <a-select placeholder="请选择公告类型" v-model:value="tableData.param.noticeType" allowClear>
        <a-select-option v-for="item in typeOptions" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="公告名称">
      <a-input v-model:value="tableData.param.noticeName" placeholder="请输入公告名称" allowClear />
    </search-item>
    <template #button>
      <a-button @click="onQuery" v-permission="'查询'">查询</a-button>
    </template>
  </CommonSearch>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'noticeType'">
        {{ cmpNoticeTypeName(record.noticeType) }}
      </template>
      <template v-if="column.key === 'releaseDate'">
        {{ record.releaseDate || '/' }}
      </template>
      <template v-if="column.key === 'auditUserName'">
        {{ record.auditUserName || '/' }}
      </template>
      <template v-if="column.key === 'enclosureList'">
        <template v-if="record.enclosureList">
          <a :href="record.enclosureList" target="_blank"
            v-if="record.enclosureList.indexOf('.png') === -1 && record.enclosureList.indexOf('.jpg') === -1">{{
              getFileName(record.enclosureList)
            }}</a>
          <a-image :src="record.enclosureList" v-else />
        </template>
        <template v-else>
          /
        </template>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="checkDetails(record)" v-permission="'查看详情'">查看详情</a>
        </div>
      </template>
    </template>
  </CommonTable>
  <div class="buttom_box">
    <div>共 <span style="color:#de0025;">{{ tableData.total }}</span> 条消息</div>
    <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
      :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
  </div>
  <CommonModal title="公告详情" v-model:visible="modalVisible" @cancel="modalCancel" @close="modalCancel"
    :conform-text="'确认'" :is-cancel="false" @conform="modalCancel" width="50%">
    <div>
      <div class="head">
        {{ form.noticeName }}
        <div class="tag">
          {{ form.typeName }}
        </div>
      </div>
      <div class="details_item">
        <div class="key">发布单位</div>
        <div class="value">{{ form.creatorCompanyName }}</div>
      </div>
      <div class="details_item">
        <div class="key">发布时间</div>
        <div class="value">{{ form.releaseDate || '/' }}</div>
      </div>
      <div class="details_item">
        <div class="key">发布人</div>
        <div class="value">{{ form.creatorName }}</div>
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
    </div>
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
import { awsGetPreSignedUrl } from '@/utils/awsUpload';
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
      noticeName: undefined,
      noticeType: undefined,
      source: 1
    },
  },
  modalVisible: false,
});
const {
  tableData,
  modalVisible,
} = toRefs(state)
interface formType {
  noticeName?: string;
  typeName?: string;
  creatorCompanyName?: string;
  releaseDate?: string;
  creatorName?: string;
  enclosureList?: string;
  noticeContent?: string;
}
const form = ref<formType>({})
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '公告名称',
    dataIndex: 'noticeName',
    key: 'noticeName',
  },
  {
    title: '公告类型',
    dataIndex: 'noticeType',
    key: 'noticeType',
  },
  {
    title: '发布企业',
    dataIndex: 'creatorCompanyName',
    key: 'creatorCompanyName',
  },
  {
    title: '发布人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  },
  {
    title: '发布日期',
    dataIndex: 'releaseDate',
    key: 'releaseDate',
  },
  {
    title: '附件',
    dataIndex: 'enclosureList',
    key: 'enclosureList',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 100
  },
]
const typeOptions = ref<{
  codeValue: string,
  name: string
}[]>([])
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
const cmpNoticeTypeName = computed(() => (val: string) => {
  let res
  for (let i = 0, l = typeOptions.value.length; i < l; i++) {
    const element = typeOptions.value[i];
    if (element.codeValue === val) {
      res = element.name
      break
    }
  }
  return res
})
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}
const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}

const getData = (res: any): [] => {
  if (res?.length > 0) {
    return res.map(async (item: any) => {
      if (item.enclosure) {
        item.enclosureList = await awsGetPreSignedUrl(item.enclosure)
      } else {
        item.enclosureList = undefined
      }
      return item
    })
  } else {
    return []
  }
}
const onSearch = async () => {
  const { content, total } = await api.messageCenterPcNoticeList(state.tableData.param)
  state.tableData.data = await Promise.all(getData(content));
  state.tableData.total = total
}
const onQuery = () => {
  state.tableData.param.pageNo = 1;
  onSearch()
}
const modalCancel = () => {
  state.modalVisible = false
}
const checkDetails = async (record: any) => {
  modalVisible.value = true
  form.value = record
}
const getType = () => {
  return new Promise((resolve) => {
    api.dropDownQueryListChildByCodeValue('ANNOUNCEMENT_TYPE').then((res: any) => {
      typeOptions.value = res
      resolve(res)
    })
  })
}
onMounted(async () => {
  await getType()
  onSearch()
})
</script>

<style scoped lang="scss">
.buttom_box {
  padding-left: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head {
  position: relative;
  height: 62px;
  background: #3ab376;
  display: flex;
  justify-content: center;
  align-items: center;

  .tag {
    position: absolute;
    background: #5ebb8c;
    padding: 5px 30px;
    border-radius: 8px;
    top: 0;
    right: 0;
  }
}

.details_item {
  display: flex;
  margin: 20px 0;

  .key {
    width: 100px;
    text-align: left;
  }

  .notice_content {
    max-width: 400px;
    max-height: 200px;
    overflow: auto;
    padding-right: 5px;
    text-align: justify;
  }
}
</style>