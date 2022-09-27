<template>
  <CommonModal v-bind="$attrs">
    <a-form :model="form" name="addDictionary" autocomplete="off" :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
      <a-form-item label="字典名称" name="name">
        <a-input v-model:value="form.name" placeholder="请输入字典名称" />
      </a-form-item>
      <a-form-item label="字典ID" name="codeValue">
        <a-input v-model:value="form.codeValue" placeholder="请输入字典ID" />
      </a-form-item>
    </a-form>
  </CommonModal>
</template>

<script setup lang="ts">
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
export interface Props {
  form: {
    name: string,
    codeValue: string
  }
}
const props = defineProps<Props>()
const { form } = toRefs(props)
</script>

<style scoped lang="scss">

</style>