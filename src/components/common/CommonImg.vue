<template>
    <div>
        <img v-bind="$attrs" :src="imgUrl">
    </div>
</template>

<script setup lang="ts">
import { awsGetPreSignedUrl } from '@/utils/awsUpload';
const attrs = useAttrs() as any;
const imgUrl = ref('');

onMounted(async () => {
    imgUrl.value = await awsGetPreSignedUrl(attrs.src);
})

</script>

<style scoped>

</style>