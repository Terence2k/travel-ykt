<template>
	<div class="wrapper-tab-roomInfo-display">
		<CommonTable :columns="columns" :data-source="dataSource">
			<template #bodyCell="{ column, record, text }">
				<div>
					<template v-if="['roomTypeName', 'price', 'roomNum'].includes(column.dataIndex)">
						<div>
							<span>{{ text }}</span>
						</div>
					</template>
					<template v-if="['systemRoomName'].includes(column.dataIndex)">
						<div>
							<span>{{ text }}</span>
						</div>
					</template>
					<template v-if="['roomOccupancyNum'].includes(column.dataIndex)">
						<div>
							<span>{{ text }}</span>
						</div>
					</template>
					<template v-if="column.dataIndex === 'actions'">
						<div class="cell-actions">
							<span>{{ getActionText(record.operationType) }}</span>
						</div>
					</template>
				</div>
			</template>
		</CommonTable>
		<div class="footer">
			<div class="button-container">
				<a-button @click="auditPass" class="button">审核通过</a-button>
				<a-button @click="auditFail" class="button">审核不通过</a-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue/es';
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
const route = useRoute();
const columns = [
	{
		title: '自定义房型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
		width: '12%',
	},
	{
		title: '系统房型',
		dataIndex: 'systemRoomName',
		key: 'systemRoomName',
		width: '12%',
	},
	{
		title: '诚信指导价',
		dataIndex: 'price',
		key: 'price',
		width: '8%',
	},
	{
		title: '房间数量',
		dataIndex: 'roomNum',
		key: 'roomNum',
		width: '8%',
	},
	{
		title: '房间可入住人数',
		dataIndex: 'roomOccupancyNum',
		key: 'roomOccupancyNum',
		width: '44%',
	},

	{
		title: '操作类型',
		dataIndex: 'actions',
		key: 'actions',
		width: 160,
	},
];
interface DataSourceItem {
	hotelId: string | number;
	key: string | number;
	oid: string | number;
	roomTypeCode?: string | number;
	roomTypeName: string;
	systemRoomName: string;
	price: number;
	roomNum: number;
	roomOccupancyNum: number;
}

const state = reactive({
	hotelId: 0,
	auditOrderId: '',
});

const dataSource: DataSourceItem[] = ref([]);

const initPage = () => {
	api
		.getRoomDetailInfoInAuditStatus(state.hotelId)
		.then((res) => {
			console.info(`id${state.hotelId}审核中的房型信息:`, res);

			if (Array.isArray(res) && res.length > 0) {
				state.auditOrderId = res[0]?.auditOrderId;
				dataSource.value = res.map((item) => {
					return {
						...item,
						price: item.price / 100,
						key: item?.oid,
					};
				});
			} else {
				dataSource.value = [];
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

watch(
	() => route.query,
	(res) => {
		state.hotelId = res?.id;
		if (state.hotelId) {
			initPage();
		}
	},
	{
		immediate: true,
	}
);

const auditPass = () => {
	api
		.getRoleId({
			uuid: state.auditOrderId,
		})
		.then((res) => {
			console.log('getRoleId：', res);
			if (res[0]?.roleId) {
				api.auditRoomDetailInfo(state.auditOrderId, res[0]?.roleId, true).then((res) => {
					console.log('房型审核通过返回：', res);
					initPage();
				});
			}
		});
};

const auditFail = () => {
	api
		.getRoleId({
			uuid: state.auditOrderId,
		})
		.then((res) => {
			console.log('getRoleId：', res);
			if (res[0]?.roleId) {
				api.auditRoomDetailInfo(state.auditOrderId, res[0]?.roleId, false).then((res) => {
					console.log('房型审核不通过返回：', res);
					initPage();
				});
			}
		});
};

const getActionText = (code) => {
	let resultText = '';
	switch (code) {
		case 0:
			resultText = '新增';
			break;
		case 1:
			resultText = '编辑';
			break;
		case 2:
			resultText = '删除';
			break;
	}
	return resultText;
};
</script>

<style lang="less" scoped>
@import './styles/roomInfo-display.less';
</style>
