<!-- <template>
	<router-view v-slot="{ Component }">
		<keep-alive>
			<component :is="Component" />
		</keep-alive>
	</router-view>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">

</style> -->
<template>
	<component :is="isSuper ? apply : normal" :group-id="groupId"></component>
</template>

<script setup lang="ts">
import apply from '@/views/baseInfoManage/businessManagement/super/apply.vue'
import normal from '@/views/baseInfoManage/businessManagement/normal/index.vue'
const isSuper = ref(true)
const groupId = ref()
let userInfo = window.localStorage.getItem('userInfo');
userInfo = JSON.parse(userInfo as string)
const { sysCompany: { businessType, oid } } = userInfo
groupId.value = oid
if (businessType === 'GROUP') {
	isSuper.value = false
} else {
	isSuper.value = true
}
</script>

<style lang="scss" scoped>

</style>