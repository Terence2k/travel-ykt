<template>
	<div class="roomStatus-wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-select item">日期</span>
					<a-select class="select-status select item" :showArrow="true" :options="statusOptions" v-model:value="status" placeholder="请选择状态">
					</a-select>
				</div>

				<div class="item">
					<span class="field-select item">标记状态</span>
					<a-select class="select-star select item" :showArrow="true" :options="starOptions" v-model:value="star" placeholder="请选择星级星标">
					</a-select>
				</div>

				<div class="item button-search-wrapper">
					<a-button @click="searchByFilter" class="button-search item">查询</a-button>
				</div>
			</div>

			<div class="tab-bar">
				<a-tabs v-model:activeKey="activeTabKey">
					<a-tab-pane key="1" tab="已提报">
						<HotelInfo> </HotelInfo>
					</a-tab-pane>
					<a-tab-pane key="2" tab="待提报" force-render>
						<RoomInfo> </RoomInfo>
					</a-tab-pane>
					<a-tab-pane key="3" tab="标记异常" force-render>
						<RoomInfo> </RoomInfo>
					</a-tab-pane>
				</a-tabs>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const activeTabKey = ref('1');
</script>

<style></style>
