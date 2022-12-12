<template>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <a-button type="primary" @click="addOrUpdate({ handle: 'add' })" v-permission="'新增'">新增</a-button>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'productsLength'">
        <a-popover title="必购项目">
          <template #content>
            <p v-for="(item, index) in record.productItems" :key="index">{{ item }}</p>
          </template>
          <div style="color:#4197EF" v-show="record.productItems && record.productItems.length !== 0">{{
              `${record.productItems && record.productItems.length}项`
          }}
          </div>
        </a-popover>
        <div v-show="!record.productItems">/</div>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="addOrUpdate({ row: record, handle: 'update' })" v-permission="'编辑'">编辑</a>
          <a-popconfirm title="是否删除该团队类型？删除后，旅行社将无法填写该类型的行程单，请谨慎操作！" ok-text="确认" cancel-text="取消"
            @confirm="deleteTeam(record.oid)">
            <a v-permission="'删除'">删除</a>
          </a-popconfirm>
          <a-popconfirm title="是否禁用当前团队类型？禁用后，创建行程单时无法再选中此类型。" ok-text="确认" cancel-text="取消"
            @confirm="disable(0, record.oid)">
            <a v-show="record.state === 1" v-permission="'禁用'">禁用</a>
          </a-popconfirm>
          <a-popconfirm title="是否启用当前团队类型？启用后，创建行程单时可以选中此类型。" ok-text="确认" cancel-text="取消"
            @confirm="disable(1, record.oid)">
            <a v-show="record.state === 0" v-permission="'启用'">启用</a>
          </a-popconfirm>
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
        <a-transfer v-model:target-keys="checkedKeys" class="tree-transfer" :data-source="dataSource"
          :render="(item: any) => item.title" :show-select-all="false" @change="transferChange"
          :titles="['必购项目', '必购项目已选中']" :list-style="{
            width: '300px',
            height: '350px',
          }">
          <template #children="{ direction, selectedKeys, onItemSelect }">
            <a-tree v-if="direction === 'left'" block-node checkable check-strictly default-expand-all
              :checked-keys="[...selectedKeys, ...checkedKeys]" :tree-data="tData" @check="
              (_, props) => {
                onChecked(props, [...selectedKeys, ...checkedKeys], onItemSelect);
              }" @select="
  (_, props) => {
    onChecked(props, [...selectedKeys, ...checkedKeys], onItemSelect);
  }" />
          </template>
        </a-transfer>
        <p class="tip">创建行程单时，是否有必购的项目？不选择即代表无必购项目。</p>
        <p class="tip" style="color:#ff4d4f">勾选父节点表示选择任意子项目，而非全选</p>
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
import type { TransferProps, TreeProps } from 'ant-design-vue';
import { flatten, format } from '@/views/baseInfoManage/teamTypeManagement/transfer'
import { any } from 'vue-types';
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
// let normalProductIds: number[] = []
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

let tData = ref<TransferProps['dataSource']>([])
let dataSource = ref<TransferProps['dataSource']>([])
/* 穿梭框相关 */
const checkedKeys = ref<any[]>([]);
const selectedKeys1 = ref<any[]>([]);
// 记录被选中父元素key
let checkedParentKeys: (string | number)[] = []
// 如果父元素被选中则子元素不能选中，父元素取消选中子元素可被选中
function disabledChildKeys(data: TransferProps['dataSource'], parentKeys: any[] = []) {
  data.forEach(item => {
    // 子元素不可选
    if (parentKeys.includes(item.key)) {
      item.children.forEach((citem: any) => {
        citem['disabled'] = true;
      });
    } else {
      // 子元素可选
      item.children.forEach((citem: any) => {
        citem['disabled'] = false;
      });
    }
  });
  return data as TransferProps['dataSource'];
}
// 如果右侧穿梭框取消父元素选中，则启用父元素下禁用的子选项
function enableChildKeys(data: TransferProps['dataSource'], parentKeys: any[] = []) {
  data.forEach(item => {
    if (parentKeys.includes(item.key)) {
      // 更新父元素列表，取消选中右侧穿梭框的父元素，删除父元素列表中的元素
      let index = checkedParentKeys.indexOf(item.key as string)
      if (index !== -1) {
        checkedParentKeys.splice(index, 1)
      }
      item.children.forEach((citem: any) => {
        citem['disabled'] = false;
      });
    }
  });
  return data as TransferProps['dataSource'];
}
// 获取选中的父元素
function setChosedKeys(checked: boolean, eventKey: any) {
  if (checked) {
    checkedParentKeys.push(eventKey)
  } else {
    // 如果key选中到穿梭框右侧则不能删除
    if (checkedKeys.value.includes(eventKey)) return
    let index = checkedParentKeys.indexOf(eventKey)
    if (index !== -1) {
      checkedParentKeys.splice(index, 1)
    }
  }
}
function isChecked(selectedKeys: (string | number)[], eventKey: any) {
  return selectedKeys.indexOf(eventKey) !== -1;
}
const onChecked = (
  e: Parameters<TreeProps['onCheck']>[1] | Parameters<TreeProps['onSelect']>[1],
  checkedKeys: any[],
  onItemSelect: (n: any, c: boolean) => void,
) => {
  const { checked, node: { eventKey } } = e
  if (e.node.children) {
    setChosedKeys(checked, eventKey)
    tData.value = disabledChildKeys(tData.value, checkedParentKeys);
  }
  onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
};
const transferChange = (targetKeys: any[], direction: string, moveKeys: (string | number)[]) => {
  if (direction === 'left') {
    tData.value = enableChildKeys(tData.value, moveKeys)
  }
  // 如果选中的左侧父元素添加到右侧，和右边的子元素存在父子关系则删除对应的子元素（全选）
  if (direction === 'right') {
    for (let j = 0, l = tData.value?.length!; j < l; j++) {
      const item = tData.value[j];
      let index = moveKeys.indexOf(item.key)
      if (index === -1) {
        continue
      } else {
        for (let k = 0, l = item.children.length; k < l; k++) {
          const citem = item.children[k];
          let cindex = checkedKeys.value.indexOf(citem.key)
          if (cindex !== -1) {
            checkedKeys.value.splice(cindex, 1)
          } else {
            continue
          }
        }
      }
    }
  }
  /* if (targetKeys.length > 0) {
    auditRef.value.resetFields('sysAuditNodeVos')
  } */
  nextTick(() => {
    if (direction === 'right') {
      setTitle()
    }
  })
}// 设置穿梭框右侧的元素名称
const setTitle = () => {
  const childrenList = Array.from(document.querySelectorAll('.ant-transfer-list-content-item-text'))
  if (childrenList.length === 0) return
  /* for (let i = 0, l = checkedKeys.value.length; i < l; i++) {
    const item = checkedKeys.value[i];
    for (let j = 0, l = tData.value?.length!; j < l; j++) {
      const citem = tData.value[j];
      for (let k = 0, l = citem.children.length; k < l; k++) {
        const element = citem.children[k];
        if (item === element.key) {
          childrenList[i].innerHTML = `${citem.title}：${element.title}`
        }
      }
    }
  } */

  for (let j = 0, l = tData.value?.length!; j < l; j++) {
    const citem = tData.value[j];
    for (let k = 0, l = citem.children.length; k < l; k++) {
      const element = citem.children[k];
      if (checkedKeys.value.includes(element.key)) {
        const i = checkedKeys.value.indexOf(element.key)
        childrenList[i].innerHTML = `${citem.title}：${element.title}`
      }
    }
  }
}

interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = async ({ row, handle }: addInterface) => {
  modalVisible.value = true
  if (handle === 'add') {
    title.value = '新增团队类型'
    isAdd = true
  } else if (handle === 'update') {
    title.value = '编辑团队类型'
    const { name, state, oid } = row
    teamForm.name = name;
    teamForm.state = state;
    teamForm.oid = oid;
    let res = await api.findEditTeamTypeById(oid)
    let productIds: any[] = []
    res?.forEach((item: any) => {
      if (item?.products) {
        item.products.forEach((citem: any) => {
          productIds.push(item.itemId + '_' + citem.productId)
        })
      } else {
        productIds.push(item.itemId)
      }
    })
    tData.value?.map((item: any) => {
      if (productIds.includes(item.key)) {
        checkedParentKeys.push(productIds[productIds.indexOf(item.key)])
      }
    })
    tData.value = disabledChildKeys(tData.value, checkedParentKeys);
    checkedKeys.value = productIds;
    // normalProductIds = productIds;
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
  if (res) {
    state.tableData.data = res.content
    state.tableData.total = res.total
  } else {
    state.tableData.data = []
    state.tableData.total = 0
  }
}
const closeModal = () => {
  modalVisible.value = false
  teamRef.value.resetFields()
  teamForm.name = undefined
  teamForm.oid = undefined
  teamForm.state = 1
  checkedKeys.value = []
  checkedParentKeys.splice(0, checkedParentKeys.length)
  tData.value = disabledChildKeys(tData.value, checkedParentKeys);
}
const save = () => {
  teamRef.value.validate().then(async (val: any) => {
    let teamTypeItemBos = format(checkedKeys.value, tData.value);
    if (isAdd) {
      let res = await api.addTeamType({ ...toRaw(teamForm), teamTypeItemBos });
      if (res === "添加成功") {
        message.success('新增团队类型成功！')
        closeModal();
        onSearch();
      } else {
        message.error('新增团队类型失败！')
      }
    } else {
      /* let teamTypeItemBos
      // 判断是否修改必购项目如果没有修改则不传该参数
      if (checkedKeys.value.toString() !== normalProductIds.toString()) {
        teamTypeItemBos = format(checkedKeys.value, tData.value);
      } else {
        teamTypeItemBos = undefined
      } */
      let res = await api.updataTeamType({ ...toRaw(teamForm), teamTypeItemBos })
      if (res === "修改成功") {
        message.success('编辑团队类型成功！')
        closeModal();
        onSearch();
      } else {
        message.error('编辑团队类型失败！')
      }
    }
  }).catch((err: Error) => {
    console.log(err);
  })
}
const getProductsList = async () => {
  let res = await api.getItem()
  let data: TransferProps['dataSource']
  data = res.map((item: any) => {
    return {
      key: item.itemId,
      title: item.itemName,
      children: item.productVos.map((citem: any) => {
        return {
          key: item.itemId + '_' + citem.productId,
          realKey: citem.productId,
          title: citem.productName
        }
      })
    }
  })
  tData.value = data
  dataSource.value = flatten(tData.value);
}
onMounted(() => {
  onSearch()
  getProductsList()
})
</script>

<style scoped lang="scss">
::v-deep(.ant-transfer-list-body) {
  overflow: auto;
}

.tip {
  margin-top: 10px;
  font-size: 14px;
  font-family: Microsoft YaHei UI;
  font-weight: 400;
  color: #C8C9CC;
}
</style>