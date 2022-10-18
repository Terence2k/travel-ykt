<template>
	<CommonSearch v-show="activeKey === '1'">
		<search-item label="企业类型">
			<a-select placeholder="请选择企业类型" v-model:value="tableData.param.businessType" allowClear>
				<a-select-option v-for="item in businessTypeOption" :value="item.codeValue">{{ item.name }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="所属地区">
			<address-selector placeholder="请选择所属地区" v-model:value="tableData.param.regionCode" @change="regionChange"
				:key="activeKey">
			</address-selector>
		</search-item>
		<search-item label="启用状态">
			<a-select ref="select" placeholder="请选择启用状态" v-model:value="tableData.param.onOff" allowClear>
				<a-select-option :value="1">已启用</a-select-option>
				<a-select-option :value="0">已禁用</a-select-option>
			</a-select>
		</search-item>
		<search-item label="企业名称">
			<a-input v-model:value.trim="tableData.param.name" placeholder="请输入企业名称" allowClear />
		</search-item>
		<template #button>
			<a-button @click="onQuery">查询</a-button>
		</template>
	</CommonSearch>
	<CommonSearch v-show="activeKey === '2'">
		<search-item label="企业类型">
			<a-select placeholder="请选择企业类型" v-model:value="auditTableData.param.businessType" allowClear>
				<a-select-option v-for="item in businessTypeOption" :value="item.codeValue">{{ item.name }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="所属地区">
			<address-selector placeholder="请选择所属地区" v-model:value="auditTableData.param.regionCode" @change="regionChange"
				:key="activeKey">
			</address-selector>
		</search-item>
		<search-item label="企业名称">
			<a-input v-model:value.trim="auditTableData.param.name" placeholder="请输入企业名称" allowClear />
		</search-item>
		<template #button>
			<a-button @click="onQuery">查询</a-button>
		</template>
	</CommonSearch>
	<CommonSearch v-show="activeKey === '3'">
		<search-item label="企业类型">
			<a-select placeholder="请选择企业类型" v-model:value="failTableData.param.businessType" allowClear>
				<a-select-option v-for="item in businessTypeOption" :value="item.codeValue">{{ item.name }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="所属地区">
			<address-selector placeholder="请选择所属地区" v-model:value="failTableData.param.regionCode" @change="regionChange"
				:key="activeKey">
			</address-selector>
		</search-item>
		<search-item label="企业名称">
			<a-input v-model:value.trim="failTableData.param.name" placeholder="请输入企业名称" allowClear />
		</search-item>
		<template #button>
			<a-button @click="onQuery">查询</a-button>
		</template>
	</CommonSearch>
	<div class="tabs_box">
		<a-tabs v-model:activeKey="activeKey" @change="tabsChange">
			<a-tab-pane key="1" tab="已审核">
				<CommonTable :dataSource="tableData.data" :columns="columns">
					<template #bodyCell="{ column, record }">
						<template v-if="column.key === 'businessLicenseUrl'">
							<a-image width="100%" :src="record.businessLicenseUrl" />
						</template>
						<template v-if="column.key === 'action'">
							<div class="action-btns">
								<a @click="disable(record)" v-if="record.onOff">禁用</a>
								<a v-else @click="enable(record)">启用</a>
								<a @click="goTo(record, 'details')">查看</a>
								<a @click="resetPassword(record.oid)">重置密码</a>
							</div>
						</template>
					</template>
				</CommonTable>
				<div class="buttom_box">
					<div>共 <span style="color:#de0025">{{ tableData.total }}</span> 个企业</div>
					<CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
						:total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
				</div>
			</a-tab-pane>
			<a-tab-pane key="2" tab="待审核">
				<CommonTable :dataSource="auditTableData.data" :columns="auditColumns">
					<template #bodyCell="{ column, record }">
						<template v-if="column.key === 'businessLicenseUrl'">
							<a-image width="100%" :src="record.businessLicenseUrl" />
						</template>
						<template v-if="column.key === 'action'">
							<div class="action-btns">
								<template v-if="record?.isAudit">
									<a @click="auditEnterprise(record)">去审核</a>
								</template>
							</div>
						</template>
					</template>
				</CommonTable>
				<div class="buttom_box">
					<div>共 <span style="color:#de0025">{{ auditTableData.total }}</span> 个待审核企业信息</div>
					<CommonPagination v-model:current="auditTableData.param.pageNo"
						v-model:page-size="auditTableData.param.pageSize" :total="auditTableData.total"
						@change="auditOnHandleCurrentChange" @showSizeChange="auditPageSideChange" />
				</div>
			</a-tab-pane>
			<a-tab-pane key="3" tab="审核驳回">
				<CommonTable :dataSource="failTableData.data" :columns="failColumns">
					<template #bodyCell="{ column, record }">
						<template v-if="column.key === 'businessLicenseUrl'">
							<a-image width="100%" :src="record.businessLicenseUrl" />
						</template>
						<template v-if="column.key === 'action'">
							<div class="action-btns">
								<a @click="goTo(record, 'details')">查看</a>
							</div>
						</template>
					</template>
				</CommonTable>
				<div class="buttom_box">
					<div>共 <span style="color:#de0025">{{ failTableData.total }}</span> 个被驳回的企业信息审核记录</div>
					<CommonPagination v-model:current="failTableData.param.pageNo"
						v-model:page-size="failTableData.param.pageSize" :total="failTableData.total"
						@change="failOnHandleCurrentChange" @showSizeChange="failPageSideChange" />
				</div>
			</a-tab-pane>
			<template #rightExtra>
				<a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
			</template>
		</a-tabs>
	</div>
	<CommonModal title="禁用提醒" v-model:visible="disableVisible" @cancel="disableCancel" @close="disableCancel"
		@conform="disableConform" :conform-text="'确认'">
		是否禁用该企业？禁用后该企业超级管理员仍可登录后台，但无法执行任何管理操作，且该企业的其他角色管理员无法登录后台。
	</CommonModal>
	<CommonModal title="强制重置密码" v-model:visible="resetPasswordVisible" @cancel="resetPasswordCancel"
		@close="resetPasswordCancel" @conform="resetPasswordConform" :conform-text="'确认'">
		<a-form ref="formRef" name="reset-password" :model="formState" :rules="rules" v-bind="layout">
			<a-form-item has-feedback label="输入新密码" name="pass">
				<a-input v-model:value="formState.pass" type="password" autocomplete="off" />
			</a-form-item>
			<a-form-item has-feedback label="再输入一次" name="checkPass">
				<a-input v-model:value="formState.checkPass" type="password" autocomplete="off" />
			</a-form-item>
		</a-form>
	</CommonModal>
	<CommonModal title="审核企业注册信息" v-model:visible="auditVisible" @close="auditClose" @conform="auditConform"
		:conform-text="'同意入驻'" :cancel-text="'驳回注册'" width="50%">
		<div class="table_box">
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key">注册时间</td>
					<td class="value">{{ details.lastUpdateTime }}</td>
				</tr>
				<tr class="row">
					<td class="key">企业类型</td>
					<td class="value">{{ details.businessTypeName }}</td>
				</tr>
				<tr class="row">
					<td class="key">企业名称</td>
					<td class="value">{{ details.name }}</td>
				</tr>
				<tr class="row">
					<td class="key">统一社会信用代码</td>
					<td class="value">{{ details.creditCode }}</td>
				</tr>
				<tr class="row">
					<td class="key">管理员姓名</td>
					<td class="value">{{ details.contactName }}</td>
				</tr>
				<tr class="row">
					<td class="key">管理员手机号</td>
					<td class="value">{{ details.phone }}</td>
				</tr>
				<tr class="row">
					<td class="key">所属地区</td>
					<td class="value">{{ details.regionName }}</td>
				</tr>
				<tr class="row">
					<td class="key">营业执照</td>
					<td class="value">
						<a-image width="200px" :src="details.businessLicenseUrl" />
					</td>
				</tr>
			</table>
		</div>
	</CommonModal>
	<CommonModal :title="registerAuditTitle" v-model:visible="registerAuditVisible" @close="registerAuditClose"
		@conform="registerAuditConform" :conform-text="'确定'">
		<span v-if="isRegiste">
			您即将批准 {{details.name}} 的注册申请，批准后该企业管理员将可以登录一卡通后台继续完善信息
		</span>
		<span v-else>
			您即将批准 {{details.name}} 的企业信息变更申请，是否已检查无误？
		</span>
	</CommonModal>
	<CommonModal :title="failTitle" v-model:visible="failVisible" @close="failClose" @cancel="failClose"
		@conform="failConform" :conform-text="'确定'">
		<a-form ref="failFormRef" :model="failForm" :rules="failFormRules" name="fail-form" autocomplete="off"
			labelAlign="left" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
			<a-form-item name="auditRemark" label="驳回原因">
				<a-textarea v-model:value="failForm.auditRemark" placeholder="请输入驳回原因" :rows="2">
				</a-textarea>
			</a-form-item>
		</a-form>
	</CommonModal>
	<CommonModal title="审核企业变更信息" v-model:visible="changeAuditVisible" @close="auditClose" @cancel="changeAuditCancel"
		@conform="auditConform" :conform-text="'同意变更'" :cancel-text="'驳回变更'" width="50%">
		<div class="table_box">
			<table class="change_table" cellpadding="16px" border="1">
				<tr class="row">
					<th class="key_hd">变更项目</th>
					<th class="key_hd">变更前内容</th>
					<th class="key_hd">变更后内容</th>
				</tr>
				<tr class="row" v-for="(item,index) in changeKeys" :key="index">
					<td class="key">{{ keyNameList[item] }}</td>

					<td class="value" v-if="['manageUrl','businessLicenseUrl'].includes(item) && oldArrList[item]">
						<a-image width="200px" :src="oldArrList[item]" />
					</td>
					<td class="value" v-else-if="item === 'regionCode'">
						<address-selector v-if="oldArrList[item][0]" key="oldadd" style="width:100%"
							v-model:value="oldArrList[item]" disabled>
						</address-selector>
					</td>
					<td class="value" v-else>{{ getComputedVal(item, oldArrList[item]) }}</td>

					<td class="value" v-if="['manageUrl','businessLicenseUrl'].includes(item) && newArrList[item]">
						<a-image width="200px" :src="newArrList[item]" />
					</td>
					<td class="value" v-else-if="item === 'regionCode'">
						<address-selector v-if="newArrList[item][0]" key="newadd" style="width:100%"
							v-model:value="newArrList[item]" disabled>
						</address-selector>
					</td>
					<td class="value" v-else>{{ getComputedVal(item, newArrList[item]) }}</td>
				</tr>
			</table>
		</div>
	</CommonModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import type { Rule } from 'ant-design-vue/es/form';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import { keys } from 'lodash';
import { any } from 'vue-types';
const businessManageOptions = useBusinessManageOption();
const router = useRouter();
const route = useRoute();
const goTo = (value: any, name: string) => {
	let newObj: any = {
		oid: encodeURIComponent(JSON.stringify(value.oid)),
		businessType: encodeURIComponent(JSON.stringify(value.businessType))
	}
	router.push({
		name: name,
		params: newObj
	})
}
const activeKey = ref('1')
const modalVisible = ref(false)
const disableVisible = ref(false)
const resetPasswordVisible = ref(false)
const auditVisible = ref(false)
const registerAuditVisible = ref(false)
const failVisible = ref(false)
const changeAuditVisible = ref(false)
const isRegiste = ref(true)
const failFormRules: Record<string, Rule[]> = {
	auditRemark: [{ required: true, trigger: 'blur', message: '请输入驳回原因' }],
}
const registerAuditTitle = computed(() => {
	return isRegiste.value ? '企业注册审核确认' : '企业信息变更审核确认'
})
const failTitle = computed(() => {
	return isRegiste.value ? '驳回企业注册' : '驳回企业信息变更'
})
const getComputedVal = computed(() => (key: string, val: any) => {
	if (key === 'accountType') {
		return val == 1 ? '对公账户' : '对私账户'
	} else if (key === 'unitStatus') {
		return val == 1 ? '停业' : '开业'
	} else if (key === 'isReduced') {
		return val == 1 ? '是' : '否'
	} else {
		return val
	}
})
const failForm = reactive({
	auditTypeCode: 1,
	auditRemark: '',
	uuid: '',
	roleId: '',
	businessType: '',
	/* 
	2 审核通过
	3 审核不通过
	 */
	auditStatus: 2
})
const failFormRef = ref()
type detailsType = {
	lastUpdateTime?: string,
	businessTypeName?: string,
	name?: string,
	creditCode?: string | number,
	contactName?: string,
	phone?: string | number,
	regionName?: string,
	businessLicenseUrl?: string
}
const details = reactive<detailsType>({
	lastUpdateTime: undefined,
	businessTypeName: undefined,
	name: undefined,
	creditCode: undefined,
	contactName: undefined,
	phone: undefined,
	regionName: undefined,
	businessLicenseUrl: undefined
})
const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 },
};
const formRef = ref()
const formState = reactive({
	componyId: '',
	pass: '',
	checkPass: '',
})
let validatePass = async (_rule: Rule, value: string) => {
	if (value === '') {
		return Promise.reject('请输入密码！');
	} else {
		if (formState.checkPass !== '') {
			formRef.value.validateFields('checkPass');
		}
		return Promise.resolve();
	}
};
let validatePass2 = async (_rule: Rule, value: string) => {
	if (value === '') {
		return Promise.reject('请再次输入密码！');
	} else if (value !== formState.pass) {
		return Promise.reject("两次输入的密码不一致！");
	} else {
		return Promise.resolve();
	}
};
const rules: Record<string, Rule[]> = {
	pass: [{ required: true, validator: validatePass, trigger: 'change' }],
	checkPass: [{ validator: validatePass2, trigger: 'change' }],
};

const initOpeion = async () => {
	await businessManageOptions.getBusinessTypeOption();
};
const businessTypeOption = computed(() => businessManageOptions.businessTypeOption);
const commonColumns = [
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
		title: '统一社会信用代码',
		dataIndex: 'creditCode',
		key: 'creditCode',
	},
	{
		title: '营业执照',
		dataIndex: 'businessLicenseUrl',
		key: 'businessLicenseUrl',
	},
	{
		title: '企业来源',
		dataIndex: 'source',
		key: 'source',
	},
	{
		title: '联系人',
		dataIndex: 'contactName',
		key: 'contactName',
	},
]
const columns = [
	...commonColumns,
	{
		title: '超管账号',
		dataIndex: 'account',
		key: 'account',
	},
	{
		title: '入驻时间',
		dataIndex: 'lastUpdateTime',
		key: 'lastUpdateTime',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	},
]
const auditColumns = [
	...commonColumns,
	{
		title: '联系人手机号',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '信息提交时间',
		dataIndex: 'lastUpdateTime',
		key: 'lastUpdateTime',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	},
]
const failColumns = [
	...commonColumns,
	{
		title: '联系人手机号',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '审核驳回时间',
		dataIndex: 'lastUpdateTime',
		key: 'lastUpdateTime',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	},
]
const commonParams = {
	businessType: undefined, //业态
	regionCode: undefined,
	provinceId: undefined, //省id
	cityId: undefined, //市id
	areaId: undefined, //县id
	/* 
	1 待审核
	2 审核通过
	3 审核不通过
	*/
	// auditStatus: 2, //审核状态
	name: undefined, //企业名称
	// onOff: undefined //是否禁用
}
const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			auditStatus: 2,
			onOff: undefined,
			...commonParams
		},
	},
	auditTableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			auditStatus: 1,
			...commonParams
		},
	},
	failTableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			auditStatus: 3,
			...commonParams
		},
	}
});
const {
	tableData,
	auditTableData,
	failTableData,
} = toRefs(state)
const keyNameList = {
	// businessType: '企业类型',
	name: '企业名称',
	regionCode: '企业所属地区',
	// provinceId: '省',
	// cityId: '市',
	// areaId: '县',
	addressDetail: '企业详情地址',
	legalPerson: '法定代表人',
	managementRange: '经营范围',
	registeredCapital: '注册资本',
	establishTime: '成立日期',
	businessTerm: '营业期限',
	contactName: '联系人',
	phone: '联系电话',
	accountType: '公司账户类型',
	bankAccountName: '公司账户名称',
	bank: '开户行',
	bankAccount: '公司账号',
	creditCode: '统一社会信用代码',
	businessLicenseUrl: '营业执照',
	// manageUrl: '经营许可证',
	hotelStarCode: '星级',
	unitStatus: '开业状态', //  0-开业 1-停业
	isReduced: '是否支持减免', // 0-否 1-是
	reduceRule: '减免规则',
	startTime: '开始营业时间', // '营业时间',
	endTime: '结束营业时间',
	shopPhone: '店铺联系电话',
	cateringDesc: '其他'
}
const newArrList = ref<any>({})
const oldArrList = ref<any>({})
const changeKeys = ref<string[]>([])
const regionChange = () => {
	switch (activeKey.value) {
		case '1':
			state.tableData.param.provinceId = state.tableData.param.regionCode ? state.tableData.param.regionCode[0] : undefined
			state.tableData.param.cityId = state.tableData.param.regionCode ? state.tableData.param.regionCode[1] : undefined
			state.tableData.param.areaId = state.tableData.param.regionCode ? state.tableData.param.regionCode[2] : undefined
			break;
		case '2':
			state.auditTableData.param.provinceId = state.auditTableData.param.regionCode ? state.auditTableData.param.regionCode[0] : undefined
			state.auditTableData.param.cityId = state.auditTableData.param.regionCode ? state.auditTableData.param.regionCode[1] : undefined
			state.auditTableData.param.areaId = state.auditTableData.param.regionCode ? state.auditTableData.param.regionCode[2] : undefined
			break;
		case '3':
			state.failTableData.param.provinceId = state.failTableData.param.regionCode ? state.failTableData.param.regionCode[0] : undefined
			state.failTableData.param.cityId = state.failTableData.param.regionCode ? state.failTableData.param.regionCode[1] : undefined
			state.failTableData.param.areaId = state.failTableData.param.regionCode ? state.failTableData.param.regionCode[2] : undefined
			break;
	}
}

