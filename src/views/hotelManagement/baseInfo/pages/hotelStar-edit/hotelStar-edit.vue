<template>
	<div class="wrapper">
		<a-tabs v-model:activeKey="activeTabKey">
			<a-tab-pane key="1" tab="酒店信息">
				<HotelInfo> </HotelInfo>
			</a-tab-pane>
			<a-tab-pane key="2" tab="房型信息" force-render>
				<RoomInfo> </RoomInfo>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script setup lang="ts">
import HotelInfo from '../../components/hotelInfo/hotelInfo.vue';
import RoomInfo from '../../components/roomInfo/roomInfo.vue';

const activeTabKey = ref('1');
</script>

<style lang="less" scoped>
@import './styles/hotelStar-edit.less';
</style>
