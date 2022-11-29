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
        <a-tree
          v-model:checkedKeys="checkedKeys"
          checkable
          :tree-data="menuTreeDate"
          :field-names="fieldNames"
        >
        </a-tree>
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
  const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
  const menuTreeDate: Ref<Array<any>> = ref([]);
  const menuIdsInfo: Ref<Array<any>> = ref([]);

  const getMenuList = () => {
    api.menuList().then((res: any) => {
      ///转换树
      menuTreeDate.value = convertTree(res, {
        value: 'oid',
        label: 'menuName',
        children: 'children',
      });
    })
  }

  const getDetailMenuIds = (data: any) => {
    data.forEach((item: any) => {
      menuIdsInfo.value.push(item.oid);
      if (item.childMenuList?.length) {
        getDetailMenuIds(item.childMenuList);
      }
    })
  }

  const getDetail = (id: number) => {
    checkedKeys.value = [];
    api.roleDetail(id).then((res: any) => {
      console.log('res:', res);
      getDetailMenuIds(res.roleMenu);
      formValidate.value = res;
      checkedKeys.value = menuIdsInfo.value;
    }).catch((err: any) => {
      console.error(err);
    })
  }

  const init = async () => {
    console.log('params', props.params);
    getDetail(props.params.oid);
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