const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	onSearch();
}

const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	onSearch();
}
const auditOnHandleCurrentChange = (val: number) => {
	state.auditTableData.param.pageNo = val;
	onAuditSearch();
}
const auditPageSideChange = (current: number, size: number) => {
	state.auditTableData.param.pageSize = size;
	onAuditSearch();
}
const failOnHandleCurrentChange = (val: number) => {
	state.failTableData.param.pageNo = val;
	onFailSearch();
}
const failPageSideChange = (current: number, size: number) => {
	state.failTableData.param.pageSize = size;
	onFailSearch();
}
const onSearch = () => {
	api.findCompanyList(state.tableData.param).then((res: any) => {
		state.tableData.data = res.content;
		state.tableData.total = res.total;
	})
}
const onAuditSearch = async () => {
	let res = await api.findCompanyList(state.auditTableData.param)
	const uuids: (string | number)[] = []
	res.content.forEach((item: any) => {
		if (item.auditUuid) {
			uuids.push(item.auditUuid)
		}
	})
	if (uuids.length > 0) {
		let res1 = await api.getAuditButton({ uuIds: uuids })
		if (res1?.length > 0) {
			res.content.forEach((item: any) => {
				res1.forEach((citem: any) => {
					if (item.auditUuid === citem.uuid) {
						item.uuid = citem.uuid
						item.roleId = citem.roleId
						item.auditBusinessType = citem.auditBusinessType
						item.isAudit = true
					}
				})
			})
		}
	}
	state.auditTableData.data = res.content;
	state.auditTableData.total = res.total;
}
const onFailSearch = () => {
	api.findCompanyList(state.failTableData.param).then((res: any) => {
		state.failTableData.data = res.content;
		state.failTableData.total = res.total;
	})
}
const tabsChange = (val: string) => {
	switch (val) {
		case '1':
			if (state.tableData.data.length === 0) {
				onSearch()
			}
			break;
		case '2':
			if (state.auditTableData.data.length === 0) {
				onAuditSearch()
			}
			break;
		case '3':
			if (state.failTableData.data.length === 0) {
				onFailSearch()
			}
			break;
	}
}
const onQuery = () => {
	switch (activeKey.value) {
		case '1':
			state.tableData.param.pageNo = 1
			onSearch()
			break;
		case '2':
			state.auditTableData.param.pageNo = 1
			onAuditSearch()
			break;
		case '3':
			state.failTableData.param.pageNo = 1
			onFailSearch()
			break;
	}
}
const auditEnterprise = async (record: any) => {
	failForm.uuid = record.uuid
	failForm.roleId = record.roleId
	failForm.businessType = record.auditBusinessType
	details.name = record.name
	if (record.source === '企业注册') {
		isRegiste.value = true
		auditVisible.value = true
		let key: keyof detailsType
		for (key in details) {
			if (Object.prototype.hasOwnProperty.call(details, key)) {
				details[key] = record[key];
			}
		}
	} else if (record.source === '信息变更') {
		const res = await api.getChangeBeforeAfterData(record.oid, record.businessType)
		const newList = flat(res?.new)
		const oldList = flat(res?.old)
		let keyList = Object.keys(keyNameList)
		keyList.forEach((key: string) => {
			if (newList[key] != oldList[key]) {
				newArrList.value[key] = newList[key]
				oldArrList.value[key] = oldList[key]
				changeKeys.value.push(key)
			}
		})
		const newRegion = [newList?.provinceId, newList?.cityId, newList?.areaId]
		const oldRegion = [oldList?.provinceId, oldList?.cityId, oldList?.areaId]
		if (newRegion.toString() !== oldRegion.toString()) {
			newArrList.value['regionCode'] = newRegion
			oldArrList.value['regionCode'] = oldRegion
			changeKeys.value.push('regionCode')
			let i = changeKeys.value.indexOf('addressDetail')
			let j = changeKeys.value.indexOf('regionCode')
			if (i !== -1 && j !== -1) {
				changeKeys.value.splice(j, 1)
				changeKeys.value.splice(i, 0, 'regionCode')
			}
		}
		changeAuditVisible.value = true
		isRegiste.value = false
	}
}

