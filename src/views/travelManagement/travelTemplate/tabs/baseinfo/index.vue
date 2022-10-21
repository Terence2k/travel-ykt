<template>
	<div class="warp">
		<div class="form_pad">
			<!-- 查看 -->
			<a-form v-if="route.query?.typei" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="所属门店" name="name"> {{ formData.data.companyName }} </a-form-item>
				<a-form-item label="餐饮名称"> {{ formData.data.cateringName }} </a-form-item>
				<a-form-item label="可预订数量"> {{ formData.data.orderNum }} </a-form-item>
				<a-form-item label="单价"> {{ formData.data.price }} </a-form-item>
				<a-form-item label="图片">
					<img :width="200" :src="formData.data.imgUrl" />
				</a-form-item>
				<a-form-item label="状态">
					{{ formData.data.status == 1 ? '启用' : '禁用' }}
				</a-form-item>
				<a-form-item label="供餐时间"> {{ formData.data.provideStart }} 至 {{ formData.data.provideEnd }} </a-form-item>
				<a-form-item label="其他"> {{ formData.data.cateringDesc }} </a-form-item>
			</a-form>
			<!-- 新增 -->
			<a-form v-else labelAlign="left" ref="formRef" :model="formState" :rules="rulesRef" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="行程类型" name="teamType">
					<a-radio-group :options="travaType" v-model:value="formState.teamType" />
				</a-form-item>
				<a-form-item label="发团旅行社" name="a">
					<a-input placeholder="发团旅行社" disabled />
				</a-form-item>
				<a-form-item label="做团人" name="a">
					<a-select ref="select" placeholder="请选择组团社做发团人">
						<a-select-option value="1">发团人</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="联系电话" name="a">
					<a-input placeholder="请输入联系电话" />
				</a-form-item>
				<a-form-item label="地接旅行社" name="a">
					<a-select ref="select" placeholder="请选择地接旅行社">
						<a-select-option value="1">地接旅行社</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="地接计调" name="a">
					<a-select ref="select" placeholder="请选择地接做团人">
						<a-select-option value="1">地接做团人</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="联系电话" name="a">
					<a-input placeholder="请输入联系电话" />
				</a-form-item>
				<a-form-item label="模板名称" name="a">
					<a-input />
				</a-form-item>
			</a-form>
		</div>
		<!-- <div class="footer">
			<a-button type="primary">保存</a-button>
		</div> -->
	</div>
</template>

<script setup lang="ts">
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import CommonSearch from '@/components/common/CommonSearch.vue';
import api from '@/api';
import { computed, reactive, ref, UnwrapRef, watch } from 'vue';
const route = useRoute();
const navigatorBar = useNavigatorBar();
const formRef = ref();

const props = defineProps({
	onCheck: {
		type: Boolean
	}
})
// 行程类型枚举
const travaType = [
	{ label: '标准团', value: '1' },
	{ label: '散客网点团', value: '2' },
	{ label: '休闲通道团', value: '3' },
];
let addParams: any = {}
if (route.query.id) {
	
} else {
	addParams = {
		oid: null,
		teamType: '',
	}
}

const type = ref('');
const emits = defineEmits(['onSuccess'])
const formState = ref<{[k:string]: any}>(addParams);

const onSubmit = async () => {
	try {
		const values = await formRef.value.validateFields()
		emits('onSuccess', {basicParam: formState.value});
	} catch (errorInfo) {
		emits('onSuccess', {basicParam: false});
	}
};




// 初始化
const initPage = async (): Promise<void> => {
};

const rulesRef = {
	teamType: [{ required: true, message: '请选择行程类型' }],
	// travelName: [{ required: true, message: '请输入发团旅行社' }],
	contactPhone: [{ required: true, message: '请输入组团社联系电话' }],
	subTravelContactPhone: [{ required: true, message: '请输入地接社联系电话' }],
	travelOid: [{ required: true, message: '请选择组团社社' }],
	touristNum: [{ required: true, message: '请输入行程人数' }],
	// routeType: [{ required: true, message: '请选择线路类型' }],
	routeName: [{ required: true, message: '请选择或输入线路名称' }],
	// startDate: [{ required: true, message: '请选择行程开始时间' }],
	// endDate: [{ required: true, message: '请选择行程结束时间' }],
	time: [{ required: true, message: '请选择行程时间' }],
	subTravelOperatorOid: [{ required: true, message: '请选择计调' }],
	subTravelOid: [{ required: true, message: '请选择地接旅行社' }],
};

onMounted(() => {
	if (route.query?.id) {
		navigatorBar.setNavigator(['行程模板管理', '新增']);
	} else {
		navigatorBar.setNavigator(['行程模板管理', '查看']);
	}
	initPage();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
watch(() => props.onCheck, (newVal) => {
	onSubmit()
})
</script>

<style scoped lang="less">
.warp {
	width: 100%;
	box-sizing: border-box;
	header {
		// width: 64px;
		// margin-bottom: 8px;
		height: 56px;
		line-height: 56px;
		font-weight: bold;
		color: #1e2226;
		// margin: 0 8px 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
	}
	.title {
		height: 56px;
		line-height: 56px;
		font-weight: bold;
		color: #1e2226;
		// margin: 0 8px 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
	}
	.edit_btn {
		background-color: #5db179;
		color: white;
		border-radius: 5px;
	}

	.form_pad {
		padding: 0 16px 60px;
	}
	.footer {
		position: fixed;
		bottom: 11px;
		background-color: #fff;
		line-height: 64px;
		width: 83.5%;
		border-top: 1px solid #f1f2f5;
		button {
			margin-left: 20px;
		}
	}
}
</style>
