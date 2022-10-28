<template>
	<div class="wrapper-tab-roomInfo">
		<!-- <a-form ref="formRef" :rules="rulesRef" :model="editableData" autocomplete="off" labelAlign="left"> -->
		<CommonTable :columns="columns" :data-source="dataSource">
			<template #bodyCell="{ column, text, record }">
				<template v-if="['roomTypeName'].includes(column.dataIndex)">
					<div>
						<a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
						<template v-else>
							<a-input :disabled="true" :defaultValue="text" />
						</template>
					</div>
				</template>
				<template v-if="['price'].includes(column.dataIndex)">
					<div>
						<a-input :disabled="true" type="number" v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
						<template v-else>
							<a-input :disabled="true" :defaultValue="text" />
						</template>
					</div>
				</template>
				<template v-if="['roomNum'].includes(column.dataIndex)">
					<div>
						<a-input type="number" v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
						<template v-else>
							<a-input :disabled="true" :defaultValue="text" />
						</template>
					</div>
				</template>
				<template v-if="['roomTypeCode'].includes(column.dataIndex)">
					<div>
						<a-select
							@change="changeRoomOccupancyNum(editableData[record.key])"
							v-if="editableData[record.key]"
							v-model:value="editableData[record.key][column.dataIndex]"
							:options="systemRoomNameOptions"
						>
						</a-select>

						<template v-else>
							<a-select :disabled="true" :value="text" :options="systemRoomNameOptions"> </a-select>
						</template>
					</div>
				</template>
				<template v-if="['roomOccupancyNum'].includes(column.dataIndex)">
					<div>
						<a-input
							:disabled="true"
							type="number"
							style="width: 16%"
							v-if="editableData[record.key]"
							v-model:value="editableData[record.key][column.dataIndex]"
						/>
						<template v-else>
							<a-input style="width: 16%" :disabled="true" :defaultValue="text" />
						</template>
					</div>
				</template>
				<template v-else-if="column.dataIndex === 'actions'">
					<div class="cell-actions">
						<span class="item" @click="edit(record.key)">{{ editableData[record.key] ? '取消' : '编辑' }}</span>
						<span class="item" @click="remove(record.key)">删除</span>
					</div>
				</template>
			</template>
			<template #summary>
				<a-table-summary-row class="row-summary">
					<a-table-summary-cell></a-table-summary-cell>
					<a-table-summary-cell></a-table-summary-cell>
					<a-table-summary-cell></a-table-summary-cell>
					<a-table-summary-cell></a-table-summary-cell>
					<a-table-summary-cell class="cell-actions">
						<a-button @click="add" class="button-add">添加</a-button>
					</a-table-summary-cell>
				</a-table-summary-row>
			</template>
		</CommonTable>
		<!-- </a-form> -->
		<div class="footer">
			<!-- <a-button @click="saveRoomInfo" class="button-save button">保存</a-button> -->
			<a-button :class="{ mdisabled: state.isAuditStatus }" :disabled="state.isAuditStatus" class="button-submit button" @click="saveRoomInfo"
				>提交审核</a-button
			>
		</div>
		<!-- <CommonPagination
			class="pagination-custom"
			:current="tableState.tableData.param.pageNo"
			:page-size="tableState.tableData.param.pageSize"
			:total="tableState.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		>
		</CommonPagination> -->
	</div>
</template>

<script setup lang="ts">
import { toRaw } from 'vue';
import { cloneDeep } from 'lodash-es';
import { message } from 'ant-design-vue/es';
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';

// import CommonPagination from '@/components/common/CommonPagination.vue';

const route = useRoute();
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
const columns = [
	{
		title: '自定义房型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
		width: '12%',
	},
	{
		title: '系统房型',
		dataIndex: 'roomTypeCode',
		key: 'roomTypeCode',
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
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: '16%',
	},
];
interface DataSourceItem {
	key: string | number;
	auditOrderId: string;
	auditStatus: number;
	hotelId: string | number;
	oid: string | number;
	roomTypeCode?: string | number;
	roomTypeName: string;
	systemRoomName: string;
	price: number;
	roomNum: number;
	roomOccupancyNum: number;
}

const dataSource: DataSourceItem[] = ref([]);

const systemRoomData = ref([]);
const systemRoomNameOptions = ref<SelectProps['options']>(systemRoomData);

const state = reactive({
	hotelId: 0,
	isAuditStatus: false,
	systemRoomAllData: [],
	roomInfoResponse: [],
	roomInfoRequest: [],
	//errorTip: {},
});

