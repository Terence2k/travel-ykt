<template>
	<div class="table-container">
		<a-form ref="formRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="labelCol">
			<div class="form_item_box">
				<div class="form_item mr40">
					<a-form-item name="routeName" label="线路名称">
						<a-input v-model:value="form.routeName" placeholder="给拼团线路取个名字"> </a-input>
					</a-form-item>
					<a-form-item name="guideOid" label="导游">
						<a-select placeholder="请选择本社签约导游" v-model:value="form.guideOid" allowClear @change="guideChange">
							<a-select-option
								v-for="item in guideOption"
								:value="item.oid"
								:name="item.guideName"
								:guideCertificateNo="item.guideCertificateNo"
								:phone="item.phone"
								:key="item.oid"
								>{{ item.guideName }}
							</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item name="travelOperatorName" label="联系人">
						<a-input v-model:value="form.travelOperatorName" placeholder="请输入联系人姓名"> </a-input>
					</a-form-item>
					<a-form-item name="itineraryNo" label="行程单号">
						<a-input v-model:value="form.itineraryNo" placeholder="无需填写，提交审核后自动生成" disabled> </a-input>
					</a-form-item>
					<a-form-item name="selfTeamNo" label="自编团号">
						<a-input v-model:value="form.selfTeamNo" placeholder="请输入自编团号"> </a-input>
					</a-form-item>
				</div>
				<div class="form_item mr40">
					<a-form-item label="行程日期"> {{ form.startDate }} 至 {{ form.endDate }} </a-form-item>
					<a-form-item name="teamTypeName" label="散客组团类型">
						<a-input v-model:value="form.teamTypeName" disabled> </a-input>
					</a-form-item>
					<a-form-item name="travelOperatorPhone" label="联系人号码">
						<a-input v-model:value="form.travelOperatorPhone" placeholder="请输入联系人手机号"> </a-input>
					</a-form-item>
					<a-form-item name="touristPeopleNumber" label="游客人数">
						<div style="display: flex; justify-content: space-between; align-items: center">
							<a-input v-model:value="form.touristCount" placeholder="无需填写，选择合同后自动生成" disabled style="flex: 3"> </a-input>
							<div class="append">查看全部游客</div>
						</div>
					</a-form-item>
					<a-form-item name="licensePlate" label="用车车牌号">
						<a-input v-model:value="form.licensePlate" placeholder="输入车牌号"> </a-input>
					</a-form-item>
				</div>
			</div>
		</a-form>
		<div class="footer">
			<a-button @click="saveDraft" type="primary" style="margin-right: 20px">提交修改</a-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import picker from '@/components/common/datePicker.vue';
import api from '@/api';
import { message } from 'ant-design-vue/es';
const router = useRouter();
const route = useRoute();

const labelWidth = '110px';
const labelCol = { style: { width: labelWidth } };
const form = ref({} as any);
const formRef = ref();
const dateFormRef = ref();
const state = reactive({});
const formRules = {
	routeName: [{ required: true, trigger: 'change', message: '给拼团线路取个名字' }],
	guideOid: [{ required: true, trigger: 'change', message: '请选择本社签约导游' }],
	travelOperatorName: [{ required: true, trigger: 'change', message: '请输入联系人姓名' }],
	travelOperatorPhone: [{ required: true, trigger: 'change', message: '请输入联系人手机号' }],
	contractDays: [{ required: true, trigger: 'change', message: '请输入合同天数' }],
};
const dateFormat = 'YYYY-MM-DD';
const guideOption = ref([] as any);

const dateRules = {
	travelData: [
		{
			required: true,
			message: '请选择行程日期',
			trigger: 'change',
		},
	],
};

// 选择导游
const guideChange = (val: number, option: any) => {
	form.value.guideOid = val;
    if (option) {
        form.value.guide = {
		guideOid: option.value,
		guideName: option.name,
		guideCertificateNo: option.guideCertificateNo,
		guidePhone: option.phone,
	};
    }
	
};
const saveDraft = async () => {
	const data = Promise.all([formRef.value?.validateFields(), dateFormRef.value?.validate()]);
	data
		.then(async () => {
			console.log(form.value, 'form.value');
			const data = {
				itineraryId: 8245801281314817, //行程单id
				routeName: form.value.routeName, //线路名称
				travelOperatorName: form.value.travelOperatorName, //联系人姓名
				travelOperatorPhone: form.value.travelOperatorPhone, //联系人电话
				selfTeamNo: form.value.selfTeamNo, //自编团号
				licensePlate: form.value.licensePlate, //车牌号
				guide: {
					guideOid: form.value.guide.guideOid, //导游id
					guideName: form.value.guide.guideName, //导游姓名
					guidePhone: form.value.guide.guidePhone, //导游电话
					guideCertificateNo: form.value.guide.guideCertificateNo, //导游证号
				},
			};
			const res = await api.travelManagement.changeIndividualItineraryBasic(data);
			if (res) {
				message.success('修改成功');
				// router.go(-1)
			}
		})
		.catch((error: Error) => {
			console.log(error);
		});
};

const getGuideList = async () => {
	const res = await api.travelManagement.getGuideList();
	guideOption.value = res;
};

const install = () => {
	api.travelManagement
		.getItineraryDetail({
			oid: 8245801281314817,
			pageNo: 1,
			pageSize: 100000,
		})
		.then((res: any) => {
			form.value = res.basic;
			form.value.teamTypeName = res.basic.teamTypeName;
			form.value.licensePlate = res.transportList[0].licencePlateNumber;
			guideChange(res.guideList[0].guideOid, {
				guideCertificateNo: res.guideList[0].guideCertificateNo,
				name: res.guideList[0].guideName,
				phone: res.guideList[0].guidePhone,
				oid: res.guideList[0].guideOid,
			});
		});
};

onMounted(() => {
	getGuideList();
	install();
});
</script>

<style scoped lang="scss">
.form_item_box {
	display: flex;

	.form_item {
		flex: 1;
	}
}

.append {
	margin-left: 40px;
	cursor: pointer;
	color: #209cd3;
}

.footer {
	position: fixed;
	bottom: 11px;
	background-color: #fff;
	height: 64px;
	width: 82%;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
