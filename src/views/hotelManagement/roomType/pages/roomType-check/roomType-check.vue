<template>
	<div class="roomType-check-wrapper">
		<div class="content-container">
			<div class="title-bar"></div>

			<div class="table-bar">
				<div class="table-container">
					<CommonTable :columns="columns" :dataSource="dataSource">
						<template #bodyCell="{ column, record }">
							<!-- <template v-if="column.dataIndex === 'auditStatus'">
								<div class="cell-auditStatus">
									<span class="item">{{ getAuditStatusName(record?.auditStatus) }}</span>
								</div>
							</template> -->
							<!-- <template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span @click="openNewPageByAction(record?.oid, record?.auditStatus)" class="item">
										{{ getActionText(record?.auditStatus) }}
									</span>
								</div>
							</template> -->
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
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import api from '@/api';
const columns: TableColumnsType = [
	{
		title: '序号',
		dataIndex: 'oid',
		key: 'oid',
	},
	{
		title: '自定义房型',
		dataIndex: 'roomType',
		key: 'roomType',
	},
	{
		title: '所属系统房型',
		dataIndex: 'systemRoomType',
		key: 'systemRoomType',
	},
	{
		title: '诚信指导价',
		dataIndex: 'price',
		key: 'price',
	},
	{
		title: '房间总数量',
		dataIndex: 'roomTotal',
		key: 'roomTotal',
	},
	{
		title: '每间可住人数',
		dataIndex: 'capacity',
		key: 'capacity',
	},
	{
		title: '本次变更类型',
		dataIndex: 'actionType',
		key: 'actionType',
	},
];

const state = reactive({});
</script>

<style lang="less" scoped>
@import './styles/roomType-check.less';
</style>
