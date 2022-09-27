<template>
	<div class="content_box">
		<div class="content content_left">
			<CommonTable :dataSource="tableData.data" :columns="columns" :scroll="{y:'100%'}">
				<template #button>
					<div class="query_box">
						<a-form autocomplete="off">
							<a-form-item label="查询">
								<a-input v-model:value="state.queryParams" placeholder="请输入ID或者名称" @change="queryList" />
							</a-form-item>
						</a-form>
						<a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
					</div>
				</template>
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a @click="addOrUpdate({  row: record,  handle: 'update'})" v-if="record.isEdit">编辑</a>
							<a-popconfirm title="确认删除这条数据吗？" ok-text="确认" cancel-text="取消" @confirm="confirmDelete(record)">
								<a>删除</a>
							</a-popconfirm>
							<a @click="viewDetails(record)">详情</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</div>
		<div class="content content_middle"></div>
		<div class="content content_right">
			<CommonTable :dataSource="detailsTableData.data" :columns=" detailsColumns" :scroll="{y:'100%'}">
				<template #button>
					<div class="query_box">
						<span class="detail_text">字典详情</span>
						<a-button type="primary" @click="detailsAddOrUpdate({ handle: 'add' })" :disabled="!isDetailsAdd">新增
						</a-button>
					</div>
				</template>
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a @click="detailsAddOrUpdate({  row: record,  handle: 'update'})">编辑</a>
							<a-popconfirm title="确认删除这条数据吗？" ok-text="确认" cancel-text="取消" @confirm="deleteDetailsRow(record)">
								<a>删除</a>
							</a-popconfirm>
						</div>
					</template>
				</template>
			</CommonTable>
			<CommonPagination v-model:current="detailsTableData.param.pageNo"
				v-model:pageSize="detailsTableData.param.pageSize" :total="detailsTableData.total"
				@change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
		</div>
	</div>
	<CommonModal title="新增字典" v-model:visible="modalVisible" @cancel="cancel" @close="cancel" @conform="save">
		<a-form :model="dictionaryForm" name="addDictionary" autocomplete="off" :label-col="labelCol"
			:wrapper-col="wrapperCol">
			<a-form-item label="字典名称" name="name" v-bind="validateInfos.name">
				<a-input v-model:value="dictionaryForm.name" placeholder="请输入字典名称" />
			</a-form-item>
			<a-form-item label="字典ID" name="codeValue" v-bind="validateInfos.codeValue">
				<a-input v-model:value="dictionaryForm.codeValue" placeholder="请输入字典ID" />
			</a-form-item>
		</a-form>
	</CommonModal>
	<CommonModal title="新增字典详情" v-model:visible="detailsModalVisible" @cancel="detailsCancel" @close="detailsCancel"
		@conform="detailsSave">
		<a-form :model="detailsDictionaryForm" name="addDictionaryDetails" autocomplete="off" :label-col="labelCol"
			:wrapper-col="wrapperCol">
			<a-form-item label="所属字典" name="parentId" v-bind="detailsForm.validateInfos.parentId">
				<a-select ref="select" v-model:value="detailsDictionaryForm.parentId" placeholder="请选择所属字典">
					<a-select-option :value="detailsDictionarySelect.oid">{{detailsDictionarySelect.name}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="字典标签" name="name" v-bind="detailsForm.validateInfos.name">
				<a-input v-model:value="detailsDictionaryForm.name" placeholder="请输入字典标签" />
			</a-form-item>
			<a-form-item label="排序" name="sort" v-bind="detailsForm.validateInfos.sort">
				<a-select ref="select" v-model:value="detailsDictionaryForm.sort" placeholder="请选择排序">
					<a-select-option v-for="item in sortList" :value="item">{{item}}</a-select-option>
				</a-select>
			</a-form-item>
		</a-form>
	</CommonModal>
</template>

<script setup lang="ts">
import CommonTable from './components/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { Form, message } from 'ant-design-vue';
import api from '@/api';
const columns = [
	{
		title: '字典名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '字典ID',
		dataIndex: 'codeValue',
		key: 'codeValue',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	},
]

const detailsColumns = [
	{
		title: '所属字典',
		dataIndex: 'pname',
		key: 'pname',
	},
	{
		title: '字典标签',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '排序',
		dataIndex: 'sort',
		key: 'sort',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	},
]

const labelCol = { span: 4 }
const wrapperCol = { span: 20 }
const useForm = Form.useForm;
const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			keyWord: '',
			roleIds: [],
			status: null,
		},
	},
	detailsTableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			pid: ''
		},
	},
	params: {},
	operationModal: {
		isAddOrUpdate: false,
		showDetails: false
	},
	optionRoleList: [],
	formState: {
		id: null
	},
	modalVisible: false,
	detailsModalVisible: false,
	dictionaryForm: {
		name: '',
		codeValue: '',
		oid: ''
	},
	detailsDictionaryForm: {
		name: '',
		parentId: '',
		sort: '',
		oid: ''
	},
	detailsDictionarySelect: {
		oid: '',
		name: ''
	},
	queryParams: '',
	isDetailsAdd: false,
	sortList: []
});
let isAdd = false;
let detailsAdd = false;
let {
	tableData,
	detailsTableData,
	modalVisible,
	detailsModalVisible,
	dictionaryForm,
	detailsDictionaryForm,
	detailsDictionarySelect,
	isDetailsAdd,
	sortList
} = toRefs(state)

