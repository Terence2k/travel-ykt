<template>
	<div class="wrapper">
		<BaseModal :modelValue="modelValue" title="关联核销项目" width="600px" @cancel="cancel">
			<a-form :model="formValidate" :label-col="{ span: 3 }" :wrapper-col="{ span: 12, offset: 1 }" labelAlign="left">
				<a-form-item label="核销项目" class="fz14" v-bind="validateInfos.proj">
					<a-select
						v-model:value="formValidate.proj"
						:mode="type ? 'multiple' : ''"
						style="width: 100%"
						placeholder="请选择"
						:options="options"
						@change="handleChange"
					></a-select>
				</a-form-item>
			</a-form>

			<template v-slot:footer>
				<a-button type="primary" @click="apply" style="width: 100px">保存</a-button>
				<a-button @click="cancel">取消</a-button>
			</template>
		</BaseModal>
		<div class="inner-wrapper">
			<CommonTable :dataSource="tableList" :columns="type ? columns : column" :scrollY="false" bordered class="left">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'itemId'">
						<div class="action-btns">
							<span style="margin-right: 20px">
								{{ itemNameCompute(Number(record.itemId)) }}
							</span>
							<a v-if="record.itemId && !type" href="javascript:;" @click="change(record)">更换</a>
							<a href="javascript:;" v-if="pageStatus && !type && tableList[0].init" @click="CreateData">请选择</a>
						</div>
					</template>
					<template v-if="column.key === 'verificationNumber'">
						<a-input-number
							v-model:value="record.verificationNumber"
							:formatter="(value) => value.replace(/\D/g, '')"
							:parser="(value) => value.replace(/\D/g, '')"
							placeholder="可核销次数"
							:controls="false"
						/>
					</template>
					<template v-if="column.key === 'ifVerification'">
						<a @click="changeIfVerification(index)">{{ record.ifVerification ? '是' : '否' }}</a>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<a-button type="primary" class="btn" v-show="type" @click="CreateData"> 关联核销项目</a-button>
		</div>

		<span style="color: #c8c9cc" v-show="type">
			<span style="color: red">*</span>其中，非必核销项目数量为{{ ifVerificationNum }}项，可核销总数（不包括必核销项）不超过
			<a-input-number
				v-model:value="allTimes"
				:min="times"
				:max="timesMax"
				:formatter="(value) => value.replace(/\D/g, '')"
				:parser="(value) => value.replace(/\D/g, '')"
				placeholder="可核销总数"
				style="width: 100px"
				:controls="false"
				@change="changeIfverification"
			/>
			次 (最小值：{{ times }}，最大值：{{ timesMax }})
		</span>
	</div>
	<DelModal :params="{ title: '删除', content: '是否确定该条数据' }" v-model="delShow" @submit="delSubmit" @cancel="delCancel" />
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { Form } from 'ant-design-vue';
import DelModal from '@/components/common/DelModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';

const route = useRouter();

const type = computed(() => {
	return route.currentRoute.value?.query?.t === '1' ? true : false;
});
const pageStatus = computed(() => {
	return route.currentRoute.value?.query?.s === 'new';
});
const isCreate = computed(() => {
	return route.currentRoute.value?.query?.s ? true : false;
});
const useForm = Form.useForm;

const props = defineProps({
	tableList: {
		type: Array,
		default: () => [],
		require: true,
	},
	// params: Object,
	// tableList: Array,
});
const allTimes = ref<number | null>(null);

const changeIfverification = (num: number) => {
	emits('get-optional-verification', num);
};
//总数
const ifVerificationNum = computed(() => {
	let res = props.tableList?.filter((i) => !i.ifVerification) || 0;
	return res.length || 0;
});

//次数 最小值
const times = computed(() => {
	let num = 0;
	let res = props.tableList?.filter((i: any) => i.ifVerification);
	res?.map((i: any) => {
		num = num + Number(i.verificationNumber);
		return i;
	});

	return num;
});

