<template>
	<div class="wrapper-tab-roomInfo">
		<CommonTable :columns="columns" :data-source="dataSource">
			<template #bodyCell="{ column, text, record }">
				<template v-if="['customRoomType', 'price', 'roomTotal'].includes(column.dataIndex)">
					<div>
						<a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
						<template v-else>
							<a-input :disabled="true" :defaultValue="text" />
						</template>
					</div>
				</template>
				<template v-if="['systemRoomType'].includes(column.dataIndex)">
					<div>
						<a-select v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" :options="systemRoomTypeOptions">
						</a-select>

						<template v-else>
							<a-select :disabled="true" :value="text" :options="systemRoomTypeOptions"> </a-select>
						</template>
					</div>
				</template>
				<template v-if="['roomCapacity'].includes(column.dataIndex)">
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
					</div>
				</template>
			</template>
		</CommonTable>
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
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { cloneDeep } from 'lodash-es';
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const columns = [
	{
		title: '自定义房型',
		dataIndex: 'customRoomType',
		key: 'customRoomType',
		width: '12%',
	},
	{
		title: '系统房型',
		dataIndex: 'systemRoomType',
		key: 'systemRoomType',
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
		dataIndex: 'roomTotal',
		key: 'roomTotal',
		width: '8%',
	},
	{
		title: '房间可入住人数',
		dataIndex: 'roomCapacity',
		key: 'roomCapacity',
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
	customRoomType: string | number;
	systemRoomType: string | number;
	price: number;
	roomTotal: number;
	roomCapacity: number;
}
const dataSource: DataSourceItem[] = ref([
	{
		key: 1,
		customRoomType: '山景标准间',
		systemRoomType: 1,
		price: 120,
		roomTotal: 30,
		roomCapacity: 3,
	},
	{
		key: 2,
		customRoomType: '山景标准间',
		systemRoomType: 2,
		price: 120,
		roomTotal: 30,
		roomCapacity: 3,
	},
]);

const systemRoomTypeOptions = ref<SelectProps['options']>([
	{
		value: 1,
		label: '山景标准间',
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

const edit = (key: string) => {
	if (editableData[key]) {
		delete editableData[key];
	} else {
		editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
	}
};
</script>

<style lang="less" scoped>
@import './styles/roomInfo.less';
</style>