const edit = (key: string) => {
	if (editableData[key]) {
		delete editableData[key];
	} else {
		editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
		editableData[key].operationType = 1;
	}
};

const remove = (key: string) => {
	if (editableData[key]) {
		if (key.startsWith('NEW_')) {
			delete editableData[key];
		} else {
			editableData[key].operationType = 2;
		}
	} else {
		editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
		editableData[key].operationType = 2;
	}
	dataSource.value = dataSource.value.filter((item) => key !== item.key);
};

const initPage = () => {
	for (let property in editableData) {
		delete editableData[`${property}`];
	}
	api
		.getRoomDetailInfo({}, state.hotelId)
		.then((res) => {
			console.info(`id${state.hotelId}房型信息:`, res);

			if (Array.isArray(res) && res.length > 0) {
				state.roomInfoResponse.value = res;
				dataSource.value = res
					.filter((item) => item.auditStatus !== 3)
					.map((item) => {
						if (item.auditStatus === 1) {
							state.isAuditStatus = true;
						}
						return {
							...item,
							price: item.price / 100,
							key: item?.oid,
						};
					});
			} else {
				state.roomInfoResponse.value = [];
				dataSource.value = [];
			}
		})
		.catch((err) => {
			console.error(err);
		});

	api.getEnableSystemRoomType().then((res) => {
		state.systemRoomAllData = res;
		systemRoomData.value = res.map((item) => {
			return {
				value: item.oid,
				label: item.sysRoomTypeCode,
			};
		});
	});
};

watch(
	() => route.query,
	(res) => {
		state.hotelId = route?.query?.id;
		if (state.hotelId) {
			initPage();
		}
	},
	{
		immediate: true,
	}
);

const saveRoomInfo = () => {
	console.info('editableData :', editableData, toRaw(editableData));
	const editableRawData = toRaw(editableData);
	let editableArray = [];
	for (let property in editableRawData) {
		editableArray.push(editableRawData[property]);
	}
	console.info('editableArray', editableArray);
	const result = editableArray
		?.filter((item) => JSON.stringify(item) !== '{}')
		.map((item) => {
			console.log('item', item);
			if (item.oid) {
				return {
					oid: item.oid,
					hotelId: parseInt(item.hotelId),
					roomTypeName: item.roomTypeName,
					roomTypeCode: item.roomTypeCode,
					roomNum: parseInt(item.roomNum),
					roomOccupancyNum: parseInt(item.roomOccupancyNum),
					operationType: parseInt(item.operationType),
				};
			} else {
				if (item?.key) {
					return {
						hotelId: parseInt(item.hotelId),
						roomTypeName: item.roomTypeName,
						roomTypeCode: item.roomTypeCode,
						roomNum: parseInt(item.roomNum),
						roomOccupancyNum: parseInt(item.roomOccupancyNum),
						operationType: parseInt(item.operationType),
					};
				}
			}
		});
	console.info('保存的房型信息：', result);

	api
		.editRoomDetailInfo(result)
		.then((res) => {
			console.info('编辑房型信息返回：', res);
			initPage();
			message.success('保存成功');
		})
		.catch((err) => {
			message.error(err);
			console.error(err);
		});
};

const add = () => {
	const newData = {
		key: `NEW_${Date.now().toString()}`,
		auditOrderId: '',
		auditStatus: 1,
		hotelId: parseInt(state.hotelId),
		roomTypeCode: systemRoomData?.value[0]?.value || 1,
		roomNum: 0,
		roomOccupancyNum: 0,
		operationType: 0,
		price: '',
	};
	dataSource.value.push(newData);
	if (editableData[newData.key]) {
		console.log('aaaaaaaaa');
		editableData[newData.key].operationType = 0;
	} else {
		editableData[newData.key] = cloneDeep(dataSource.value.filter((item) => newData.key === item.key)[0]);
		editableData[newData.key].operationType = 0;
		const roomOccupancyNum = state.systemRoomAllData.find((item) => item.oid === editableData[newData.key].roomTypeCode)?.roomOccupancyNum;

		editableData[newData.key].roomOccupancyNum = roomOccupancyNum;
		newData.roomOccupancyNum = roomOccupancyNum;
		console.log('editableData[newData.key].roomOccupancyNum', state.systemRoomAllData);
	}
};

const changeRoomOccupancyNum = (target) => {
	target.roomOccupancyNum = state.systemRoomAllData.find((item) => item.oid === target.roomTypeCode)?.roomOccupancyNum;
};
</script>

<style lang="less" scoped>
@import './styles/roomInfo.less';
</style>
