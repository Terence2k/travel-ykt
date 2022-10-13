<template>
	<div class="hotelStar-display-wrapper">
		<a-tabs v-model:activeKey="activeTabKey">
			<a-tab-pane key="1" tab="酒店信息">
				<HotelInfoDisplay> </HotelInfoDisplay>
			</a-tab-pane>
			<a-tab-pane key="2" tab="房型信息" force-render>
				<RoomInfoDisplay> </RoomInfoDisplay>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script setup lang="ts">
import HotelInfoDisplay from '../../components/hotelInfo-display/hotelInfo-display.vue';
import RoomInfoDisplay from '../../components/roomInfo-display/roomInfo-display.vue';

const activeTabKey = ref('2');
</script>

<style lang="less" scoped>
@import './styles/hotelStar-display.less';
</style>
