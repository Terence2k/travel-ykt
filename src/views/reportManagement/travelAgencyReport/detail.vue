<template>
	<div class="warp">
		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<div class="title titleMargin">结算信息</div>
			<CommonTable :dataSource="formData.list" :columns="columns" :scrollY="false" :scroll="{ y: '300px' }">
				<template #bodyCell="{ column, record ,index}">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="itemDetail(record.oid)">分账明细</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>
		<div class="footer">
			<div class="tooter-btn">
				<a-button type="primary" @click.prevent="onCancel">返回</a-button>
			</div>
		</div>
	</div>
	<detail-modal v-model="adjustData.detailShow" :params="adjustData.modalParams" />

</template>

<script lang="ts" setup>
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import DetailModal from '@/views/reportManagement/travelAgencyReport/detailModal.vue';
import lodash from 'lodash';

const route = useRouter();
const tstyle = { 'font-weight': '700' };

// 取消
const onCancel = () => {
	route.go(-1)
};
const columns = [
	{
		title: '序号',
        customRender: ({ text, record, index }) => {
            return `${ index + 1 }`;
        }
	},
    {
		title: '行程单号',
		dataIndex: 'type',
		key: 'type',
	},
	{
		title: '结算方类别',
		dataIndex: 'type',
		key: 'type',
	},
	{
		title: '结算方',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '结算账户',
		dataIndex: 'bank',
		key: 'bank',
	},
	{
		title: '结算费用（元）',
		dataIndex: 'price',
		key: 'price',
	},
	{
		title: '结算时间',
		dataIndex: 'time',
		key: 'time',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];
const formData: any = reactive({
    list: [
        {
            oid: 1,
            key: 1,
            type: 'John Brown sr.',
            name: 'test',
            bank: 'test',
            price: '1001',
            time: 'test',
        },
        {
            oid: 2,
            key: 1,
            type: 'John Brown sr.',
            name: 'test',
            bank: 'test',
            price: '1001',
            time: 'test',
        },
        {
            oid: 3,
            key: 1,
            type: 'John Brown sr.',
            name: 'test',
            bank: 'test',
            price: '1001',
            time: 'test',
        },
    ],
});
// 缓存编辑表格模态框数据
const adjustData= ref({
	modalParams: {},
	detailShow: false,
});

// 分账明细
const itemDetail = ((oid: any) => {
	adjustData.value.detailShow = true;
	adjustData.value.modalParams = { oid };
})
//初始化页面
const initPage = async (): Promise<void> => {
	// api.getcomprehensiveFeeDetail(route.currentRoute.value?.query?.oid).then((res: any) => {
		// 	formData.data = res;
		// });
	console.log(route.currentRoute.value?.query.oid);
	
};
onMounted(() => {
	initPage();
})

</script>

<style lang="less" scoped>
.warp {
	padding: 0 20px;
	padding-bottom: 64px;
	.title {
		height: 44px;
		line-height: 44px;
		font-weight: bold;
		color: #1e2226;
		margin-top: 12px;
		border-bottom: 1px solid #f1f2f5;
		font-size: 16px;
		font-family: Microsoft YaHei UI;
		font-weight: bold;
		color: #1e2226;
		box-sizing: content-box;
	}
    .titleMargin{
		margin-top: 24px;
	    margin-bottom: 20px;
    }
	.footer {
		position: fixed;
		bottom: 12px;
		line-height: 64px;
		height: 64px;
		width: calc(100% - 288px);
		border-top: 1px solid #f1f2f5;
		margin-left: -16px;
		margin-right: 24px;
		background-color: #fff;
		z-index: 99;

		.tooter-btn {
			width: 60%;
			margin-left: 16px;
		}
		button:first-of-type {
			margin-right: 16px;
		}
	}
}
.table-area {
    padding: 0;
    margin-bottom: 16px;
}
</style>
