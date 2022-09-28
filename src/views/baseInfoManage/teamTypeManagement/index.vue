<template>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'businessLicenseUrl'">
        <a-image width="100%" :src="record.businessLicenseUrl" />
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
          <a @click="disable(record)">禁用</a>
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
      <a-form-item label="必购项目" name="name">
        <a-transfer v-model:target-keys="targetKeys" class="tree-transfer" :data-source="dataSource"
          :render="(item: any) => item.title" :show-select-all="false" @change="transferChange"
          :titles="['产品', '产品已选中']">
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
import type { TransferProps, TreeProps } from 'ant-design-vue';
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
const teamRef = ref()
const teamForm = reactive({
  name: undefined,
  state: 1
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
const targetKeys = ref<string[]>([]);
const tData: TransferProps['dataSource'] = [
  { key: '1', title: 'test1' },
  {
    key: '0-1',
    title: '0-1',
    children: [
      { key: '2', title: 'test2' },
      { key: '5', title: 'test5' },
    ],
  },
  { key: '6', title: 'test6' },
];

const transferDataSource: TransferProps['dataSource'] = [];
/* 扁平化 */
function flatten(list: TransferProps['dataSource'] = []) {
  list.forEach(item => {
    transferDataSource.push(item);
    flatten(item.children);
  });
}
flatten(JSON.parse(JSON.stringify(tData)));
const dataSource = ref(transferDataSource);

/* function handleTreeData(data: TransferProps['dataSource'], targetKeys: string[] = []) {
  data.forEach((item, index) => {
    item['disabled'] = targetKeys.includes(item.key as any);
    if (item.children) {
      handleTreeData(item.children, targetKeys);
    }
  });
  return data as TreeProps['treeData'];
}
const treeData = computed(() => {
  return handleTreeData(tData, targetKeys.value);
}); */

function isChecked(selectedKeys: (string | number)[], eventKey: string | number) {
  return selectedKeys.indexOf(eventKey) !== -1;
}
const onChecked = (
  e: Parameters<TreeProps['onCheck']>[1] | Parameters<TreeProps['onSelect']>[1],
  checkedKeys: string[],
  onItemSelect: (n: any, c: boolean) => void,
) => {
  if (e.node.children) {
    e.node.children.forEach((item: any) => {
      onItemSelect(item.key, !isChecked(checkedKeys, item.key));
    })
  } else {
    const { eventKey } = e.node;
    onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
  }
};
const transferChange = (targetKeys: string[], direction: string, moveKeys: string[]) => {
  console.log(targetKeys, direction, moveKeys);
  nextTick(() => {
    dragList(targetKeys)
  })
}

interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
  modalVisible.value = true
  if (handle === 'add') {
    title.value = '新增团队类型'
  } else if (handle === 'update') {
    title.value = '编辑团队类型'
    const { name, state, products } = row
    teamForm.name = name;
    teamForm.state = state;
    targetKeys.value = products
  }
}
const deleteTeam = (oid: string) => { }
const disable = () => { }
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
const save = () => {
  teamRef.value.validate().then((val: any) => {
    console.log(toRaw(teamForm), val);
  }).catch((err: string) => {
    console.log(err);
  })
}



const dragList = (keys: string[]) => {
  const node: HTMLUListElement = document.querySelector('.ant-transfer-list-content')!;
  const childrenList = Array.from(node.children)
  childrenList.forEach((item, index) => {
    item.setAttribute('draggable', 'true')
    item.setAttribute('data-key', keys[index])
  });
  let draging: EventTarget;
  //使用事件委托，将li的事件委托给ul
  node.ondragstart = function (event) {
    //firefox设置了setData后元素才能拖动！！！！
    //event.target出发事件的元素
    event.dataTransfer.setData("te", event.target.innerText); //不能使用text，firefox会打开新tab
    //event.dataTransfer.setData("self", event.target);
    draging = event.target!;
  }
  node.ondragover = function (event) {
    //取消默认行为
    event.preventDefault();
    const target = event.target!;
    //因为dragover会发生在ul上，所以要判断是不是li
    if (target.nodeName === "LI") {
      if (target !== draging) {
        //getBoundingClientRect()用于获取某个元素相对于视窗的位置集合
        const targetRect = target.getBoundingClientRect();
        const dragingRect = draging.getBoundingClientRect();
        if (target) {
          if (target.animated) {
            return;
          }
        }
        if (_index(draging) < _index(target)) {
          //nextSibling 属性可返回某个元素之后紧跟的节点（处于同一树层级中）。
          target.parentNode.insertBefore(draging, target.nextSibling);
        } else {
          target.parentNode.insertBefore(draging, target);
        }
        _animate(dragingRect, draging);
        _animate(targetRect, target);
      }
    }
  }
  node.ondragend = function (event) {
    const childrenList = document.querySelectorAll('.ant-transfer-list-content-item')
    childrenList.forEach((item, index) => {
      const key = item.getAttribute('data-key')!
      targetKeys.value[index] = key
    });
  }
  //获取元素在父元素中的index
  function _index(el: EventTarget) {
    var index = 0;
    if (!el || !el.parentNode) {
      return -1;
    }
    //previousElementSibling属性返回指定元素的前一个兄弟元素（相同节点树层中的前一个元素节点）。
    while (el && (el = el.previousElementSibling)) {
      index++;
    }
    return index;
  }

  function _animate(prevRect, target) {
    var ms = 300;
    if (ms) {
      var currentRect = target.getBoundingClientRect();
      //nodeType 属性返回以数字值返回指定节点的节点类型。1=元素节点  2=属性节点
      if (prevRect.nodeType === 1) {
        prevRect = prevRect.getBoundingClientRect();
      }
      _css(target, 'transition', 'none');
      _css(target, 'transform', 'translate3d(' +
        (prevRect.left - currentRect.left) + 'px,' +
        (prevRect.top - currentRect.top) + 'px,0)'
      );
      target.offsetWidth; // 触发重绘
      //放在timeout里面也可以
      // setTimeout(function() {
      //     _css(target, 'transition', 'all ' + ms + 'ms');
      //     _css(target, 'transform', 'translate3d(0,0,0)');
      // }, 0);
      _css(target, 'transition', 'all ' + ms + 'ms');
      _css(target, 'transform', 'translate3d(0,0,0)');
      clearTimeout(target.animated);
      target.animated = setTimeout(function () {
        _css(target, 'transition', '');
        _css(target, 'transform', '');
        target.animated = false;
      }, ms);
    }
  }
  //给元素添加style
  function _css(el, prop, val) {
    let style = el && el.style;
    if (style) {
      if (val === void 0) {
        //使用DefaultView属性可以指定打开窗体时所用的视图
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }
        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style)) {
          prop = '-webkit-' + prop;
        }
        style[prop] = val + (typeof val === 'string' ? '' : 'px');
      }
    }
  }
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