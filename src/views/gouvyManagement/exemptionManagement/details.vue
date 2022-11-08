<template>
	<div class="warp">
		<div class="top-div">
			<header>行程信息</header>
			<a-button type="primary" style="margin-top: 15px" @click="go()">返回上一级</a-button>
		</div>
		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-form-item label="行程类型">
				<span>{{ state.tableData.data.teamTypeName }}</span>
			</a-form-item>
			<a-form-item label="行程单号">
				<span>{{ state.tableData.data.itineraryNo }}</span>
			</a-form-item>
			<a-form-item label="发团旅行社">
				<span>{{ state.tableData.data.travelName }}</span>
			</a-form-item>
			<a-form-item label="行程时间">
				<span>{{ state.tableData.data.itineraryStartDate }}~{{ state.tableData.data.itineraryEndDate }}</span>
			</a-form-item>
			<a-form-item label="联系电话">
				<span>{{ state.tableData.data.contactPhone }}</span>
			</a-form-item>
			<a-form-item label="行程人数">
				<span>{{ state.tableData.data.touristNum }}</span>
			</a-form-item>
			<a-form-item label="本次申请减免">
				<span>{{ state.tableData.data.reduceNum }}人</span>
			</a-form-item>
			<a-form-item label="已经生效减免">
				<span>{{ state.tableData.data.validReduceNum }}人</span>
			</a-form-item>
			<a-form-item label="已在他处购买">
				<span>{{ state.tableData.data.anotherPurchaseNum }}人</span>
			</a-form-item>
			<div class="center">
				<p class="p" v-if="state.tableData.data.auditStatus == '-1'">
					审核结果：<span class="span"
						>本次审核已于 {{ state.tableData.data.lastUpdateTime }} 由管理员 {{ state.tableData.data.lastUpdaterName }} 执行驳回; 驳回理由：{{
							refuesedReason
						}}</span
					>
				</p>
				<p class="p" v-if="state.tableData.data.auditStatus == '1'">
					审核结果：<span class="span"
						>本次审核已于 {{ state.tableData.data.lastUpdateTime }} 由管理员 {{ state.tableData.data.lastUpdaterName }} 执行通过</span
					>
				</p>
			</div>
			<div class="center" v-if="state.tableData.data.auditStatus == '0'">
				<a-button type="primary" class="success" @click="adopt">审核通过</a-button>
				<a-button type="primary" class="btn" @click="dialogVisible = true">审核不通过</a-button>
			</div>
			<div class="title">申请减免人员</div>
			<CommonTable :dataSource="state.tableData.data.applyReduceTouristList" :columns="columns" :scrollY="false">
				<template #bodyCell="{ column, index }">
					<template v-if="column.key === ''">
						<div class="action-btns">
							<a href="javascript:;" @click="download">下载证明</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<BaseModal title="审核不通过说明" v-model="dialogVisible">
				<a-form>
					<a-form-item label="">
						<a-textarea placeholder="审核不通过原因" v-model:value="state.refuesedReason" :rows="4" />
					</a-form-item>
				</a-form>
				<template v-slot:footer>
					<a-button type="primary" @click="cancel">关闭</a-button>
					<a-button type="primary" style="width: 120px" @click="Fail">确认审核不通过</a-button>
				</template>
			</BaseModal>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import api from '@/api';
const route = useRoute();
const router = useRouter();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
const tstyle = { 'font-weight': '700' };
const dataSource = [{}];
const state = reactive({
	tableData: {
		data: [],
		index: {},
		type: '2',
	},
	refuesedReason: '',
});
const columns = [
	{
		title: '证件类型',
		dataIndex: 'certificateTypeName',
		key: 'certificateTypeName',
	},
	{
		title: '证件号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '特殊证件类型',
		dataIndex: 'specialCertificateTypeName',
		key: 'specialCertificateTypeName',
	},
	{
		title: '姓名',
		dataIndex: 'touristName',
		key: 'touristName',
	},
	{
		title: '性别',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '申请减免类型',
		dataIndex: 'discountRuleName',
		key: 'discountRuleName',
	},
	{
		title: '特殊证件证明',
		dataIndex: 'specialCertificateImg',
		key: 'specialCertificateImg',
	},
	{
		title: '系统自动检查结果',
		dataIndex: 'address5',
		key: 'address5',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];
const cancel = () => {
	dialogVisible.value = false;
};
const Fail = () => {
	let data = {
		oid: state.tableData.data.oid,
		refuesedReason: state.refuesedReason,
	};
	api.noAuditFailed({oid: state.tableData.data.oid,refuesedReason: state.refuesedReason}).then((res) => {
		message.error('审核未通过');
		dialogVisible.value = false;
	});
};
const adopt = () => {
	api.AuditFailed(state.tableData.data.oid).then((res) => {
		message.success('审核已通过');
		go()
	});
};
const download = () => {
	message.success('下载成功');
};
const informationList = () => {
	api.ExemptionManagementDetail(route?.query?.oid).then((res) => {
		state.tableData.data = res;
	});
};
const go = () => {
	router.push({ path: '/gouvyManagement/exemptionManagement/list' });
};
onMounted(() => {
	informationList();
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
		margin-bottom: 10px;
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
	.go-div {
		width: 100%;
		text-align: right;
	}
	.p {
		font-size: 18px;
		color: rgb(215, 215, 215);
		margin-top: 20px;
	}
	.span {
		color: #1e2226;
	}
	.center {
		text-align: center;
	}
	.top-div {
		display: flex;
		justify-content: space-between;
	}
}
</style>
