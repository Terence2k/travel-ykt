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
          <a @click="addOrUpdate({ row:record, handle: 'update' })" v-permission="'编辑'">编辑</a>
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
        <a-transfer v-model:target-keys="checkedKeys" v-model:selected-keys="selectedKeys1" class="tree-transfer"
          :data-source="dataSource" :render="(item: any) => item.title" :show-select-all="false"
          @change="transferChange" :titles="['部门角色', '部门角色已选中']" :list-style="{
            width: '300px',
            height: '350px',
          }">
          <template #children="{ direction, selectedKeys, onItemSelect }">
            <a-tree v-if="direction === 'left'" block-node checkable check-strictly default-expand-all
              :checked-keys="[...selectedKeys, ...checkedKeys]" :tree-data="tData" @check="
                (_, props) => {
                  onChecked(props, [...selectedKeys, ...checkedKeys], onItemSelect);
                }
              " @select="
                (_, props) => {
                  onChecked(props, [...selectedKeys, ...checkedKeys], onItemSelect);
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
import type { TransferProps, TreeProps } from 'ant-design-vue';
import { flatten } from '@/views/baseInfoManage/auditProcess/transfer'
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
  // auditTypeExplain: [{ required: true, trigger: 'blur', message: '流程说明释义不能为空' }],
  // auditTypePage: [{ required: true, trigger: 'blur', message: '事件触发的操作页面不能为空' }],
  // sysAuditNodeVos: [{ required: true, trigger: 'blur', message: '参与审核的部门或角色不能为空' }],
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
const checkedKeys = ref<any[]>([]);
const selectedKeys1 = ref<any[]>([]);
// 记录被选中父元素key
const checkedParentKeys: (string | number)[] = []
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
// draggable
const draggable = (dragelist: any[]) => {
  const node: HTMLUListElement = document.querySelector('.ant-transfer-list-content')!;
  if (!node?.children) return
  const childrenList = Array.from(node.children)
  if (childrenList.length === 0 || !node) return
  childrenList.forEach((item, index) => {
    // 设置所有子元素draggable属性为true
    item.setAttribute('draggable', 'true')
    // 将key添加到自定义属性data-key
    item.setAttribute('data-key', dragelist[index])
    item.setAttribute('data-keytype', typeof dragelist[index])
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
      const keytype = item.getAttribute('data-keytype')!
      // 修改移动后checkedKeys的子元素的顺序
      if (keytype === 'number') {
        checkedKeys.value[index] = Number(key)
      } else if (keytype === 'string') {
        checkedKeys.value[index] = key
      }
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
  if (targetKeys.length > 0) {
    auditRef.value.resetFields('sysAuditNodeVos')
  }
  nextTick(() => {
    if (direction === 'right') {
      setTitle()
    }
    draggable(targetKeys)
  })
}
// 设置穿梭框右侧的元素名称
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
  if (handle === 'update') {
    modalVisible.value = true
    let { auditTypeName, auditTypeExplain, auditTypePage, oid, auditModelDetailVos } = await api.AuditDetail(row.oid)
    auditForm.auditTypeName = auditTypeName
    auditForm.auditTypeExplain = auditTypeExplain
    auditForm.auditTypePage = auditTypePage
    auditForm.oid = oid
    checkedKeys.value = auditModelDetailVos.map((item: any) => {
      if (item.roleId) {
        // 选中的子元素
        return item.roleId
      } else {
        // 选中的父级元素
        checkedParentKeys.push(item.businessType)
        return item.businessType
      }
    })
    tData.value = disabledChildKeys(tData.value, checkedParentKeys);
    nextTick(() => {
      setTitle()
      draggable(checkedKeys.value)
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
  checkedKeys.value = []
  checkedParentKeys.splice(0, checkedParentKeys.length)
  selectedKeys1.value = []
  getRolesList()
}
const formatAudit = (arr: any, tArr: TransferProps['dataSource']) => {
  let ret: any = []
  for (let i = 0, l = arr.length; i < l; i++) {
    const element = arr[i];
    for (let j = 0, l = tArr?.length!; j < l; j++) {
      const telement = tArr[j];
      if (element === telement?.key) {
        ret.push({
          businessType: telement.key, //项目id
          auditSort: i + 1 //排序
        })
      }
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
  auditForm.sysAuditNodeVos = formatAudit(checkedKeys.value, tData.value);
  auditRef.value.validate().then(async (val: any) => {
    let res = await api.AuditUpdate({ ...toRaw(auditForm) });
    if (res === '修改成功') {
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