//次数 最大值
const timesMax = computed(() => {
	let num = 0;
	// let res = props.tableList?.filter((i) => !i.ifVerification);
	props.tableList?.map((i: any) => {
		num = num + Number(i.verificationNumber);
		return i;
	});
	return num;
});
const column = ref([
	{
		title: '核销项目',
		dataIndex: 'itemId',
		width: 200,
		key: 'itemId',
	},
	{
		title: '可核销次数',
		dataIndex: 'verificationNumber',
		width: 200,
		key: 'verificationNumber',
	},
]);
const columns = ref([
	{
		title: '核销项目',
		dataIndex: 'itemId',
		width: 200,
		key: 'itemId',
	},
	{
		title: '可核销次数',
		dataIndex: 'verificationNumber',
		width: 200,
		key: 'verificationNumber',
	},
	{
		title: '是否为必核销项',
		dataIndex: 'ifVerification',
		width: 200,
		key: 'ifVerification',
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 200,
		key: 'action',
	},
]);

const itemNameCompute = (id: number) => {
	let rN: any[] = formData.data.filter((i: any) => i.id === id),
		optionN = options.value.filter((i: any) => i.id === id);
	// console.log(optionN, 'optionN');

	return rN[0]?.itemName || optionN[0]?.label || '';
	// return optionN[0]?.label || '';
};

const change = (value: object) => {
	console.log(value, type.value);
	if (type.value) {
		console.log('多点');

		modelValue.value = true;
		emits('get-optional-verification', 0);
	} else {
		console.log('单点');
		modelValue.value = true;
	}
};

// 关联核销项目
const formValidate = reactive({
	proj: [],
	initData: [{ init: true }],
});
const emits = defineEmits(['del-verification-obj', 'add-verification-obj', 'add-verification-obj-sign', 'get-optional-verification', 'change-iv']);
const del = (index: number | null) => {
	delShow.value = true;
	delIndex.value = index;
	// emits('del-verification-obj', index);
};
const delSubmit = () => {
	emits('del-verification-obj', toRaw(delIndex.value));
	delCancel();
};
const changeIfVerification = (index: number) => {
	emits('change-iv', index);
};
const delCancel = () => {
	delShow.value = false;
	delIndex.value = null;
};
const apply = () => {
	validate()
		.then((res) => {
			console.log(isCreate.value, type.value, '099');

			if (!type.value) {
				console.log('formValidate.initData');

				formValidate.initData = [{ itemId: formValidate.proj, ifVerification: false, verificationNumber: null }];
				emits('add-verification-obj-sign', formValidate.initData);
			} else {
				let arr = formValidate.proj.map((i) => {
					return { itemId: i, ifVerification: false, verificationNumber: null };
				});
				emits('add-verification-obj', arr);
			}

			cancel();
		})
		.catch((err) => {
			console.log('error', err);
		});
};
const modelValue = ref(false);
const CreateData = () => {
	modelValue.value = true;
	console.log(props.tableList);
	if (type && props.tableList.length > 0) {
		formValidate.proj = [];
		props.tableList.map((i: any) => {
			formValidate.proj.push(i.itemId);
			return i;
		});
	}
};

const cancel = () => {
	modelValue.value = false;
	formValidate.proj = [];
	// resetFields();
};
const options = ref([
	{
		value: '1',
		label: '入园',
		id: 1,
	},
	{
		value: '2',
		label: '游戏机',
		id: 2,
	},

	{
		value: '3',
		label: '其他',
		id: 3,
	},
]);
// 数据
const formData = reactive({
	data: [],
});

const handleChange = (value: any) => {
	formValidate.proj = value;
};

// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formValidate,
	reactive({
		proj: [{ required: true, message: '请填写' }],
	})
);
const getList = async () => {
	formData.data = await api.getVariflist();
	// let res = await api.getScenicOneTicket();

	let arr = formData.data.map((i: any) => {
		return { value: i.id, label: i.itemName };
	});

	options.value = arr.length ? arr : options.value;
};

// 删除提示
const delShow = ref(false);
const delIndex = ref<null | number>();
onMounted(() => {
	getList();
	console.log(pageStatus.value && !type.value, '单点新增');
	if (pageStatus.value && !type.value) {
		emits('add-verification-obj-sign', formValidate.initData);
	}
});

const setValue = (value: number) => {
	allTimes.value = value;
};

defineExpose({
	setValue,
});
</script>

<style scoped lang="less">
.inner-wrapper {
	position: relative;
	display: flex;
	align-items: flex-end;
	width: 100%;
	.left {
		flex: 1;
	}
}
.table-area {
	margin: 0;
	padding: 0;
}

.btn {
	position: absolute;
	right: -126px;
	bottom: -10px;
	margin-bottom: 10px;
	// top: 12px;
}
</style>
