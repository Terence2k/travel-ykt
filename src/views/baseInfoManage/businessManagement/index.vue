<template>
	<router-view v-slot="{ Component }">
		<keep-alive>
			<component :is="Component" :group-id="groupId" :type="type" />
		</keep-alive>
	</router-view>
</template>

<!-- <script setup lang="ts">
</script>

<style scoped lang="scss">

</style> -->
<!-- <template>
	<component :is="isSuper ? apply : normal" :group-id="groupId"></component>
</template> -->

<script setup lang="ts">
import apply from '@/views/baseInfoManage/businessManagement/super/apply.vue';
import normal from '@/views/baseInfoManage/businessManagement/normal/index.vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute()
const goto = (name: string) => {
	router.push({
		name
	})
}
// const isSuper = ref(true)
const groupId = ref()
const type = ref()

watch(
	() => route.name,
	(newVal) => {
		if (newVal === 'businessManagement') {
			let userInfo = window.localStorage.getItem('userInfo');
			userInfo = JSON.parse(userInfo as string)
			const { sysCompany: { businessType, oid } } = userInfo
			groupId.value = oid
			type.value = businessType
			if (businessType === 'GROUP') {
				// isSuper.value = false
				goto('memberReview')
			} else {
				// isSuper.value = true
				goto('apply')
			}
		}
	},
	{ immediate: true }
)
</script>

<style lang="scss" scoped>

</style>