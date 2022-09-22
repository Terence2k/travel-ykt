<template>
    <a-cascader v-model="form.delivery" :options="proviceList" :load-data="loadData" placeholder="请选择" @change="onChange" />
</template>

<script setup lang="ts">
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import { CascaderProps } from 'ant-design-vue';
const options = ref([])
const businessManageOptions = useBusinessManageOption();
//初始化下拉列表
const initOpeion = async () => {
    // await scenicSpotOptions.getBusinessTypeOption();
    options.value = await businessManageOptions.getAllAreaProvice(0);
};
//下拉列表
// const businessTypeOption = computed(() => scenicSpotOptions.businessTypeOption);
const proviceList = computed(() => businessManageOptions.proviceList);
// const cityList = computed(() => scenicSpotOptions.cityList);
// const areaList = computed(() => scenicSpotOptions.areaList);
const form = reactive({
    delivery: ''
})

const loadData: CascaderProps['loadData'] = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    console.log(selectedOptions, 'ssssss');
    
    const data = await this.getRegion(targetOption.code) // 接口调用
    targetOption.loading = false
    targetOption.children = [...data]
    options.value = [...options.value]
}
const onChange = () => { }
onMounted(() => {
    initOpeion()
    console.log(proviceList, 'gggggg');
})
</script>

<style scoped lang="scss">

</style>