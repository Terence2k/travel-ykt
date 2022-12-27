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
								>{{ item.guideName }} {{ item.phone }}
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
							<div @click="getTourist" class="append">查看全部游客</div>
						</div>
					</a-form-item>
					<a-form-item name="licensePlate" label="用车车牌号">
						<a-input v-model:value="form.licensePlate" placeholder="输入车牌号"> </a-input>
					</a-form-item>
				</div>
			</div>
		</a-form>
		<CommonModal
			:title="`全部游客（${state.touristTable.data.length}人）`"
			v-model:visible="touristVisible"
			@close="touristClose"
			@cancel="touristClose"
			:is-cancel="false"
			:is-conform="false"
			width="65%"
		>
			<CommonTable :dataSource="state.touristTable.data" :columns="state.touristColumns" :scroll="{ y: '60vh' }">
				<template #bodyCell="{ column, record, text, index }">
					<template v-if="column.key === 'index'">
						{{ index + 1 }}
					</template>
					<template v-if="column.key === 'isHealthy'">
						{{ cmpIsHealthy(record.isHealthy) }}
					</template>
					<template v-if="column.key === 'isAncientUygur'">
						{{ cmpIsAncientUygur(record.isAncientUygur) }}
					</template>
					<template v-if="column.key === 'healthyCode'">
						<span :class="cmpHealthyColor(text)">{{ text }}</span>
					</template>
				</template>
			</CommonTable>
		</CommonModal>
		<div class="footer">
			<a-button @click="saveDraft" type="primary" style="margin-right: 20px">提交修改</a-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import picker from '@/components/common/datePicker.vue';
import { createVNode, UnwrapRef } from 'vue';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import api from '@/api';
import { message, Modal } from 'ant-design-vue';
const router = useRouter();
const route = useRoute();

const labelWidth = '110px';
const labelCol = { style: { width: labelWidth } };
const form = ref({} as any);
const formRef = ref();
const dateFormRef = ref();
const state = reactive({
	itineraryNo: '' as any,
	licensePlate: '',
	guideOid: '',
	touristTable: {
		data: [],
	},
	touristColumns: [
		{
			title: '序号',
			dataIndex: 'index',
			key: 'index',
		},
		{
			title: '游客姓名',
			dataIndex: 'touristName',
			key: 'touristName',
		},
		{
			title: '身份证件类型',
			dataIndex: 'certificatesTypeName',
			key: 'certificatesTypeName',
		},
		{
			title: '身份证件号码',
			dataIndex: 'certificatesNo',
			key: 'certificatesNo',
		},
		{
			title: '游客类型',
			dataIndex: 'touristTypeName',
			key: 'touristTypeName',
		},
		{
			title: '性别',
			dataIndex: 'gender',
			key: 'gender',
		},
		{
			title: '年龄',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: '电话号码',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: '是否健康',
			dataIndex: 'isHealthy',
			key: 'isHealthy',
		},
		{
			title: '健康码',
			dataIndex: 'healthyCode',
			key: 'healthyCode',
		},
		{
			title: '古维费购买状态',
			dataIndex: 'isAncientUygur',
			key: 'isAncientUygur',
		},
	],
});

const touristVisible = ref(false);

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
			guideOid: val,
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
			let data = {
				itineraryId: route.query.oid, //行程单id
				routeName: form.value.routeName, //线路名称
				travelOperatorName: form.value.travelOperatorName, //联系人姓名
				travelOperatorPhone: form.value.travelOperatorPhone, //联系人电话
				selfTeamNo: form.value.selfTeamNo, //自编团号
			} as any;
			if (form.value.licensePlate != state.licensePlate) {
				data.licensePlate = form.value.licensePlate;
			}
			if (form.value.guide.guideOid != state.guideOid) {
				data = {
					itineraryId: route.query.oid, //行程单id
					routeName: form.value.routeName, //线路名称
					travelOperatorName: form.value.travelOperatorName, //联系人姓名
					travelOperatorPhone: form.value.travelOperatorPhone, //联系人电话
					selfTeamNo: form.value.selfTeamNo, //自编团号
					guide: {
						guideOid: form.value.guide.guideOid, //导游id
						guideName: form.value.guide.guideName, //导游姓名
						guidePhone: form.value.guide.guidePhone, //导游电话
						guideCertificateNo: form.value.guide.guideCertificateNo, //导游证号
					},
				};
			}
			const res = await api.travelManagement.changeIndividualItineraryBasic(data);
			if (res) {
				Modal.confirm({
					title: '温馨提示',
					icon: createVNode(ExclamationCircleOutlined),
					content: createVNode('div', { style: 'color: #333;' }, `行程基本信息修改成功，系统会自动更新。`),
					cancelText: createVNode('', { style: 'display: none' }),
					async onOk() {
						install();
						router.go(-1);
						return false;
					},
				});
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

// 查看游客
const getTourist = () => {
	api
		.findIndividualContractTouristById(route.query.oid, {
			oid: route.query.oid,
			pageNo: 1,
			pageSize: 20,
		})
		.then(async (res: any) => {
			const certificateIds = res.content.map((item: any) => {
				return { certificateId: item.certificatesNo };
			});
			// 根据身份证列表查询健康码列表
			const certificateCodes = await getHealthyCodes(certificateIds);
			// 将健康码和游客列表数据关联
			configCodeName(certificateCodes, res.content);
			state.touristTable.data = res.content;
		});
	touristVisible.value = true;
};
const getHealthyCodes = async (ids: number[]) => {
	let res = await api.getHealthyCode(ids);
	if (res) {
		res.forEach((item: any) => {
			// 00:绿码，01：黄码，10：红码
			switch (item.healthCodeStatus) {
				case '00':
					item.codeName = '绿码';
					break;
				case '01':
					item.codeName = '黄码';
					break;
				case '10':
					item.codeName = '红码';
					break;
				default:
					item.codeName = '暂无健康码';
			}
		});
	}
	return res || [];
};
const touristClose = () => {
	touristVisible.value = false;
};
const cmpIsHealthy = computed(() => (code: number) => {
	if (code === 1) {
		return '是';
	} else if (code === 0) {
		return '否';
	}
});
const cmpIsAncientUygur = computed(() => (code: number) => {
	if (code === 1) {
		return '已购';
	} else if (code === 0) {
		return '未购';
	}
});
const cmpHealthyColor = computed(() => (text: string) => {
	if (text === '绿码') {
		return 'green_text';
	} else if (text === '黄码') {
		return 'yellow_text';
	} else if (text === '红码') {
		return 'red_text';
	}
});
const configCodeName = (certificateCodes: any, targetArr: any) => {
	for (let i = 0, l = certificateCodes.length; i < l; i++) {
		const item = certificateCodes[i];
		for (let j = 0, l = targetArr.length; j < l; j++) {
			const citem = targetArr[j];
			if (item.certificateId === citem.certificatesNo) {
				targetArr[j].healthyCode = item.codeName;
				break;
			}
		}
	}
};

const install = () => {
	if (route.query.oid) {
		api.travelManagement
			.getItineraryDetail({
				oid: route.query.oid,
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
				state.guideOid = res.guideList[0].guideOid;
				state.licensePlate = res.transportList[0].licencePlateNumber;
			});
	}
};
watch(route, () => {
	if (route.query.oid) {
		install();
	}
});
onMounted(() => {
	install();
	getGuideList();
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
