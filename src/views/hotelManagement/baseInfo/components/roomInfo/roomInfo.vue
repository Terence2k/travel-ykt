<template>
	<div class="wrapper-tab-roomInfo">
		<CommonTable :columns="columns" :data-source="dataSource">
			<template #bodyCell="{ column, text, record }">
				<template v-if="['roomTypeName', 'price', 'roomNum'].includes(column.dataIndex)">
					<div>
						<a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
						<template v-else>
							<a-input :disabled="true" :defaultValue="text" />
						</template>
					</div>
				</template>
				<template v-if="['systemRoomName'].includes(column.dataIndex)">
					<div>
						<a-select v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" :options="systemRoomNameOptions">
						</a-select>

						<template v-else>
							<a-select :disabled="true" :value="text" :options="systemRoomNameOptions"> </a-select>
						</template>
					</div>
				</template>
				<template v-if="['roomOccupancyNum'].includes(column.dataIndex)">
					<div>
						<a-input style="width: 16%" v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
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
		<div class="footer">
			<a-button @click="saveRoomInfo" class="button-save button">保存</a-button>
			<a-button class="button-submit button">提交审核</a-button>
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
import { cloneDeep } from 'lodash-es';
import { message } from 'ant-design-vue/es';
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';

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
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: '16%',
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
const dataSource: DataSourceItem[] = ref([]);

const systemRoomNameOptions = ref<SelectProps['options']>([
	{
		value: 1,
		label: '标准间',
	},
	{
		value: 2,
		label: '湖畔风光间',
	},
	{
		value: 3,
		label: '原始风情间',
	},
	{
		value: 4,
		label: '现代商务间',
	},
]);

const state = reactive({
	hotelId: 0,
	roomInfoResponse: [],
	roomInfoRequest: [],
});

const edit = (key: string) => {
	if (editableData[key]) {
		delete editableData[key];
	} else {
		editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
	}
};

watch(
	route,
	(res) => {
		state.hotelId = route?.query?.id;
		if (state.hotelId) {
			api
				.getRoomDetailInfo({}, state.hotelId)
				.then((res) => {
					console.info(`id${state.hotelId}房型信息:`, res);

					if (Array.isArray(res) && res.length > 0) {
						state.roomInfoResponse.value = res;
						dataSource.value = res.map((item) => {
							return {
								...item,
								price: item.price / 100,
								key: item?.oid,
							};
						});
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}
	},
	{
		immediate: true,
	}
);

const saveRoomInfo = () => {
	const result = cloneDeep(Object.values(editableData)).map((item) => {
		delete item.key;
		return {
			...item,
			price: item.price * 100,
		};
	});
	cloneDeep(dataSource.value).forEach((item) => {
		if (item?.key && editableData[item.key]) {
			console.log('被修改的key：', item.key);
		} else {
			delete item.key;
			result.push({
				...item,
				price: item.price * 100,
			});
		}
	});
	console.info('保存的房型信息：', result);
	api
		.editRoomDetailInfo(result)
		.then((res) => {
			console.info('编辑房型信息返回：', res);
			message.success('保存成功');
		})
		.catch((err) => {
			message.error(err);
			console.error(err);
		});
};

const add = () => {
	dataSource.value.push({
		hotelId: state.hotelId,
		key: Date.now().toString(),
		roomTypeCode: '',
		roomTypeName: '',
		systemRoomName: '标准间',
		price: 100,
		roomNum: 0,
		roomOccupancyNum: 0,
	});
};
</script>

<style lang="less" scoped>
@import './styles/roomInfo.less';
</style>
