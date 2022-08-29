<template>
	<a-menu-item :key="item.path" v-if="!item.children || item.children.length == 0">
		<appstore-outlined />
		<span>{{ item.title }}</span>
	</a-menu-item>
	<a-sub-menu :key="item.keys" v-else>
		<template #title>
			<appstore-outlined />
			<span>{{ item.title }}</span>
		</template>
		<SliderItem :item="elm" v-for="elm in item.children" :key="elm.path" />
	</a-sub-menu>
</template>
<script lang="ts">
export default {
	name: 'SliderItem',
};
</script>
<script setup lang="ts">
import { PropType } from 'vue';
import { AppstoreOutlined } from '@ant-design/icons-vue';
import { MenuList } from '../../stores/modules/permission';
const props = defineProps({
	item: {
		type: Object as PropType<MenuList>,
		required: true,
	},
});
</script>
<style lang="less" scoped>
.box {
	color: #60d659;
}
</style>
