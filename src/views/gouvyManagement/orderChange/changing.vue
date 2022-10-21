<template>
	<div class="warp">
		<header>行程信息</header>
		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-form-item label="行程类型">
				<span>标准团</span>
			</a-form-item>
			<a-form-item label="行程单号">
				<span>YNLJ1569374</span>
			</a-form-item>
			<a-form-item label="发团旅行社">
				<span>黑白水旅行社</span>
			</a-form-item>
			<a-form-item label="行程时间">
				<span>2022.2.23~2022.2.25</span>
			</a-form-item>
			<a-form-item label="联系电话">
				<span>18101235678</span>
			</a-form-item>
			<a-form-item label="行程人数">
				<span>30人</span>
			</a-form-item>
			<a-form-item label="应购票人数">
				<span>30人</span>
			</a-form-item>
			<a-form-item label="减免人数">
				<span>30人</span>
			</a-form-item>
			<div v-if="state.tableData.index.index == '1'">
				<a-button type="primary" class="success">审核通过</a-button>
				<a-button type="primary" class="btn">审核不通过</a-button>
			</div>
			<div class="title">人员信息</div>
			<CommonTable :dataSource="dataSource" :columns="columns">
				<template #bodyCell="{ column, index }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;">下载证明</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
const route = useRouter();
const navigatorBar = useNavigatorBar();
const tstyle = { 'font-weight': '700' };
const dataSource = [
	{
		index: '1',
		name: '身份证',
		age: '441622199903126097',
		address: '成人',
		address2: '骆某某',
		address3: '男',
		address4: '正常',
		address5: '减免',
		address6: '100',
	},
];
const state = reactive({
	tableData: {
		index: {},
	},
});
const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '证件类型',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '证件号码',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '身份类型',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '姓名',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '性别',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '比对结果',
		dataIndex: 'address4',
		key: 'address4',
	},
	{
		title: '身份证明',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '购票情况',
		dataIndex: 'address5',
		key: 'address5',
	},
	{
		title: '购票金额（元）',
		dataIndex: 'address6',
		key: 'address6',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];
onMounted(() => {
	state.tableData.index = route.currentRoute.value?.query;
});
</script>

<style lang="less" scoped>
.warp {
	padding: 0 16px;
	header {
		// width: 64px;
		// margin-bottom: 8px;
		height: 56px;
		line-height: 56px;
		font-weight: bold;
		color: #1e2226;
		// margin: 0 8px 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
	}
	.title {
		height: 56px;
		line-height: 56px;
		font-weight: bold;
		color: #1e2226;
		// margin: 0 8px 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
	}
	.btn {
		margin-left: 50px;
	}
}
</style>
