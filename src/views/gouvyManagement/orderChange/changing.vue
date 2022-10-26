<template>
	<div class="warp">
		<header>行程信息</header>
		<div class="go-div">
			<a-button type="primary" @click="go">返回上一级</a-button>
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
			<div v-if="state.tableData.index.index == '1'">
				<a-button type="primary" class="success" @click="adopt">审核通过</a-button>
				<a-button type="primary" class="btn" @click="dialogVisible = true">审核不通过</a-button>
			</div>
			<div class="title">申请减免人员</div>
			<CommonTable :dataSource="dataSource" :columns="columns">
				<template #bodyCell="{ column, index }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="download">下载证明</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<BaseModal title="审核不通过说明" v-model="dialogVisible">
			<a-form>
				<a-form-item label="">
					<a-textarea placeholder="审核不通过原因" :rows="4" />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary"  @click="cancel">关闭</a-button>
				<a-button type="primary" style="width:120px" @click="Fail">确认审核不通过</a-button>
			</template>
		</BaseModal>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import BaseModal from '@/components/common/BaseModal.vue';
const route = useRouter();
const dialogVisible = ref(false);
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
const go =()=>{
	route.push({ path: '/gouvyManagement/orderChange/list'});
}
const cancel =()=>{
	dialogVisible.value = false
}
const Fail =()=>{
	message.error('审核未通过');
	dialogVisible.value = false
	go()
}
const adopt =()=>{
	message.success('审核已通过');
	go()
}
const download =()=>{
	message.success('下载成功');
	go()
}
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
	.go-div{
	width: 100%;
	text-align: right;
}
}
</style>
