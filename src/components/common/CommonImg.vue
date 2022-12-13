<template>
    <div>
        <a-image
            v-bind="$attrs" :src="imgUrl"
            :width="$attrs.width"
        />
    </div>
</template>

<script setup lang="ts">
import { awsGetPreSignedUrl } from '@/utils/awsUpload';
const attrs = useAttrs() as any;
const imgUrl = ref('');

onMounted(async () => {
    if (attrs.src.indexOf('http:') === -1) {
        imgUrl.value = await awsGetPreSignedUrl(attrs.src) as string;
    } else {
        imgUrl.value = attrs.src;
    }
})

</script>

<style scoped>

</style>