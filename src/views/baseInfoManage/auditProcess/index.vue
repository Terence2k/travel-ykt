<template>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <p>当前共有<span style="color:red">{{tableData.total}}</span>种审核流程</p>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="addOrUpdate({ row:record, handle: 'update' })">编辑</a>
        </div>
      </template>
    </template>
  </CommonTable>
  <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
    :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />

  <CommonModal title="配置审核流程" v-model:visible="modalVisible" @close="closeModal" @cancel="closeModal" @conform="save"
    width="40%">
    <a-form ref="auditRef" :model="auditForm" :rules="formRules" name="addTeam" autocomplete="off"
      :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="审核流程名称" name="auditTypeName">
        <a-input v-model:value="auditForm.auditTypeName" disabled />
      </a-form-item>
      <a-form-item label="流程说明释义" name="auditTypeExplain">
        <a-textarea v-model:value="auditForm.auditTypeExplain" auto-size />
      </a-form-item>
      <a-form-item label="事件触发的操作页面" name="auditTypePage">
        <a-input v-model:value="auditForm.auditTypePage" disabled />
      </a-form-item>
      <a-form-item label="参与审核的部门或角色" name="sysAuditNodeVos">
        <!-- <a-form-item label="参与审核的部门或角色"> -->
        <a-transfer v-model:target-keys="targetKeys" class="tree-transfer" :data-source="dataSource"
          :render="(item: any) => item.title" :show-select-all="false" @change="transferChange"
          :titles="['部门角色', '部门角色已选中']" :list-style="{
            width: '300px',
            maxHeight: '350px',
          }">
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
        <p class="tip">如需调整各审核角色的审核先后顺序，可手动拖拽其排列次序。</p>
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
import { flatten, onChecked } from '@/views/baseInfoManage/teamTypeManagement/transfer'
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '审核流程名称',
    dataIndex: 'auditTypeName',
    key: 'auditTypeName',
  },
  {
    title: '流程说明释义',
    dataIndex: 'auditTypeExplain',
    key: 'auditTypeExplain',
  },
  {
    title: '事件触发的操作页面',
    dataIndex: 'auditTypePage',
    key: 'auditTypePage',
  },
  {
    title: '参与审核部门或角色',
    dataIndex: 'businessTypeNameOrRoles',
    key: 'businessTypeNameOrRoles',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const formRules: any = {
  auditTypeName: [{ required: true, trigger: 'blur', message: '审核流程名称不能为空' }],
  auditTypeExplain: [{ required: true, trigger: 'blur', message: '流程说明释义不能为空' }],
  auditTypePage: [{ required: true, trigger: 'blur', message: '事件触发的操作页面不能为空' }],
  sysAuditNodeVos: [{ required: true, trigger: 'blur', message: '参与审核的部门或角色不能为空' }],
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
  },
});
let tData = ref<TransferProps['dataSource']>([])
let dataSource = ref<TransferProps['dataSource']>([])
const { tableData } = toRefs(state)
const modalVisible = ref<boolean>(false)
const auditRef = ref()
const auditForm = reactive({
  auditTypeName: undefined,
  auditTypeExplain: undefined,
  auditTypePage: undefined,
  oid: undefined,
  sysAuditNodeVos: undefined
})
/* 穿梭框相关 */
const targetKeys = ref<number[]>([]);
// draggable
const draggable = (dragelist: string[]) => {
  const node: HTMLUListElement = document.querySelector('.ant-transfer-list-content')!;
  if (!node?.children) return
  const childrenList = Array.from(node.children)
  if (childrenList.length === 0 || !node) return
  childrenList.forEach((item, index) => {
    item.setAttribute('draggable', 'true')
    item.setAttribute('data-key', dragelist[index])
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
      targetKeys.value[index] = Number(key)
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
const transferChange = (targetKeys: string[], direction: string, moveKeys: string[]) => {
  if (targetKeys.length > 0) {
    auditRef.value.resetFields('sysAuditNodeVos')
  }
  nextTick(() => {
    draggable(targetKeys)
  })
}

interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = async ({ row, handle }: addInterface) => {
  if (handle === 'update') {
    modalVisible.value = true
    let { auditTypeName, auditTypeExplain, auditTypePage, oid, auditModelDetailVos } = await api.AuditDetail(row.oid)
    auditForm.auditTypeName = auditTypeName
    auditForm.auditTypeExplain = auditTypeExplain
    auditForm.auditTypePage = auditTypePage
    auditForm.oid = oid
    targetKeys.value = auditModelDetailVos.map((item: any) => {
      return item.roleId as number
    })
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

const closeModal = () => {
  modalVisible.value = false
  auditRef.value.resetFields()
  targetKeys.value = []
}
const formatAudit = (arr: any, tArr: TransferProps['dataSource']) => {
  let ret: any = []
  for (let i = 0, l = arr.length; i < l; i++) {
    const element = arr[i];
    for (let j = 0, l = tArr.length; j < l; j++) {
      const telement = tArr[j];
      if (telement?.children) {
        for (let k = 0, l = telement.children.length; k < l; k++) {
          const celement = telement.children[k];
          if (element === celement?.key) {
            ret.push({
              businessType: telement.key, //项目id
              roleId: element, //产品id
              auditSort: i + 1 //排序
            })
          }
        }
      }
    }
  }
  return ret
}
const save = () => {
  auditForm.sysAuditNodeVos = formatAudit(targetKeys.value, tData.value);
  auditRef.value.validate().then(async (val: any) => {
    let res = await api.AuditUpdate({ ...toRaw(auditForm) });
    console.log(res, '%%%%%');
    if (res === null) {
      message.success('编辑审核流程成功！')
      closeModal();
      onSearch();
    } else {
      message.error('编辑审核流程失败！')
    }
  }).catch((err: string) => {
    console.log(err);
  })
}
const onSearch = async () => {
  let res = await api.getAuditList(state.tableData.param)
  state.tableData.data = res.content
  state.tableData.total = res.total
}
const getRolesList = async () => {
  let res = await api.getBusinessTypeRole()
  let data: TransferProps['dataSource']
  data = res.map((item: any) => {
    return {
      key: item.businessType,
      title: item.businessTypeName,
      children: item.auditModelRoleVos.map((citem: any) => {
        return {
          key: citem.roleId,
          title: citem.roleName
        }
      })
    }
  })
  tData.value = data
  dataSource.value = flatten(tData.value);
}
onMounted(() => {
  onSearch()
  getRolesList()
})
</script>

<style scoped lang="less">
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