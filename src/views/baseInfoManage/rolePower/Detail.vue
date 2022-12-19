<template>
	<BaseModal :title="options.title" v-model="dialogVisible">
		<a-form
      :model="formValidate"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16, offset: 1 }"
      labelAlign="left"
    >
      <a-form-item
        label="角色名称"
        name="roleName"
      >
      {{ formValidate.roleName }}
      </a-form-item>
      <a-form-item
        label="可用范围"
        name="availableRangeName"
      >
      {{ formValidate.availableRangeName }}
      </a-form-item>
      <a-form-item
        label="状态"
        name="roleStatusName"
      >
      {{ formValidate.roleStatusName }}
      </a-form-item>
      <a-form-item
        label="角色权限"
        name="menuIds"
      >
      <a-collapse v-model:activeKey="activeKey" :bordered="false" v-if="dialogVisible">
        <a-collapse-panel key="1" header="一卡通PC端">
          <a-tree
            v-model:checkedKeys="pcCheckedKeys"
            checkable
            :selectable="false"
            :tree-data="pcMenuTreeDate"
            :field-names="fieldNames"
          >
          </a-tree>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="一卡通App端">
          <a-tree
            v-model:checkedKeys="appCheckedKeys"
            checkable
            :selectable="false"
            :tree-data="appMenuTreeDate"
            :field-names="fieldNames"
          >
          </a-tree>
        </a-collapse-panel>
      </a-collapse>
      </a-form-item>
      <a-form-item
        label="角色编码"
        name="roleCode"
      >
      {{ formValidate.roleCode }}
      </a-form-item>
      <a-form-item
        label="角色描述"
        name="roleDescribe"
      >
      {{ formValidate.roleDescribe }}
      </a-form-item>
      <a-form-item
        label="编辑人"
        name="lastUpdaterName"
      >
      {{ formValidate.lastUpdaterName }}
      </a-form-item>
      <a-form-item
        label="编辑时间"
        name="lastUpdateTime"
      >
      {{ formValidate.lastUpdateTime }}
      </a-form-item>
    </a-form>
		<template v-slot:footer>
			<a-button @click="dialogVisible = false">取消</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
  import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
	import BaseModal from '@/components/common/BaseModal.vue';
  import type { TreeProps } from 'ant-design-vue';
  import api from '@/api';
  import { convertTree } from '@/utils/util';

  const props = defineProps({
      modelValue: {
        type: Boolean,
        default: false
      },
      params: Object,
  })
  const fieldNames: TreeProps['fieldNames'] = {
    key: 'value',
    title: 'label',
  };
  const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
  const dialogVisible = ref(false);
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '查看角色' });

  const pcCheckedKeys = ref<string[]>([]);
  const pcMenuTreeDate: Ref<Array<any>> = ref([]);
  const pcMenuIdsInfo: Ref<Array<any>> = ref([]);

  const appCheckedKeys = ref<string[]>([]);
  const appMenuTreeDate: Ref<Array<any>> = ref([]);
  const appMenuIdsInfo: Ref<Array<any>> = ref([]);

  const activeKey = ref(['']);

  const getMenuList = async () => {
    const res = await api.menuList();
    let pcMenu = res.filter((item: any) => item.systemMark === 0);
    let appMenu = res.filter((item: any) => item.systemMark === 1);
    ///转换树
      // pc端
      pcMenuTreeDate.value = convertTree(pcMenu, {
        value: 'oid',
        label: 'menuName',
        children: 'children',
      });
      // App端
      appMenuTreeDate.value = convertTree(appMenu, {
        value: 'oid',
        label: 'menuName',
        children: 'children',
      });
      
    if (props.params?.oid) {
      await getDetail(props.params.oid);
    }
  }

  const getDetailMenuIds = (data: any, isPc: boolean) => {
    data.forEach((item: any) => {
      if (item.childMenuList?.length) {
        getDetailMenuIds(item.childMenuList, isPc);
      } else {
        isPc ? pcMenuIdsInfo.value.push(item.oid) : appMenuIdsInfo.value.push(item.oid);
      }
      // menuIdsInfo.value = [159]
      
    })
  }

  const getDetail = async (id: number) => {
    await api.roleDetail(id).then((res: any) => {
      formValidate.value = res;
      console.log('角色权限菜单：', res.roleMenu);
      getDetailMenuIds(res.roleMenu.filter((item: any) => item.systemMark === 0), true);
      getDetailMenuIds(res.roleMenu.filter((item: any) => item.systemMark === 1), false);
      pcCheckedKeys.value = pcMenuIdsInfo.value;
      appCheckedKeys.value = appMenuIdsInfo.value;
    }).catch((err: any) => {
      console.error(err);
    })
  }

  const init = async () => {
    pcCheckedKeys.value = [];
    appCheckedKeys.value = [];
    pcMenuIdsInfo.value = [];
    appMenuIdsInfo.value = [];
  }

  watch(() => props.modelValue, async (nVal) => {
    dialogVisible.value = nVal;
    if (dialogVisible.value) {
      await init();
      await getMenuList();
    }
	})
  
  watch(dialogVisible, nVal => {
    emit('update:modelValue', nVal);
  });

</script>

<style>

</style>