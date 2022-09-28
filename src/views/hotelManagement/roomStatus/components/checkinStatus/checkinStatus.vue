<template>
	<div class="wrapper-tab-checkinStatus">
		<a-form
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
						<a-date-picker placeholder="请选择入住情况对应的日期" v-model:value="formValidate.date" value-format="YYYY-MM-DD" />
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
					<a-button html-type="submit" class="button">保存</a-button>
					<a-button class="button">提交审核</a-button>
				</div>
			</div>
		</a-form>
	</div>
</template>

<script setup lang="ts">
import api from '@/api';

const route = useRoute();

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
</script>

<style lang="less" scoped>
@import './styles/checkinStatus.less';
</style>
