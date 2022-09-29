<template>
	<div class="warp">
		<!-- <header>基本信息</header> -->
		<div class="title">基本信息</div>

		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-form-item label="预结算状态" required>
				<span>{{ formData.data.aaa }}</span>
			</a-form-item>
			<a-form-item label="团单类型" required>
				<span>{{ formData.data.bbb }}</span>
			</a-form-item>
			<a-form-item label="行程单号" required>
				<span>{{ formData.data.ccc || '' }}</span>
			</a-form-item>
			<a-form-item label="自编团号" required>
				<span>{{ formData.data.ddd }}</span>
			</a-form-item>
            <a-form-item label="线路名称" required>
				<span>{{ formData.data.eee }}</span>
			</a-form-item>
            <a-form-item label="发团旅行社" required>
				<span>{{ formData.data.fff }}</span>
			</a-form-item>
            <a-form-item label="接团旅行社" required>
				<span>{{ formData.data.ggg }}</span>
			</a-form-item>
            <a-form-item label="行程时间" required>
				<span>{{ formData.data.hhh }}</span>
			</a-form-item>
            <a-form-item label="导游" required>
				<span>{{ formData.data.iii }}</span>
			</a-form-item>
            <a-form-item label="游客人数" required>
				<span>{{ formData.data.jjj }}</span>
			</a-form-item>
            <a-form-item label="费用合计" required>
				<span>{{ formData.data.kkk }}</span>
			</a-form-item>
            <a-form-item label="结算费用" required>
				<span>{{ formData.data.lll }}</span>
			</a-form-item>

			<div class="title titleMargin">结算信息</div>
			<CommonTable :dataSource="formData.list" :columns="columns" :scrollY="false" :scroll="{ y: '300px' }">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="editItem(record)">调整费用</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>
		<div class="footer">
			<div class="tooter-btn">
				<a-button type="primary" @click.prevent="toPass">审核通过</a-button>
				<a-button  @click.prevent="onCancel">取消</a-button>
			</div>
		</div>
	</div>
	<adjust-modal v-model="adjustData.rulesShow" @submit="adjustConfirm" :params="adjustData.rulesParams" />
</template>

<script lang="ts" setup>
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import AdjustModal from '@/views/settlementManagement/settlement/examine/adjustModal.vue';
import lodash from 'lodash';

const route = useRouter();
const tstyle = { 'font-weight': '700' };

// 取消
const onCancel = () => {
	route.push({ path: '/settlementManagement/settlement/list' ,query: { edit: 1, oid: route.currentRoute.value?.query?.oid } });
};
const columns = [
	{
		title: '编号',
        customRender: ({ text, record, index }) => {
            return `${ index + 1 }`;
        }
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
	data: {
		aaa: 'test',
        bbb: 'test',
        ccc: 'test',
        ddd: 'test',
        eee: 'test',
        fff: 'test',
        ggg: 'test',
        hhh: 'test',
        iii: 'test',
        jjj: 'test',
        kkk: 'test',
        lll: 'test',
	},
    list: [
        {
            oid: 1,
            key: 1,
            type: 'John Brown sr.',
            name: 'test',
            bank: 'test',
            price: 'test',
            time: 'test',
        },
        {
            oid: 1,
            key: 1,
            type: 'John Brown sr.',
            name: 'test',
            bank: 'test',
            price: 'test',
            time: 'test',
        },
        {
            oid: 1,
            key: 1,
            type: 'John Brown sr.',
            name: 'test',
            bank: 'test',
            price: 'test',
            time: 'test',
        },
    ],
});
// 缓存编辑表格模态框数据
const adjustData= ref({
	delIndex: null,
	delShow: false,
	editItem: {},
	rulesShow: false,
	rulesParams: {},
});

// 审核通过
const toPass = (() => {
    Modal.confirm({
		title: '审核通过',
		width: 560,
		closable: true,
		centered: true,
		icon: false,
		content: '是否确定所选数据审核通过？',
		onOk() {
			// api
			// 	.comprehensiveFeeEnable(record.oid)
			// 	.then((res: any) => {
					message.success('操作成功');
					onCancel();
			// 	})
			// 	.catch((err: any) => {
			// 		message.error(err || '操作失败');
			// 	});
		},
		onCancel() {},
	});
})
// 调整费用
const editItem = ((record: any) => {
    console.log('调整费用id',record);
    adjustData.value.rulesShow = true;
	adjustData.value.rulesParams = { from: lodash.cloneDeep(record) };
})
// 调整费用模态框关闭回调 此时调用接口
const adjustConfirm = ((e: any) => {
    console.log('我回来了');
    console.log(e);
    // 
})
//初始化页面
const initPage = async (): Promise<void> => {
	// api.getcomprehensiveFeeDetail(route.currentRoute.value?.query?.oid).then((res: any) => {
	// 	formData.data = res;
	// });
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
.ant-form-item {
	font-size: 14px;
	font-family: Microsoft YaHei UI;
	font-weight: 400;
	color: #1e2226;
	margin-top: 6px;
	margin-bottom: 0;
	height: 32px;
}
.ant-form-item:first-child {
    margin-top: 13px;
}
::v-deep(.ant-form-item-control-input) {
	height: 18px;
}
::v-deep(.ant-form-item-label > label) {
	position: relative;
	display: inline-flex;
	align-items: center;
	max-width: 100%;
	height: 32px;
	font-size: 14px;
	font-family: Microsoft YaHei UI;
	font-weight: 400;
	color: #1e2226;
}
.table-area {
    padding: 0;
    margin-bottom: 16px;
}
</style>
