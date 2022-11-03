<template>
	<BaseModal :modelValue="modelValue" title="审核" width="606px" @cancel="cancel">
		<div class="form-wrap">
			<a-form ref="formRef" :rules="formRules" :model="formValidate.data" :label-col="{ span: 4 }" :wrapper-col="{ flex: 12 }" labelAlign="left">
				<div v-for="(timeItem, index) in formValidate.data.dateList" :key="index" class="time-item">
					<a-row>
						<a-col :span="4"> <i v-if="index === 0" style="color: red">*</i>{{ index === 0 ? '下架时间：' : '' }}</a-col>
						<a-col :span="19">
							<a-form-item :name="['dateList', index, 'time']" :rules="formRules.time">
								<a-range-picker
									class="data-item"
									v-model:value="formValidate.data.dateList[index].time"
									format="YYYY-MM-DD HH:mm"
									valueFormat="YYYY-MM-DD HH:mm"
									:show-time="{
										hideDisabledOptions: true,
										defaultValue: [dayjs(' 00:00:00', 'HH:mm'), dayjs('23:59:59', 'HH:mm')],
									}"
								/>
							</a-form-item>
							<div class="btn-wrapper inner">
								<a-button
									type="primary"
									v-if="formValidate.data.dateList.length > 1 && index + 1 === formValidate.data.dateList.length"
									@click="addTimeList"
									>添加</a-button
								>
								<a-button v-if="formValidate.data.dateList.length > 1" @click="del(index)">删除</a-button>
							</div>
						</a-col>
					</a-row>
				</div>

				<div class="btn-wrapper bottom-btn">
					<a-button type="primary" v-if="formValidate.data.dateList.length === 1" @click="addTimeList">添加</a-button>
				</div>
				<a-row>
					<a-col :span="4"><i style="color: red">*</i>原因: </a-col>
					<a-col :span="19">
						<a-form-item name="downReason">
							<a-textarea v-model:value="formValidate.data.downReason" placeholder="请输入原因" :rows="4" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>

			<div class="btn-wrapper">
				<a href="javascript:;" @click="toHistoryPage">查看历史下架记录</a>
			</div>
		</div>
		<template v-slot:footer>
			<div class="footer-wrapper">
				<a-button type="primary" @click="apply">申请</a-button>
				<a-button @click="cancel">取消</a-button>
			</div>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';

import dayjs, { Dayjs } from 'dayjs';

const modelValue = ref(false);
const route = useRouter();

interface formValidateType {
	data: {
		ticketId: string | null;
		ticketType: string | null;
		downReason: string | null;
		dateList: any[];
	};
}

const formValidate = reactive<formValidateType>({
	data: {
		ticketId: '',
		ticketType: 'UNITE',
		downReason: '',
		dateList: [{ startDateTime: '', endDateTime: '', time: [] }],
	},
});

const formRef = ref();

const formRules: any = {
	time: [{ required: true, message: '请选择时间' }],
	downReason: [{ required: true, message: '请填写' }],
};

const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
	// params: Object,
	// menuList: Array,
});

const addTimeList = () => {
	formValidate.data.dateList.push({ time: [] });
};

const del = (index: number) => {
	formValidate.data.dateList.splice(index, 1);
};
const emits = defineEmits(['done']);
const apply = async () => {
	formRef.value
		.validateFields()
		.then(async (res: any) => {
			let params = formValidate.data;
			params.dateList.map((i: any) => {
				i.startDateTime = i.time[0];
				i.endDateTime = i.time[1];
				delete i.time;
				return i;
			});
			await api.scenicTicketDown(params);
			cancel();
			emits('done');

			// console.log(apiRes, 'apiRes');
		})
		.catch((err: any) => {
			console.log(err);
		});
};
const searchValue = ref('');

const toHistoryPage = () => {
	// route.push('/scenic-spot/sold-out-history');
	route.push({ path: '/scenic-spot/sold-out-history', query: { name: searchValue.value } });
};
// 打开弹窗
const open = (id: any, status: string | undefined, saerch: string) => {
	modelValue.value = true;
	formValidate.data.ticketId = id;
	searchValue.value = saerch;
	if (status) {
		getDeatil(id);
	}
};

const getDeatil = async (id: number) => {
	let res = await api.scenicTicketDetail(id);
	console.log(res, 'getDeatils');
	formValidate.data = res;
	formValidate.data.dateList = formValidate.data.dateList.map((item) => {
		return { ...item, time: [item.startDateTime, item.endDateTime] };
		// dayjs(' 00:00:00', 'HH:mm')
	});
};
// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	formRef.value.resetFields();
	formValidate.data.dateList = [{ startDateTime: '', endDateTime: '', time: [] }];
	console.log(modelValue.value, 'modelValue');
};

defineExpose({
	open,
	close,
});
// const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
</script>

<style scoped lang="less">
.form-wrap {
	max-height: 600px;
	overflow-y: auto;
}
.btn-wrapper {
	display: flex;
	justify-content: end;

	a {
		color: #4197ef;
	}
}
.bottom-btn {
	margin-bottom: 20px;
	margin-right: 24px;
}

.footer-wrapper {
	border-top: 1px solid #ddd;
	padding-top: 20px;
}
.time-item {
	display: block;
	margin-top: 10px;
	width: 100%;
	button {
		margin-left: 20px;
	}
}
.data-item {
	min-width: 100%;
}
</style>
