<template>
	<a-menu-item :key="item.path" v-if="!item.children || item.children.length == 0" class="">
		<span>{{ item.title }}</span>
	</a-menu-item>
	<a-sub-menu :key="item.keys" v-else>
		<template #title>
			<span>{{ item.title }}</span>
		</template>
		<template #expandIcon>
			<img :class="openKeys.includes(item.path) ? 'menu-open' : 'menu-close'" src="@/assets/svg/menu-open.svg" alt="" />
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
import { MenuList } from '../../stores/modules/permission';
const props = defineProps({
	item: {
		type: Object as PropType<MenuList>,
		required: true,
	},
	openKeys: {
		type: Array,
		required: true,
	},
});
console.log(props.item);
</script>
<style lang="scss" scoped>
.box {
	color: #60d659;
}
.menu-close {
	transform: rotate(0deg);
	transition: all 0.4s;
}
.menu-open {
	transform: rotate(90deg);
	transition: all 0.4s;
}
</style>
