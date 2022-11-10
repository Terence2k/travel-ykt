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
									@change="(e) => getData(e, index)"
									class="data-item"
									v-model:value="formValidate.data.dateList[index].time"
									format="YYYY-MM-DD "
									valueFormat="YYYY-MM-DD "
									:disabled-Date="(e) => disabledDate(e, index)"
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
import { message } from 'ant-design-vue';

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

const bufferDateArr = ref<string[]>([]);
/**
 * 禁用日期设置
 * 1. 获取前一天时间戳
 * 2. 判别当前是否在已选日期list的中
 */
const disabledDate = (e: Dayjs, index: number) => {
	// console.log(hadRange.value.length > 0);
	let preDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

	// Can not select days before today and today
	if (hadRange.value.length > 0) {
		// if (hadRange.value[index]?.length > 0) {
		// 	bufferDateArr.value = hadRange.value[index];
		// 	// hadRange.value[index] = [];
		// }
		//判断是否在范围里面
		let isHad = isCurrentDate(e);
		return new Date(shijianYMD(e)).getTime() < preDay.getTime() || isHad ? true : false;
	} else {
		return new Date(shijianYMD(e)).getTime() < preDay.getTime();
	}
};

const shijianYMD = (timestamp: any) => {
	const time = new Date(timestamp),
		year = time.getFullYear(),
		month = (time.getMonth() + 1).toString().padStart(2, '0'),
		date = time.getDate().toString().padStart(2, '0');
	return year + '-' + month + '-' + date;
};

const isCurrentDate = (day: Dayjs) => {
	let now = shijianYMD(day),
		res = hadRange.value?.some((arrRange: string[]) => {
			return arrRange.includes(now);
		});
	return res;
};
/**
 * 时间段去重
 * 1.获取时间的差值（timestamp）
 * 2.根据两个时间点生成一个具体时间段的list记录
 * 3.新增根据index,把生成的数组放进list
 * 4.编辑根据index,修改list里面的数据
 */
const hadRange = ref<any[][]>([]);

const getData = (e: string[], index: number) => {
	let rangeTime = getAllDateCN(new Date(e[0]), new Date(e[1]));
	// console.log(e, 'getData', hadRange.value, rangeTime);

	if (hadRange.value.length > 0) {
		if (hadRange.value[index]?.length > 0) {
			hadRange.value[index] = [];
		}
		//判断是否在范围里面
		let isHad = isCurrentRange(rangeTime);

		if (isHad) {
			message.error('已经有重复的日期');
			formValidate.data.dateList[index].time = [];
		} else {
			hadRange.value[index] = rangeTime;
		}
	} else {
		// hadRange.value.push(...range);
		hadRange.value[index] = rangeTime;
	}
};

const getTwoTimeList = (beginTime: string, endTime: string) => {
	let intervaltime = (new Date(endTime).getTime() - new Date(beginTime).getTime()) / 1000;
	// console.log(intervaltime);

	let timeList = [];

	for (let i = 0; i < intervaltime + 1; i += 60) {
		let time = new Date(beginTime).getTime() + i * 1000;

		timeList.push(time);
	}

	return timeList.map(function (item, index, input) {
		var date = new Date(item + 8 * 3600 * 1000);

		return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '-').slice(0, 16);
	});
};

const isCurrentRange = (arr: string[]) => {
	let res = false;

	arr.some((item: string) => {
		res = hadRange.value?.some((arrRange: string[]) => {
			return arrRange.includes(item);
		});

		return res;
	});
	return res;
};

const getAllDateCN = (startTime: Date, endTime: Date) => {
	const date_all = [];
	let i = 0;
	while (endTime.getTime() - startTime.getTime() >= 0) {
		const year = startTime.getFullYear();
		const month = (startTime.getMonth() + 1).toString().padStart(2, '0');
		const day = startTime.getDate().toString().padStart(2, '0');
		date_all[i] = year + '-' + month + '-' + day;
		startTime.setDate(startTime.getDate() + 1);
		i += 1;
	}
	return date_all;
};

const addTimeList = () => {
	formValidate.data.dateList.push({ time: [] });
};

const del = (index: number) => {
	formValidate.data.dateList.splice(index, 1);
	hadRange.value.splice(index, 1);
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
	getDeatil(id);

	// if (status) {
	// 	getDeatil(id);
	// }
};
const setRange = (start: string, end: string, index: number) => {
	let range = getAllDateCN(new Date(start), new Date(end));
	hadRange.value[index] = range;
};

const getDeatil = async (id: number) => {
	let res = await api.scenicTicketDetail(id);
	console.log(res, 'getDeatils');
	formValidate.data = res;
	if (formValidate.data.dateList.length > 0) {
		formValidate.data.dateList = formValidate.data.dateList.map((item, index) => {
			let start = item.startDateTime,
				end = item.endDateTime;
			setRange(start, end, index);
			return { ...item, time: [start, end] };
			// dayjs(' 00:00:00', 'HH:mm')
		});
	} else {
		formValidate.data.dateList = [{ startDateTime: '', endDateTime: '', time: [] }];
	}
};
// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	formRef.value.resetFields();
	formValidate.data.dateList = [{ startDateTime: '', endDateTime: '', time: [] }];
	console.log(modelValue.value, 'modelValue');
	hadRange.value = [];
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
