<template>
	<div class="wrapper-tab-groupOrderDetails">
		<CommonTable :columns="columns" :dataSource="dataSource">
			<template #bodyCell="{ column }">
				<!-- <template v-if="column.dataIndex === 'auditStatus'">
				<div class="cell-auditStatus">
					<span class="item">{{ getAuditStatusName(parseInt(record?.auditStatus)) }}</span>
				</div>
			</template> -->
				<template v-if="column.dataIndex === 'actions'">
					<div class="cell-actions">
						<span class="item">查看行程单</span>
					</div>
				</template>
			</template>
		</CommonTable>
		<div class="footer-container">
			<div class="form-item footer-item">
				<a-button html-type="submit" @click="save" class="button">保存</a-button>
				<a-button class="button" @click="submit">提交</a-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import { message } from 'ant-design-vue';
interface DataSourceItem {
	id: string | number;
	travelAgencyName: string;
	groupId: string;
	roomNum: number;
	peopleNum: number;
}

const columns: TableColumnsType = [
	{
		title: '旅行社名称',
		dataIndex: 'travelAgencyName',
		key: 'travelAgencyName',
	},
	{
		title: '团号',
		dataIndex: 'groupId',
		key: 'groupId',
	},
	{
		title: '用房数（标）',
		dataIndex: 'roomNum',
		key: 'roomNum',
	},
	{
		title: '人数（人）',
		dataIndex: 'peopleNum',
		key: 'peopleNum',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 200,
	},
];

const router = useRouter();

const dataSource: Array<DataSourceItem> = ref([
	{
		id: 1,
		travelAgencyName: '丽江黑水旅行社',
		groupId: 'sasahygdsyh',
		roomNum: 10,
		peopleNum: 20,
	},
	{
		id: 2,
		travelAgencyName: '白云黑土旅行社',
		groupId: 'HDHIASDHKJ',
		roomNum: 20,
		peopleNum: 30,
	},
	{
		id: 3,
		travelAgencyName: '泰洋旅行社',
		groupId: 'WDJSDHWMME',
		roomNum: 40,
		peopleNum: 41,
	},
]);

// const dataSource = computed(() => {
// 	if (Array.isArray(tableState.tableData.data)) {
// 		return tableState.tableData.data.map((item) => {
// 			return {
// 				...item,
// 				key: item?.id,
// 			};
// 		});
// 	}
// });

const tableState = reactive({
	tableData: {
		data: dataSource,
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			travelAgencyName: undefined,
			groupId: undefined,
			roomNum: undefined,
			peopleNum: undefined,
		},
	},
});

const save = () => {
	message.success('保存成功');
	router.push({ path: '/hotelManagement/roomStatus' });
};

const submit = () => {
	message.success('提交成功');
	router.push({ path: '/hotelManagement/roomStatus' });
};
</script>

<style lang="less" scoped>
@import './styles/groupOrderDetails.less';
</style>
