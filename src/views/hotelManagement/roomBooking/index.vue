<template>
	<div class="wrapper-roomBooking">
		<div class="content-container">
			<div class="search-bar">
				<div class="item-hotel item">
					<span class="field-select item">酒店</span>
					<a-select class="select-hotel select item" :showArrow="true" :options="hotelOptions" v-model:value="hotel" placeholder="请选择酒店">
					</a-select>
				</div>
				<div class="item-audit item">
					<span class="field-select item">审核状态</span>
					<a-select
						class="select-audit select item"
						:showArrow="true"
						:options="auditStatusOptions"
						v-model:value="auditStatus"
						placeholder="请选择审核状态"
					>
					</a-select>
				</div>
				<div class="item-button item">
					<a-button class="button-search item">清空</a-button>
				</div>
			</div>

			<div class="table-bar">
				<div class="flex-container">
					<span>房态管理</span>
				</div>
				<div class="table-container">
					<RoomBookingTable> </RoomBookingTable>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import RoomBookingTable from './components/roomBookingTable/roomBookingTable.vue';
const hotel = ref('');
const hotelOptionsData = ref([]);
const hotelOptions = ref<SelectProps['options']>(hotelOptionsData);

const auditStatus = ref('');
const auditStatusData = ref([
	{
		value: 0,
		label: '待审核',
	},
	{
		value: 1,
		label: '无需审核',
	},
]);

const auditStatusOptions = ref<SelectProps['options']>(auditStatusData);
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
