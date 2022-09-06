<template>
	<a-layout class="layer_container">
		<a-layout-sider v-model:collapsed="collapsed" :trigger="null" theme="light" collapsible class="menu-wrapper" style="max-width: 300px">
			<!-- logo -->
			<div class="my-sideMenu-sider_logo">
				<img class="logo" src="https://workyd.com/image/source_plant/avatar.png" alt="" />
				<span v-if="!collapsed" class="title">丽江一卡通管理系统</span>
			</div>
			<a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" @click="onSelect">
				<SliderItem v-for="item in navs" :key="item.path" :item="item" :openKeys="openKeys"></SliderItem>
			</a-menu>
		</a-layout-sider>
		<a-layout>
			<a-layout-header class="layout-header">
				<div class="header_left">
					<!-- <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" /> -->
					<!-- <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" /> -->
					<!-- 全屏切换 -->
					<!-- <toggleScreen /> -->
					<!-- <RollbackOutlined title="后退" @click="goBack" class="trigger" /> -->
				</div>
				<div class="header_right">
					<a-dropdown>
						<a class="ant-dropdown-link" @click.prevent>
							<span>陈晓妮 &nbsp;</span>
							<user-outlined />
							<DownOutlined />
						</a>
						<template #overlay>
							<a-menu @click="dropClick">
								<a-menu-item key="to2">
									<a href="javascript:;">退出</a>
								</a-menu-item>
								<a-menu-divider />
								<a-menu-item key="3" disabled>系统版本：{{ packageJson.version }}</a-menu-item>
							</a-menu>
						</template>
					</a-dropdown>
				</div>
			</a-layout-header>
			<!-- <navigationBar /> -->
			<a-card
				class="navigation_wrapper"
				:bordered="false"
				:body-style="{ width: '480px', padding: '10px 16px', borderRadius: '5px', cursor: 'pointer' }"
			>
				<a-breadcrumb>
					<template #separator>
						<img class="file-dir" style="margin-top: -4px" src="@/assets/svg/navigation_icon.svg" alt="" />
					</template>
					<a-breadcrumb-item v-for="title in state.routeList" :key="title">{{ title }}</a-breadcrumb-item>
				</a-breadcrumb>
			</a-card>
			<a-layout-content class="box">
				<RouterView key="layoutWrapper"></RouterView>
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>
<script lang="ts" setup>
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, DownOutlined, RollbackOutlined } from '@ant-design/icons-vue';
import { usePermissioStore, MenuList } from '../../stores/modules/permission';
import router from '@/router';

import SliderItem from './SliderItem.vue';
import toggleScreen from './toggleScreen.vue';
import type { MenuProps } from 'ant-design-vue';
import { to2 } from '@/utils/util';
import { useWatermark } from '@/hooks/index';
// import navigationBar from './navigationBar.vue';
import packageJson from '../../../package.json';
const route = useRouter();
const { setWatermark } = useWatermark();
const permissioStore = usePermissioStore();
const navs = ref<MenuList[]>();
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (e: any) => {
	const { key } = e;
	route.push(key);
};
const dropClick: MenuProps['onClick'] = ({ key }) => {
	switch (key) {
		case 'to2':
			to2();
	}
};
const goBack = () => {
	route.back();
};

watchEffect(() => {
	const modules = permissioStore.getMenuList;
	if (modules.length > 0) {
		navs.value = modules;
	}
});
const state = reactive({
	routeList: [],
	url: '',
});
console.log(router.currentRoute.value.matched, 'router', state.routeList);
const getRouteLIst = (): void => {
	// state.url = router.currentRoute.value.matched[router.currentRoute.value.matched.length - 1]?.path;
	state.routeList = router.currentRoute.value.matched.map((i) => {
		return i.meta.title;
	});
};
watch(
	() => route.currentRoute.value.path,
	(nv) => {
		if (!selectedKeys.value.includes(nv)) {
			const matchPath = route.currentRoute.value.matched;
			if (matchPath[1] && matchPath[1].path.indexOf(':id') > -1) {
				selectedKeys.value = [matchPath[1].path.replace('/:id', '')];
			} else {
				selectedKeys.value = [nv];
			}
		}
		let opens = nv.split('/');
		let temp = `/${opens[1]}`;
		// console.log(temp, 'temp', opens, openKeys.value);

		if (!openKeys.value.includes(temp)) {
			openKeys.value.push(temp);
		}

		getRouteLIst();
	},
	{
		immediate: true,
	}
);

const collapsed = ref<boolean>(false);

const initData = async () => {
	setWatermark(`丽江一卡通`, '佰赢科技');
};

onMounted(() => {
	// initData();
});
</script>
<style lang="scss">
@import '@/theme/index.scss';
// @import '@/theme/common/color.scss';

.layer_container {
	height: 100vh;
	overflow: hidden;
	box-sizing: border-box;
	.layout-header {
		// background: #fff;
		padding: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		background-color: $theme-color;
		height: 64px !important;
	}
	.my-sideMenu-sider_logo {
		height: 64px;
		color: white;
		font-size: 20px;
		text-align: center;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding-top: 6px;
		background-color: $theme-color;

		.logo {
			width: 34px;
			height: 34px;
		}
		.title {
			margin-left: 10px;
			width: 144px;
			height: 20px;
			font-size: 16px;
			font-family: Microsoft YaHei UI;
			font-weight: 400;
			line-height: 20px;
			color: #ffffff;
			opacity: 1;
		}
	}
	.ant-layout-header {
		height: 50px;
	}
	.header_right {
		padding-right: 14px;
		a {
			width: 36px;
			height: 15px;
			font-size: 12px;
			font-family: Microsoft YaHei UI;
			font-weight: 400;
			line-height: 15px;
			color: #ffffff;
			opacity: 1;
		}
	}
}
.layer_container .trigger {
	font-size: 20px;
	padding: 0 24px;
	cursor: pointer;
	transition: color 0.3s;
}

.navigation_wrapper {
	background-color: #fff;
	// margin: 10px;
}
.menu-wrapper {
	// width: 256px !important;
	// max-width: 256px !important;
	min-width: 256px !important;
}
.box {
	// overflow-y: scroll;
	margin: 12px;
	// height: calc(100vh - 59px) !important; //控制子路由页高度，59px是顶部navbar的高度
	overflow-y: auto !important; //添加并更改子路由页滚动条样式
	&::-webkit-scrollbar {
		width: 7px;
		// background: #fff;
	}
	&::-webkit-scrollbar-thumb {
		background: #d8d8d8;
		border-radius: 10px;
		// background-color: #fff;
		// background: transparent;
	}
	&::-webkit-scrollbar-track-piece {
		background: transparent;
		// background: #fff;
	}
	// margin: 10px;
	background: #fff;
	// height: calc(100vh - 70px);
	// height: 300px !important;
	min-width: 500px;
	box-sizing: border-box;
	overflow: hidden;
	box-shadow: rgb(214 210 210) 0px 0px 4px 2px;
}
</style>
