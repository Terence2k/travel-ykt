<template>
	<CommonSearch>
		<search-item label="企业类型">
			<a-select placeholder="请选择企业类型" v-model:value="tableData.param.businessType" allowClear>
				<a-select-option v-for="item in businessTypeOption" :value="item.codeValue">{{ item.name }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="所属地区">
			<address-selector placeholder="请选择所属地区" v-model:value="tableData.param.regionCode" @change="regionChange">
			</address-selector>
		</search-item>
		<search-item label="状态">
			<a-select ref="select" placeholder="请选择状态" v-model:value="tableData.param.auditStatus" allowClear>
				<a-select-option :value="1">待审核</a-select-option>
				<a-select-option :value="2">审核通过</a-select-option>
				<a-select-option :value="3">审核不通过</a-select-option>
			</a-select>
		</search-item>
		<search-item label="企业名称">
			<a-input v-model:value="tableData.param.name" placeholder="请输入企业名称" />
		</search-item>
		<template #button>
			<a-button @click="onSearch">查询</a-button>
		</template>
	</CommonSearch>
	<CommonTable :dataSource="tableData.data" :columns="columns">
		<template #button>
			<a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
		</template>
		<template #bodyCell="{ column, record }">
			<template v-if="column.key === 'businessLicenseUrl'">
				<a-image width="100%" :src="record.businessLicenseUrl" />
			</template>
			<template v-if="column.key === 'action'">
				<div class="action-btns">
					<a @click="goTo(record, 'check')" v-show="checkVisible(record.auditStatus) && record?.auditState">审核</a>
					<a-popconfirm title="确认重制密码吗?重制后默认密码为：123456" ok-text="确认" cancel-text="取消"
						@confirm="resetPassword(record.oid)">
						<a v-show="restVisible(record.auditStatus)">重置密码</a>
					</a-popconfirm>
					<a @click="goTo(record, 'details')">查看</a>
				</div>
			</template>
		</template>
	</CommonTable>
	<CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
		:total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
	<add-business-account v-model:modalVisible="modalVisible" @success="onSearch"></add-business-account>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import addBusinessAccount from '@/views/baseInfoManage/businessManagement/components/addBusinessAccount.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
const businessManageOptions = useBusinessManageOption();
const router = useRouter();
const route = useRoute();
const goTo = (value: any, name: string) => {
	let newObj: any = {}
	for (const key in value) {
		if (Object.prototype.hasOwnProperty.call(value, key)) {
			newObj[key] = encodeURIComponent(JSON.stringify(value[key]));
		}
	}
	router.push({
		name: name,
		params: newObj
	})
}
const modalVisible = ref(false)
const initOpeion = async () => {
	await businessManageOptions.getBusinessTypeOption();
};
const businessTypeOption = computed(() => businessManageOptions.businessTypeOption);
const checkVisible = computed(() => (val: number) => {
	let a = false
	switch (val) {
		case 1:
			a = true
			break
		case 2:
		case 3:
			a = false
			break
	}
	return a
})
const restVisible = computed(() => (val: number) => {
	let a = false
	switch (val) {
		case 2:
			a = true
			break
		case 1:
		case 3:
			a = false
			break
	}
	return a
})
const columns = [
	{
		title: '企业名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '企业类型',
		dataIndex: 'businessTypeName',
		key: 'businessTypeName',
	},
	{
		title: '所属地区',
		dataIndex: 'regionName',
		key: 'regionName',
	},
	{
		title: '信用代码',
		dataIndex: 'creditCode',
		key: 'creditCode',
	},
	{
		title: '营业执照',
		dataIndex: 'businessLicenseUrl',
		key: 'businessLicenseUrl',
	},
	{
		title: '状态',
		dataIndex: 'auditStatusText',
		key: 'auditStatusText',
	},
	{
		title: '管理员',
		dataIndex: 'contactName',
		key: 'contactName',
	},
	{
		title: '账号',
		dataIndex: 'account',
		key: 'account',
	},
	/* {
		title: '佐证',
		dataIndex: 'businessLicenseUrl',
		key: 'businessLicenseUrl',
	}, */
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	},
]

const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			businessType: undefined,
			regionCode: undefined,
			auditStatus: undefined,
			name: undefined,
			provinceId: undefined,
			cityId: undefined,
			areaId: undefined
		},
	}
});
const { tableData } = toRefs(state)

const regionChange = () => {
	state.tableData.param.provinceId = state.tableData.param.regionCode ? state.tableData.param.regionCode[0] : undefined
	state.tableData.param.cityId = state.tableData.param.regionCode ? state.tableData.param.regionCode[1] : undefined
	state.tableData.param.areaId = state.tableData.param.regionCode ? state.tableData.param.regionCode[2] : undefined
}

const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	onSearch();
}

const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	onSearch();
}

const onSearch = async () => {
	/* api.findCompanyList(state.tableData.param).then((res: any) => {
		res.content.forEach(async (item: any) => {
			if (item.auditStatus === 1) {
				item.auditStatusText = '待审核'
			} else if (item.auditStatus === 2) {
				item.auditStatusText = '审核通过'
			} else if (item.auditStatus === 3) {
				item.auditStatusText = '审核不通过'
			}
			console.log(item.auditUuid);
			if (item.auditUuid) {
				let res = await api.getAuditButton({ uuid: item.auditUuid })
				if (res) {
					item.auditState = res
				}
			}
		})
		state.tableData.data = res.content;
		state.tableData.total = res.total;
		console.log(state.tableData.data,'#######');
	}) */
	let res = await api.findCompanyList(state.tableData.param)
	await res.content.forEach((item: any) => {
		return new Promise<void>(async (resolve, reject) => {
			if (item.auditStatus === 1) {
				item.auditStatusText = '待审核'
			} else if (item.auditStatus === 2) {
				item.auditStatusText = '审核通过'
			} else if (item.auditStatus === 3) {
				item.auditStatusText = '审核不通过'
			}
			console.log(item.auditUuid);
			if (item.auditUuid) {
				let res1 = await api.getAuditButton({ uuid: item.auditUuid })
				if (res1) {
					item.auditState = res1
				}
			}
		})
	})
	state.tableData.data = res.content;
	state.tableData.total = res.total;
}
interface addInterface {
	row?: any
	handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
	modalVisible.value = true
}
const resetPassword = async (oid: string) => {
	let res = await api.resetPassword({ oid })
	if (res == '重置成功') {
		message.success('重置密码成功！');
	} else {
		message.error(res);
	}
}
onActivated(() => {
	if (route.params?.isRefresh) {
		onSearch()
	}
})
onMounted(() => {
	initOpeion()
	onSearch()
})
</script>

<style scoped lang="scss">

</style>
