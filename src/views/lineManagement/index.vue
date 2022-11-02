<template>
  <CommonSearch>
    <search-item label="适用范围">
      <a-select placeholder="请选择适用范围" v-model:value="tableData.param.businessType" allowClear>
        <a-select-option v-for="item in enableOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="线路名称">
      <a-input v-model:value="tableData.param.name" placeholder="请输入线路名称" />
    </search-item>
    <template #button>
      <a-button @click="onQuery">查询</a-button>
    </template>
  </CommonSearch>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">创建新路线</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="addOrUpdate({ row: record, handle: 'update' })">修改</a>
          <a @click="">禁用</a>
          <a @click="">启用</a>
        </div>
      </template>
    </template>
  </CommonTable>
  <div class="buttom_box">
    <div>共 <span style="color:#de0025;">{{ tableData.total }}</span> 条线路</div>
    <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
      :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
  </div>
  <CommonModal :title="state.title" v-model:visible="modalVisible" @cancel="cancel" @close="cancel"
    :conform-text="'提交审核'" width="40%">
    <a-form ref="teamRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="labelCol"
      :wrapper-col="{ span: 24 }">
      <a-form-item name="username" label="线路名称">
        <a-input v-model:value="form.username" placeholder="请输入线路名称">
        </a-input>
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
      <a-form-item v-for="(domain, index) in form.domains" :key="domain.key" :label="index === 0 ? '包含景区' : ' '"
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
      </a-form-item>

      <div v-for="(sight, index) in form.sights" :key="sight.key" style="display: flex;">
        <a-form-item :name="['sights', index, 'value']" :label="index === 0 ? '一口价' : ' '"
          :colon="index === 0 ? true : false" :wrapper-col="{ offset: 0, span: 24 }" style="flex: 1">
          <a-select v-model:value="sight.id" @change="sightsChange" allowClear>
            <a-select-option v-for="item in sceneOption3" :value="item.codeValue" :disabled="item.disabled">{{ item.name
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
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute()
interface Domain {
  value: string | undefined | number;
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
      businessType: undefined,
      regionCode: undefined,
      auditStatus: undefined,
      name: undefined,
      provinceId: undefined,
      cityId: undefined,
      areaId: undefined
    },
  },
  modalVisible: false
});
const form = reactive({
  domains: [{
    value: undefined,
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
const teamRef = ref()
const formRules = {}
const labelCol = { style: { width: '65px' } }
const enableOption = [
  { codeValue: 0, name: '本社全部部门可用' },
  { codeValue: 1, name: '仅创建门店可用' },
]
const sceneOption = [
  { codeValue: 0, name: '景区1' },
  { codeValue: 1, name: '景区2' },
  { codeValue: 2, name: '景区3' },
  { codeValue: 3, name: '景区4' },
  { codeValue: 4, name: '景区5' },
  { codeValue: 5, name: '景区6' },
  { codeValue: 6, name: '景区7' },
  { codeValue: 7, name: '景区8' },
  { codeValue: 8, name: '景区9' },
]
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
const sceneOption2 = ref([
  { codeValue: 0, name: '酒店1' },
  { codeValue: 1, name: '酒店2' },
  { codeValue: 2, name: '酒店3' },
  { codeValue: 3, name: '酒店4' },
  { codeValue: 4, name: '酒店5' },
  { codeValue: 5, name: '酒店6' },
  { codeValue: 6, name: '酒店7' },
  { codeValue: 7, name: '酒店8' },
  { codeValue: 8, name: '酒店9' },
])
const sceneOption3 = ref([
  { codeValue: 0, name: '成人价' },
  { codeValue: 1, name: '老人价' },
  { codeValue: 2, name: '儿童价' },
  { codeValue: 3, name: '会员一口价' },
])
const setOption = () => {
  sceneOption1.value.forEach(element => {
    element.disabled = false
  });
}
setOption()
const sightsChange = () => {
  let selected: any[] = []
  selected = form.sights.map(item => {
    if (item.id !== undefined) {
      return item.id
    }
  })
  console.log(selected.toString(), '$$$$$$');

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
    if (item.value !== undefined) {
      return item.value
    }
  })
  options.forEach(element => {
    if (selected.includes(element.codeValue)) {
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
const { tableData, modalVisible } = toRefs(state)
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '线路',
    dataIndex: 'businessTypeName',
    key: 'businessTypeName',
  },
  {
    title: '一口价',
    dataIndex: 'regionName',
    key: 'regionName',
  },
  {
    title: '包含景区',
    dataIndex: 'creditCode',
    key: 'creditCode',
  },
  {
    title: '包含酒店',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '创建方',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '适用范围',
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
    state.title = '创建散客拼团线路'
  } else if (handle === 'update') {
    state.title = '编辑散客拼团线路'
  }
}
const addDomain = (domainsList: Domain[]) => {
  domainsList.push({
    value: undefined,
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
  sceneDeselect(item.value, options)
};
const removeSights = (item: Sights, domainsList: Sights[], options: any[]) => {
  let index = domainsList.indexOf(item);
  if (index !== -1) {
    domainsList.splice(index, 1);
  }
  sightsChange()
};
</script>

<style scoped lang="scss">
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
</style>