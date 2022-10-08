<template>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'productsLength'">
        <a-popover title="必购项目">
          <template #content>
            <div v-show="record.products.length === 0">暂无必购项目</div>
            <div v-show="record.products.length !== 0">
              <p v-for="item in record.products">{{ item }}</p>
            </div>
          </template>
          <div style="color:#4197EF">{{ `${record.products.length}项` }}</div>
        </a-popover>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="addOrUpdate({ row:record, handle: 'update' })">编辑</a>
          <a-popconfirm title="是否删除该团队类型？删除后，旅行社将无法填写该类型的行程单，请谨慎操作！" ok-text="确认" cancel-text="取消"
            @confirm="deleteTeam(record.oid)">
            <a>删除</a>
          </a-popconfirm>
          <a @click="disable(0, record.oid)" v-show="record.state === 1">禁用</a>
          <a @click="disable(1, record.oid)" v-show="record.state === 0">启用</a>
        </div>
      </template>
    </template>
  </CommonTable>
  <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
    :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />

  <CommonModal :title="title" v-model:visible="modalVisible" @close="closeModal" @cancel="closeModal" @conform="save">
    <a-form ref="teamRef" :model="teamForm" :rules="formRules" name="addTeam" autocomplete="off"
      :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
      <a-form-item label="取个名字" name="name">
        <a-input v-model:value="teamForm.name" placeholder="给团队类型取个名字，20字以内…" />
      </a-form-item>
      <a-form-item label="必购项目">
        <a-transfer v-model:target-keys="targetKeys" class="tree-transfer" :data-source="dataSource"
          :render="(item: any) => item.title" :show-select-all="false" :titles="['必购项目', '必购项目已选中']">
          <template #children="{ direction, selectedKeys, onItemSelect }">
            <a-tree v-if="direction === 'left'" block-node checkable default-expand-all
              :checked-keys="[...selectedKeys, ...targetKeys]" :tree-data="tData" @check="
                (_, props) => {
                  onChecked(props, [...selectedKeys, ...targetKeys], onItemSelect);
                }
              " @select="
                (_, props) => {
                  onChecked(props, [...selectedKeys, ...targetKeys], onItemSelect);
                }
              " />
          </template>
        </a-transfer>
        <p class="tip">创建行程单时，是否有必购的项目？不选择即代表无必购项目。</p>
      </a-form-item>
      <a-form-item label="是否启用" name="state">
        <a-radio-group name="state" v-model:value="teamForm.state">
          <a-radio :value="1">立即启用</a-radio>
          <a-radio :value="0">暂不启用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </CommonModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import type { TransferProps } from 'ant-design-vue';
import { flatten, onChecked, format } from '@/views/baseInfoManage/teamTypeManagement/transfer'
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '团队类型名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '必购项目',
    dataIndex: 'productsLength',
    key: 'productsLength',
  },
  {
    title: '当前状态',
    dataIndex: 'stateName',
    key: 'stateName',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  },
  {
    title: '最后修改时间',
    dataIndex: 'lastUpdateTime',
    key: 'lastUpdateTime',
  },
  {
    title: '最后修改人',
    dataIndex: 'lastUpdaterName',
    key: 'lastUpdaterName',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
let isAdd = true
let normalProductIds: number[] = []
const teamRef = ref()
const teamForm = reactive({
  name: undefined,
  state: 1,
  oid: undefined
})
const formRules: any = {
  name: [{ required: true, trigger: 'blur', message: '名字不能为空' }],
  state: [{ required: true, trigger: 'blur', message: '是否启用' }],
};
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
    },
  }
});
const { tableData } = toRefs(state)
const modalVisible = ref<boolean>(false)
const title = ref<string>('新增团队类型')
/* 穿梭框相关 */
const targetKeys = ref<number[]>([]);
const tData: TransferProps['dataSource'] = [
  {
    key: '11',
    title: 'test11',
    children: [
      { key: 1, title: 'test1' },
      { key: 2, title: 'test2' },
    ],
  },
  {
    key: '12',
    title: 'test12',
    children: [
      { key: 5, title: 'test5' },
      { key: 6, title: 'test6' },
    ],
  },
  {
    key: '13',
    title: 'test13',
    children: [
      { key: 7, title: 'test7' },
    ],
  },
];
const dataSource = ref(flatten(tData));

interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
  modalVisible.value = true
  if (handle === 'add') {
    title.value = '新增团队类型'
    isAdd = true
  } else if (handle === 'update') {
    title.value = '编辑团队类型'
    const { name, state, productIds, oid } = row
    teamForm.name = name;
    teamForm.state = state;
    teamForm.oid = oid;
    targetKeys.value = productIds;
    normalProductIds = productIds;
    isAdd = false
  }
}
const deleteTeam = async (oid: string) => {
  let res = await api.updataTeamType({ oid, isDeleted: 1 })
  if (res === "删除成功!") {
    message.success(res)
    onSearch();
  } else {
    message.error(res)
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
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}
const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
const onSearch = async () => {
  let res = await api.selectTeamTypeList(state.tableData.param)
  state.tableData.data = res.content
  state.tableData.total = res.total
}
const closeModal = () => {
  modalVisible.value = false
  teamRef.value.resetFields()
  targetKeys.value = []
}
const teamTypeKeys = { parentKey: 'itemId', childrenKey: 'productId' }
const save = () => {
  teamRef.value.validate().then(async (val: any) => {
    if (isAdd) {
      let teamTypeItemBos = format(targetKeys.value, tData, teamTypeKeys);
      let res = await api.addTeamType({ ...toRaw(teamForm), teamTypeItemBos });
      if (res === "添加成功") {
        message.success('新增团队类型成功！')
        closeModal()
        onSearch();
      } else {
        message.error('新增团队类型失败！')
      }
    } else {
      let teamTypeItemBos
      if (targetKeys.value !== normalProductIds) {
        teamTypeItemBos = format(targetKeys.value, tData, teamTypeKeys);
      } else {
        teamTypeItemBos = undefined
      }
      let res = await api.updataTeamType({ ...toRaw(teamForm), teamTypeItemBos })
      if (res === "修改成功") {
        message.success('编辑团队类型成功！')
        closeModal()
        onSearch();
      } else {
        message.error('编辑团队类型失败！')
      }
    }
  }).catch((err: string) => {
    console.log(err);
  })
}
onMounted(() => {
  onSearch()
})
</script>

<style scoped lang="scss">
.tip {
  margin-top: 10px;
  font-size: 14px;
  font-family: Microsoft YaHei UI;
  font-weight: 400;
  color: #C8C9CC;
}
</style>