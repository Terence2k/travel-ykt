<template>
	<div class="roomStatus-edit-wrapper">
		<a-tabs v-model:activeKey="activeTabKey">
			<a-tab-pane key="1" tab="入住情况">
				<CheckinStatus> </CheckinStatus>
			</a-tab-pane>
			<a-tab-pane key="2" tab="团单明细" force-render>
				<GroupOrderDetails> </GroupOrderDetails>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script setup lang="ts">
import CheckinStatus from '../../components/checkinStatus/checkinStatus.vue';
import GroupOrderDetails from '../../components/groupOrderDetails/groupOrderDetails.vue';

const activeTabKey = ref('1');
</script>

<style lang="less" scoped>
@import './styles/roomStatus-edit.less';
</style>
