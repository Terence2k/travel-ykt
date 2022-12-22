<template>
	<div class="wrapper-tab-checkinStatus">
		<a-form
			ref="formRef"
			:model="formValidate"
			:rules="rules"
			:scrollToFirstError="true"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 8, offset: 1 }"
			labelAlign="left"
		>
			<div class="scroll-container">
				<div class="checkinStatus-container container">
					<div class="title">
						<span>入住情况</span>
					</div>
					<a-form-item class="form-item" label="日期" name="date">
						<DatePicker placeholder="请选择入住情况对应的日期" v-model="formValidate.date" />
					</a-form-item>
					<a-form-item class="form-item" label="总房数" name="roomTotal">
						<a-input placeholder="请输入房间总数" v-model:value="formValidate.roomTotal" />
					</a-form-item>
					<a-form-item class="form-item" label="散客" name="fit">
						<a-input placeholder="请输入散客入住房间数量，单位：标" v-model:value="formValidate.fit" />
					</a-form-item>
					<a-form-item class="form-item" label="会议接待" name="cr">
						<a-input placeholder="请输入会议接待入住房间数量，单位：标" v-model:value="formValidate.cr" />
					</a-form-item>
					<a-form-item class="form-item" label="监理费" name="supervisionFee">
						<a-input placeholder="无需填写，根据散客，会议接待情况计算" v-model:value="formValidate.supervisionFee" />
					</a-form-item>
					<a-form-item class="form-item" label="陪同" name="accompany">
						<a-input placeholder="请输入陪同入住房间数量，单位：标" v-model:value="formValidate.accompany" />
					</a-form-item>
					<a-form-item class="form-item" label="免费" name="free">
						<a-input placeholder="请输入免费房间数量，单位：标" v-model:value="formValidate.free" />
					</a-form-item>
					<a-form-item class="form-item" label="团客" name="groupGuest">
						<a-input placeholder="无需填写，系统自动计算" v-model:value="formValidate.groupGuest" />
					</a-form-item>
					<a-form-item class="form-item" label="团客（16免1）" name="groupGuest_ex">
						<a-input placeholder="无需填写，系统自动计算" v-model:value="formValidate.groupGuest_ex" />
					</a-form-item>
					<a-form-item class="form-item" label="空房数" name="emptyRoomTotal">
						<a-input v-model:value="formValidate.emptyRoomTotal" />
					</a-form-item>
					<a-form-item class="form-item" label="入住率" name="occupancyRate">
						<a-input v-model:value="formValidate.occupancyRate" />
					</a-form-item>
				</div>
				<div class="discount-container container">
					<div class="title">
						<span>上报信息</span>
					</div>
					<a-form-item class="form-item" label="酒店名称" name="hotelName">
						<a-input placeholder="请输入酒店名称" v-model:value="formValidate.hotelName" />
					</a-form-item>
					<a-form-item class="form-item" label="提报人" name="filer">
						<a-input placeholder="请输入减免规则,用,号分隔。如16，1表示16免1" v-model:value="formValidate.filer" />
					</a-form-item>
				</div>
			</div>
			<div class="footer-container">
				<div class="form-item footer-item">
					<a-button html-type="submit" @click="save" class="button">保存</a-button>
					<a-button class="button" @click="submitAudit">提交审核</a-button>
				</div>
			</div>
		</a-form>
	</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import api from '@/api';
import { useRoomStatusStore } from '@/stores/modules/roomStatus';
import { message } from 'ant-design-vue';
import DatePicker from '@/components/common/datePicker.vue';

const useRoomStatus = useRoomStatusStore();

const formRef = ref<FormInstance>() as any;

const route = useRoute();
const router = useRouter();

const formValidate: Ref<Record<string, any>> = ref({});

const rules: any = {
	date: [{ required: true, trigger: 'blur', message: '请输入日期' }],
	roomTotal: [{ required: true, trigger: 'blur', message: '请输入房间总数' }],
	fit: [{ required: true, trigger: 'blur', message: '请输入散客入住房间数量' }],
	cr: [{ required: true, trigger: 'blur', message: '请输入会议接待入住房间数量' }],
	supervisionFee: [{ required: true, trigger: 'blur', message: '请输入监理费' }],
	accompany: [{ required: true, trigger: 'blur', message: '请输入陪同入住房间数量' }],
	free: [{ required: true, trigger: 'blur', message: '请输入免费房间数量' }],
	groupGuest: [{ required: true, trigger: 'blur', message: '请输入团客入住房间数量' }],
	groupGuest_ex: [{ required: true, trigger: 'blur', message: '请输入团客(16免1)入住房间数量' }],
	emptyRoomTotal: [{ required: true, trigger: 'blur', message: '请输入空房间数量' }],
	occupancyRate: [{ required: true, trigger: 'blur', message: '请输入入住率' }],
	hotelName: [{ required: true, trigger: 'blur', message: '请输入酒店名称' }],
	filer: [{ required: true, trigger: 'blur', message: '请输入提报人' }],
};

const handleCancel = () => {
	previewVisible.value = false;
};

watch(
	() => route.query,
	(res) => {
		const id = route?.query?.id;
		if (id) {
			console.info('房态上报id：', id);

			const result = toRaw(useRoomStatus.getBaseInfoDataSource)?.find((item) => item?.id == id);
			console.info('入住情况资料：', result);
			formValidate.value.date = dayjs(result?.reportDate).format('YYYY-MM-DD');
			formValidate.value.roomTotal = result?.roomTotal;
			formValidate.value.fit = 10; //散客
			formValidate.value.cr = 10; // 会议接待
			formValidate.value.supervisionFee = result?.supervisionFee;
			formValidate.value.accompany = 10;
			formValidate.value.free = 10;
			formValidate.value.groupGuest = 10;
			formValidate.value.groupGuest_ex = 10;
			formValidate.value.emptyRoomTotal = result?.emptyRoomTotal;
			formValidate.value.occupancyRate = result?.occupancyRate;
			formValidate.value.hotelName = '';
			formValidate.value.filer = result?.filer;
			// api.getHotelDetailInfo({}, id).then((res) => {
			// 	console.info(`id${id}酒店信息:`, res);
			// 	// //表单初始化赋值
			// 	// formValidate.
			// });
		}
	},
	{
		immediate: true,
	}
);

const save = () => {
	formRef.value.validateFields().then((result) => {
		//console.info('检车结果：', result);
		console.log('formValidate.value', formValidate);
		const tempData = ref({ ...formValidate.value });
		useRoomStatus.setBaseInfoDataSource(tempData);

		message.success('保存成功');
		router.push({ path: '/hotelManagement/roomStatus' });
		console.info('toRaw(useRoomStatus.getBaseInfoDataSource)', toRaw(useRoomStatus.getBaseInfoDataSource));
	});
};

const submitAudit = () => {
	message.success('审核成功');
	router.push({ path: '/hotelManagement/roomStatus' });
};
</script>

<style lang="less" scoped>
@import './styles/checkinStatus.less';
</style>
