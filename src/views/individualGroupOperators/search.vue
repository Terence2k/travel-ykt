<template>
  <CommonSearch>
    <search-item label="旅行社" v-show="isTravel">
      <a-input v-model:value="value.travelName" placeholder="请输入旅行社名称" allowClear />
    </search-item>
    <search-item label="门店名称">
      <a-input v-model:value="value.storeName" placeholder="请输入门店名称" allowClear />
    </search-item>
    <search-item label="操作员姓名">
      <a-input v-model:value="value.operatorName" placeholder="请输入操作员姓名" allowClear />
    </search-item>
    <template #button>
      <a-button @click="onQuery">查询</a-button>
    </template>
  </CommonSearch>
</template>

<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
export interface Props {
  value: {
    travelName: string | undefined,
    storeName: string | undefined,
    operatorName: string | undefined
  },
  isTravel: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:value', 'query'])
const { value } = toRefs(props)
const onQuery = () => {
  emit('query')
}
</script>

<style scoped lang="scss">

</style>