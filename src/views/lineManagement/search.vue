<template>
  <CommonSearch>
    <search-item label="适用范围">
      <a-select placeholder="请选择适用范围" v-model:value="value.suitableRange" allowClear>
        <a-select-option v-for="item in enableOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="线路名称">
      <a-input v-model:value="value.lineName" placeholder="请输入线路名称" allowClear />
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
    suitableRange: string | undefined,
    lineName: string | undefined,
  }
}
const props = defineProps<Props>()
const emit = defineEmits(['update:value', 'query'])
const { value } = toRefs(props)
const onQuery = () => {
  emit('query')
}
// （1.所有  2.本旅行社  3.本门店）
const enableOption = [
  { codeValue: 1, name: '全部' },
  { codeValue: 2, name: '旅行社' },
  { codeValue: 3, name: '门店' },
]
</script>

<style scoped lang="scss">

</style>