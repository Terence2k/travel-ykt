<template>
	<div class="warp">
		<div class="top-div">
			<header>行程信息</header>
			<a-button type="primary" style="margin-top:15px;" @click="go()">返回上一级</a-button>
		</div>
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
			<!-- <div v-if="state.tableData.index.index=='1'">
				<a-button type="primary" class="success" @click="adopt">审核通过</a-button>
				<a-button type="primary" class="btn" @click="dialogVisible = true">审核不通过</a-button>
			</div> -->
			<div class="title">订单信息</div>
			<a-form-item label="订单编号">
				<span>30人</span>
			</a-form-item>
			<a-form-item label="当前状态">
				<span>30人</span>
			</a-form-item>
			<a-form-item label="费用明细">
				<span>30人</span>
			</a-form-item>
			<a-form-item label="费用总计">
				<span>30人</span>
			</a-form-item>
			<div class="title">购买人员明细</div>
			<CommonTable :dataSource="dataSource" :columns="columns">
				<p>当前古维费已经于 {{}} 全部出票。全部游客{{}}名,已减免{{}}人,实缴{{}}人。</p>
				<template #bodyCell="{ column, index }">
					<template v-if="column.key === 'action'">
						<!-- <div class="action-btns">
							<a href="javascript:;" @click="download">下载证明</a>
						</div> -->
					</template>
				</template>
			</CommonTable>
			<!-- <BaseModal title="审核不通过说明" v-model="dialogVisible">
			<a-form>
				<a-form-item label="">
					<a-textarea placeholder="审核不通过原因" :rows="4" />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary"  @click="cancel">关闭</a-button>
				<a-button type="primary" style="width:120px" @click="Fail">确认审核不通过</a-button>
			</template>
		</BaseModal> -->
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
const route = useRouter();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
const tstyle = { 'font-weight': '700' };
const dataSource = [];
const state = reactive({
	tableData: {
		data:[]
	},
});
const columns = [
	{
		title: '购买状态',
		dataIndex: 'purchasedName',
		key: 'purchasedName',
	},
	{
		title: '游客姓名',
		dataIndex: 'touristName',
		key: 'touristName',
	},
	{
		title: '身份证件类型',
		dataIndex: 'certificateTypeName',
		key: 'certificateTypeName',
	},
	{
		title: '身份证号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
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
		title: '联系方式',
		dataIndex: 'purchased',
		key: 'purchased',
	},
	{
		title: '客源地',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '减免规则',
		dataIndex: 'discountRuleName',
		key: 'discountRuleName',
	},
	{
		title: '实际缴费金额',
		dataIndex: 'actualPrice',
		key: 'actualPrice',
	},
];
const go = () => {
	route.push({ path: '/gouvyManagement/order/list' });
};
const onSearch=()=>{
	
}
onMounted(() => {
	onSearch()
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
	.top-div{
		display: flex;
		justify-content: space-between;
	}
}
</style>
