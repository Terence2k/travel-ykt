<template>
	<div class="roomStatus-wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-select item">日期</span>
					<a-date-picker class="select-status select item" placeholder="请选择日期" v-model:value="date" value-format="YYYY-MM-DD" />
				</div>

				<div class="item">
					<span class="field-select item">标记状态</span>
					<a-select
						class="select-star select item"
						:showArrow="true"
						:options="tickStatusOptions"
						v-model:value="tickStatus"
						placeholder="请选择星级星标"
					>
					</a-select>
				</div>

				<div class="item button-search-wrapper">
					<a-button @click="searchByFilter" class="button-search item" v-permission="'查询'">查询</a-button>
				</div>
			</div>

			<div class="tab-bar">
				<a-tabs v-model:activeKey="activeTabKey">
					<a-tab-pane key="1" tab="已提报">
						<div>
							<RoomStatusTable :role="role" :tabName="'alReport'"></RoomStatusTable>
							<div class="footer" v-if="role !== 'hotel'">
								<template v-if="role === 'admin'">
									<a-button class="button">导出</a-button>
									<a-button class="button">导出明细</a-button>
								</template>
							</div>
						</div>
					</a-tab-pane>
					<a-tab-pane key="2" tab="待提报" force-render>
						<RoomStatusTable :role="role" :tabName="'noReport'"></RoomStatusTable>
						<div class="footer" v-if="role !== 'hotel'">
							<template v-if="role === 'admin'">
								<a-button class="button">批量审批</a-button>
							</template>
						</div>
					</a-tab-pane>
					<a-tab-pane key="3" tab="标记异常" force-render>
						<RoomStatusTable></RoomStatusTable>
					</a-tab-pane>
				</a-tabs>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import RoomStatusTable from './components/roomStatusTable/roomStatusTable.vue';
const activeTabKey = ref('1');
const role = ref('hotel');
const date = ref('');
const tickStatus = ref('');
let tickStatusOptionsData = [
	{
		value: 1,
		label: '异常',
	},
	{
		value: 0,
		label: '无',
	},
];

const tickStatusOptions = ref<SelectProps['options']>(tickStatusOptionsData);

const searchByFilter = () => {
	console.log('searchByFilter');
};
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
