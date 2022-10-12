<template>
    <a-cascader :options="list" :load-data="loadData" />
</template>

<script setup lang="ts">
import api from '@/api';
import { CascaderProps } from 'ant-design-vue';
const list = ref<any>([])
function getAllAreaProvice(pid: any): any[] {
    return api.getAllArea(pid, 1).then((res: any) => {
        const options = res.map((i: any) => {
            return { label: i.name, value: i.oid, isLeaf: false, level: i.level };
        });
        return options;
    });
}

/**
 * 市区
 * @param pid 最顶级的pid 是 0，上一级的oid是下一级的pid
 */
function getAllAreaCity(pid: any): any[] {
    return api.getAllArea(pid, 2).then((res: any) => {
        const options = res.map((i: any) => {
            return { label: i.name, value: i.oid, isLeaf: false, level: i.level };
        });
        return options;
    });
}

/**
 * 辖区
 * @param pid 最顶级的pid 是 0，上一级的oid是下一级的pid
 */
function getAllArea(pid: any): any[] {
    return api.getAllArea(pid, 3).then((res: any) => {
        const options = res.map((i: any) => {
            return { label: i.name, value: i.oid, isLeaf: true, level: i.level };
        });
        return options;
    });
}

const loadData: CascaderProps['loadData'] = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    if (targetOption.level === 1) {
        const data = await getAllAreaCity(targetOption.value) // 接口调用
        targetOption.children = [...data]
    } else if (targetOption.level === 2) {
        const data = await getAllArea(targetOption.value) // 接口调用
        targetOption.children = [...data]
    }
    targetOption.loading = false
    list.value = [...list.value]
}
onMounted(async () => {
    list.value = await getAllAreaProvice(0)
})
</script>

<style scoped lang="scss">

</style>