interface addInterface {
	row?: any
	handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
	state.modalVisible = true
	if (handle === 'add') {
		isAdd = true
	} else {
		isAdd = false
		state.dictionaryForm.name = row?.name;
		state.dictionaryForm.codeValue = row?.codeValue;
		state.dictionaryForm.oid = row?.oid;
	}
}

interface viewDetailsParams {
	oid: string
	name: string
}
const viewDetails = async ({ oid, name }: viewDetailsParams) => {
	if (oid) {
		state.isDetailsAdd = true
		state.detailsTableData.param.pid = oid
		state.detailsDictionaryForm.parentId = oid
		state.detailsDictionarySelect.oid = oid
		state.detailsDictionarySelect.name = name
		let res = await api.getListChild(toRaw(state.detailsTableData.param))
		detailsTableData.value.data = res.content
		detailsTableData.value.total = res.total
	}
}

const getSortList = async () => {
	let res = await api.querySortNumber(state.detailsDictionarySelect.oid)
	state.sortList = res
}

const detailsAddOrUpdate = ({ row, handle }: addInterface) => {
	state.detailsModalVisible = true;
	state.detailsDictionaryForm.parentId = state.detailsDictionarySelect.oid;
	getSortList();
	if (handle === 'add') {
		detailsAdd = true
	} else {
		detailsAdd = false
		state.detailsDictionaryForm.name = row.name;
		state.detailsDictionaryForm.sort = row.sort;
		state.detailsDictionaryForm.oid = row.oid;
	}
}

const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	viewDetails(state.detailsDictionarySelect);
}

const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	viewDetails(state.detailsDictionarySelect);
}

const onSearch = async () => {
	const res = await api.getDictionary({ value: state.queryParams })
	state.tableData.data = res
}

const { resetFields, validate, validateInfos } = useForm(
	dictionaryForm,
	reactive({
		name: [
			{
				required: true,
				message: '请输入字典名称',
			},
		],
		codeValue: [
			{
				required: true,
				message: '请输入字典ID',
			},
		],
	}),
);

const detailsForm = useForm(
	detailsDictionaryForm,
	reactive({
		name: [
			{
				required: true,
				message: '请输入字典标签！',
			},
		],
		parentId: [
			{
				required: true,
				message: '请输入选择所属字典！',
			},
		],
		sort: [
			{
				required: true,
				message: '请选择排序！',
			},
		]
	}),
);

const cancel = () => {
	state.modalVisible = false;
	resetFields()
}

const detailsCancel = () => {
	state.detailsModalVisible = false;
	detailsForm.resetFields()
}

const save = () => {
	validate()
		.then(async (res) => {
			if (isAdd) {
				const res = await api.addDictionary(toRaw(dictionaryForm.value));
				if (res) {
					message.success('新增数据字典成功！');
					onSearch();
				} else {
					message.error('新增数据字典失败！');
				}
			} else {
				const res = await api.updateDictionary(toRaw(dictionaryForm.value));
				if (res) {
					message.success('编辑数据字典成功！');
					onSearch();
				} else {
					message.error('编辑数据字典失败！');
				}
			}
			cancel()
		})
		.catch(err => {
			console.log('error', err);
		});
}

const detailsSave = () => {
	detailsForm.validate()
		.then(async (res) => {
			if (detailsAdd) {
				const res = await api.addDictionary(toRaw(detailsDictionaryForm.value));
				if (res) {
					message.success('新增字典详情成功！');
					viewDetails(state.detailsDictionarySelect);
				} else {
					message.error('新增字典详情失败！');
				}
			} else {
				const res = await api.updateDictionary(toRaw(detailsDictionaryForm.value));
				if (res) {
					message.success('编辑字典详情成功！');
					viewDetails(state.detailsDictionarySelect);
				} else {
					message.error('编辑字典详情失败！');
				}
			}
			detailsCancel()
		})
		.catch(err => {
			console.log('error', err);
		});
}

const confirmDelete = async (row: any) => {
	const res = await api.updateDictionary({ oid: row.oid, deleted: 1 });
	if (res) {
		message.success('删除数据字典成功！');
		onSearch();
	} else {
		message.error('删除数据字典失败！');
	}
}

const deleteDetailsRow = async (row: any) => {
	const res = await api.updateDictionary({ oid: row.oid, deleted: 1 });
	if (res) {
		message.success('删除字典详情成功！');
		viewDetails(state.detailsDictionarySelect);
	} else {
		message.error('删除字典详情失败！');
	}
}

let timer: NodeJS.Timeout
const queryList = () => {
	if (timer) {
		clearTimeout(timer)
	}
	timer = setTimeout(() => {
		onSearch();
	}, 600);
}

onMounted(() => {
	onSearch()
})
</script>

<style scoped lang="scss">
.content_box {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;

	.content_left {
		flex: 2;
		padding: 20px;
	}

	.content_middle {
		width: 12px;
		background-color: #F0F2F5;
	}

	.content_right {
		flex: 3;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	/* 	.left_box {
		padding-right: 20px;
		border-right: 12px solid #d9d9d9;
	}

	.right_box {
		padding-left: 20px;
	} */

	.query_box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20px;
		border-bottom: 1px solid #F1F2F5;

		.detail_text {
			font-size: 16px;
			font-weight: bold;
			color: #1E2226;
		}

		.ant-form-item {
			margin-bottom: 0;
		}
	}
}
</style>