const flat = (target: any) => {
	let obj: any = {};
	let process = (_target: any) => {
		if (Object.prototype.toString.call(_target) === '[object Object]') {
			let keys = Object.keys(_target)
			keys.forEach(item => {
				if (Object.prototype.toString.call(_target[item]) === '[object Object]') {
					process(_target[item])
				} else {
					obj[item] = _target[item]
				}
			})
		}
	}
	process(target)
	return obj
}

interface addInterface {
	row?: any
	handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
	// modalVisible.value = true
	router.push({
		name: 'addBusinessAccount',
	})
}
const resetPassword = async (oid: string) => {
	formState.componyId = oid
	resetPasswordVisible.value = true
}
const resetPasswordCancel = () => {
	resetPasswordVisible.value = false
	formRef.value.resetFields();
}
const resetPasswordConform = () => {
	formRef.value.validateFields().then(async () => {
		let res = await api.resetPassword({ componyId: formState.componyId, newPassword: formState.pass })
		if (res == '重置成功') {
			message.success('重置密码成功！');
			onSearch();
			resetPasswordCancel();
		} else {
			message.error(res);
		}
	})
}
const onOffCompanyParams = reactive({
	oid: undefined,
	operation: 0
})
const disable = (record: any) => {
	disableVisible.value = true
	onOffCompanyParams.oid = record.oid
}
const enable = async (record: any) => {
	onOffCompanyParams.oid = record.oid
	onOffCompanyParams.operation = 1
	let res = await api.onOffCompany(onOffCompanyParams)
	if (res) {
		message.success('启用成功！')
		onSearch();
	} else {
		message.error('启用失败！')
	}
}
const disableCancel = () => {
	disableVisible.value = false
}
const disableConform = async () => {
	onOffCompanyParams.operation = 0
	let res = await api.onOffCompany(onOffCompanyParams)
	if (res) {
		onSearch();
		disableVisible.value = false
		message.success('禁用成功！')
	} else {
		message.error('禁用失败！')
	}
}
const auditClose = () => {
	failVisible.value = true
}
const auditConform = () => {
	registerAuditVisible.value = true
}
const registerAuditClose = () => {
	registerAuditVisible.value = false
}
const registerAuditConform = async () => {
	// 审核通过
	failForm.auditStatus = 2
	let res = await api.auditCompany(toRaw(failForm))
	if (res) {
		message.success('审核成功！')
		auditVisible.value = false
		registerAuditVisible.value = false
		changeAuditVisible.value = false
		onSearch()
		onAuditSearch()
	} else {
		message.error('审核失败！')
	}
}
const failClose = () => {
	failFormRef.value.resetFields()
	failVisible.value = false
}
const failConform = () => {
	failFormRef.value.validateFields().then(async () => {
		// 审核不通过
		failForm.auditStatus = 3
		let res = await api.auditCompany(toRaw(failForm))
		if (res) {
			message.success('驳回成功！')
			auditVisible.value = false
			failVisible.value = false
			changeAuditVisible.value = false
			onFailSearch()
			onAuditSearch()
		} else {
			message.error('驳回失败！')
		}
	})
}
const changeAuditCancel = () => {
	newArrList.value = {}
	oldArrList.value = {}
	changeKeys.value = []
}
onActivated(() => {
	if (route.params?.isRefresh === '1') {
		onSearch()
	}
})
onMounted(() => {
	initOpeion()
	onSearch()
	// onAuditSearch()
	// onFailSearch()
})
</script>

<style scoped lang="scss">
.tabs_box {
	padding: 20px;
}

.table-area {
	padding: unset;
}

.buttom_box {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.table_box {
	max-height: 80vh;
	padding: 1px 0;
	overflow: auto;

	.row {
		width: 100%;
		font-size: 14px;
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		color: #1E2226;
		border: 1px solid #E9E9E9;
	}

	.change_table {
		width: 100%;

		.key,
		.key_hd {
			width: 150px;
		}

		.key_hd {
			background: rgba(245, 247, 250, 0.39);
		}

		.value {
			min-width: 300px;
		}
	}

	.info_table {
		width: 100%;

		.key {
			width: 150px;
			background: rgba(245, 247, 250, 0.39);
		}
	}
}
</style>
