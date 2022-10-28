<template>
    <a-cascader v-bind="$attrs" :options="list" :load-data="loadData" />
</template>

<script setup lang="ts">
import api from '@/api';
import { CascaderProps } from 'ant-design-vue';
import { useAttrs } from 'vue'
const attrs = useAttrs()
const props = defineProps<{
    reproduce?: (number | string)[]
}>()
const list = ref<any>([])
function getAllAreaProvice(pid: any): any[] {
    return api.getAllArea(pid, 1).then((res: any) => {
        const options = res.map((i: any) => {
            return { label: i.name, value: i.oid, isLeaf: false, level: i.level };
        });
        return Promise.resolve(options);
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
        return Promise.resolve(options);
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
        return Promise.resolve(options);
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

/* const reproduceOpetion = async () => {
    list.value = await getAllAreaProvice(0)
    if (props.reproduce && props.reproduce.length > 0) {
        const provinceId = props.reproduce[0]// '省'
        const cityId = props.reproduce[1]// '市'
        const data = await getAllAreaCity(provinceId)
        for (let i = 0, l = data.length; i < l; i++) {
            const element = data[i];
            if (element.value === cityId) {
                const data = await getAllArea(cityId)
                element.children = [...data]
                break;
            }
        }
        for (let i = 0, l = list.value.length; i < l; i++) {
            const element = list.value[i];
            if (element.value === provinceId) {
                element.children = [...data]
                break
            }
        }
    }
} */
const reproduceOpetion = async () => {
    // list.value = await getAllAreaProvice(0)
    const regionCode = attrs.value as number[]
    if (regionCode && regionCode.length > 0) {
        const provinceId = regionCode[0]// '省'
        const cityId = regionCode[1]// '市'
        if (provinceId && cityId) {
            const data = await getAllAreaCity(provinceId)
            for (let i = 0, l = data.length; i < l; i++) {
                const element = data[i];
                if (element.value === cityId) {
                    const data = await getAllArea(cityId)
                    element.children = [...data]
                    break;
                }
            }
            for (let i = 0, l = list.value.length; i < l; i++) {
                const element = list.value[i];
                if (element.value === provinceId) {
                    element.children = [...data]
                    break
                }
            }
        }
    }
}
watch(() => attrs.value,
    async (newVal) => {
        if (list.value.length === 0) { list.value = await getAllAreaProvice(0) }
        if (newVal) {
            reproduceOpetion()
        }
    }, {
    immediate: true
})
</script>

<style scoped lang="scss">

</style>