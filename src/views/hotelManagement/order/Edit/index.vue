<template>
	<div class="warp">
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane key="1" tab="订单信息" force-render>
					<div class="form_pad">
						<header>行程信息</header>
						<a-form name="basic" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
							<a-form-item label="行程类型"> 标准团 </a-form-item>
							<a-form-item label="行程单号"> YNLJ1569374 </a-form-item>
							<a-form-item label="发团旅行社"> 黑白水旅行社 </a-form-item>
							<a-form-item label="接团旅行社"> 白鹿旅行社 </a-form-item>
							<a-form-item label="行程时间"> 2022.2.23 - 2022.2.25 </a-form-item>
							<a-form-item label="行程人数"> 30人 </a-form-item>
							<a-form-item label="预定人数"> 25人 </a-form-item>
							<a-form-item label="预定房数"> 10标 </a-form-item>

							<div class="title">订房信息</div>
							<CommonTable :columns="columns" :dataSource="data123" :scrollY="false">
								<template #bodyCell="{ column, index }">
									<template v-if="column.key === 'index'">
										<div>
											{{ index + 1 }}
										</div>
									</template></template
								>
							</CommonTable>
						</a-form>
					</div>
				</a-tab-pane>
				<a-tab-pane key="2" tab="人员信息" force-render>
					<div class="form_pad">
						<CommonTable :columns="columns2" :dataSource="data2" :scrollY="false">
							<template #bodyCell="{ column, index }">
								<template v-if="column.key === 'index'">
									<div>
										{{ index + 1 }}
									</div>
								</template></template
							>
						</CommonTable>
					</div>
				</a-tab-pane>
			</a-tabs>
		</div>
		<BaseModal :title="'审核'" v-model="visible">
			<a-form>
				<a-form-item label="状态">
					<a-radio-group v-model:value="state.tableData.type">
						<a-radio value="1">通过</a-radio>
						<a-radio value="2">不通过</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="" v-if="statusType == 1">
					<a-textarea placeholder="审核不通过原因" :rows="4" />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" @click="success">保存</a-button>
				<a-button style="width: 76px" @click="visible = false">关闭</a-button>
			</template>
		</BaseModal>
		<div class="footer">
			<a-button type="primary" @click="auditing()">审核通过</a-button>
			<a-button type="primary" @click="notAuditing()">审核不通过</a-button>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
const navigatorBar = useNavigatorBar();
import { onMounted, reactive, toRaw, UnwrapRef, watch, ref } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import CommonTable from '@/components/common/CommonTable.vue';
const router = useRouter();

const route = useRouter();
const visible = ref(false);
const activeKey = ref('2');
const statusType = ref(0);

const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '房间类型',
		dataIndex: 'b',
		key: 'b',
	},
	{
		title: '单价',
		dataIndex: 'c',
		key: 'c',
	},
	{
		title: '预定数量(标)',
		dataIndex: 'd',
		key: 'd',
	},
	{
		title: '小计(元)',
		dataIndex: 'e',
		key: 'e',
	},
];
const columns2 = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '证件类型',
		dataIndex: 'b',
		key: 'b',
	},
	{
		title: '证件号码',
		dataIndex: 'c',
		key: 'c',
	},
	{
		title: '身份类型',
		dataIndex: 'd',
		key: 'd',
	},
	{
		title: '姓名',
		dataIndex: 'e',
		key: 'e',
	},
	{
		title: '性别',
		dataIndex: 'f',
		key: 'f',
	},
	{
		title: '健康状态',
		dataIndex: 'g',
		key: 'g',
	},
	{
		title: '入住情况',
		dataIndex: 'h',
		key: 'h',
	},
];
const data123 = [
	{
		b: '标准间',
		c: '150',
		d: '10',
		e: '1,500',
	},
	{
		b: '大床房',
		c: '200',
		d: '2',
		e: '400',
	},
];
const data2 = [
	{
		b: '身份证',
		c: '530100196605067895',
		d: '成人',
		e: '王某某',
		f: '女',
		g: '绿码',
		h: '待入住',
	},
];

const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			phone: null,
			name: null,
			auditStatus: null,
		},
		type: '2',
	},
});

const auditing = () => {
	visible.value = true;
	statusType.value = 0;
	message.success('审核通过');
	router.push({ path: '/hotelManagement/hotelOrder/index' });
};
const success = () => {
	visible.value = false;
	message.error('审核不通过');
	router.push({ path: '/hotelManagement/hotelOrder/index' });
};
const notAuditing = () => {
	visible.value = true;
	statusType.value = 1;
};

// const initPage = async (): Promise<void> => {
// 	console.log(route.currentRoute.value?.query?.oid);
// 	api.getCateringInfo(route.currentRoute.value?.query?.oid).then((res: any) => {
// 		formData.data = res;
// 	});
// };

onMounted(() => {
	// initPage();
	navigatorBar.setNavigator(['订单管理', '查看']);
	const data123 = ref([
		{
			b: '标准间',
			c: '150',
			d: '10',
			e: '1,500',
		},
		{
			b: '大床房',
			c: '200',
			d: '2',
			e: '400',
		},
	]);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>
<style lang="less" scoped>
.warp {
	.trave-contaner {
		height: 100%;
		::v-deep(.ant-tabs-nav) {
			padding: 16px 20px;
		}
		// ::v-deep(.ant-tabs-content-holder) {
		//   padding: 0 20px;
		// }
	}
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
	width: 100%;
	box-sizing: border-box;
	.edit_btn {
		background-color: #5db179;
		color: white;
		border-radius: 5px;
	}

	.form_pad {
		padding: 0 16px 100px;
	}
	.footer {
		position: fixed;
		bottom: 11px;
		background-color: #fff;
		line-height: 64px;
		width: 83.5%;
		border-top: 1px solid #f1f2f5;
		button {
			margin-left: 20px;
		}
	}
	// .ant-form-item{
	//     margin-bottom: 10px;
	// }
}
</style>
