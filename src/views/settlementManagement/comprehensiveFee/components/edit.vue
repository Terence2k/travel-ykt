<template>
	<div class="warp">
		<!-- <header>基本信息</header> -->
		<div class="title">基本信息</div>
		<a-form :model="formData.data" :rules="rulesRef" ref="formref" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-form-item label="综费产品" name="comprehensiveFeeProductName">
				<a-input v-model:value="formData.data.comprehensiveFeeProductName" placeholder="请填写产品名称" />
			</a-form-item>
			<a-form-item label="费用归属" name="belongCompany">
				<a-select v-model:value="formData.data.belongCompany" style="width: 100%" placeholder="请选择费用归属" allowClear>
					<a-select-option v-for="(item, index) in option" :value="item.codeValue" :key="index">{{ item.name }} </a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="费用说明" name="feeExplanation">
				<a-input v-model:value="formData.data.feeExplanation" placeholder="请填写规则说明" />
			</a-form-item>
			<a-form-item label="状态" name="status">
				<a-radio-group v-model:value="formData.data.status">
					<a-radio :value="1">启用</a-radio>
					<a-radio :value="0">禁用</a-radio>
				</a-radio-group>
			</a-form-item>
			<div class="title">收费规则</div>
			<a-form-item label="收费模式" name="feeModel">
				<a-radio-group v-model:value="formData.data.feeModel">
					<a-radio :value="0">人数</a-radio>
					<a-radio :value="1">价格</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="收费金额" name="feeNumber">
				<a-input v-model:value="formData.data.feeNumber" placeholder="请填写收款数量">
					<template #addonAfter>
						<div>
							{{ formData.data.feeModel === 1 ? '元' : '元/人' }}
						</div>
					</template>
				</a-input>
			</a-form-item>
			<a-form-item label="是否按天收费" name="confirmDailyCharge">
				<a-radio-group v-model:value="formData.data.confirmDailyCharge">
					<a-radio :value="1">是</a-radio>
					<a-radio :value="0">否</a-radio>
				</a-radio-group>
			</a-form-item>
		</a-form>
		<div class="footer">
			<div class="tooter-btn">
				<a-button type="primary" @click.prevent="onSubmit">保存</a-button>
				<a-button @click="reset">取消</a-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import api from '@/api';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { isIntegerNotMust } from '@/utils/validator';
import { message } from 'ant-design-vue';
import { settlementOptions } from '@/stores/modules/settlement';
const useOptions = settlementOptions();
const navigatorBar = useNavigatorBar();
const tstyle = { 'font-weight': '700' };
const route = useRouter();
const formref = ref();
import { accDiv } from '@/utils/compute';

const rulesRef = {
	comprehensiveFeeProductName: [{ required: true, message: '请填写产品名称' }],
	confirmDailyCharge: [{ required: true, message: '请选择是否必收费用' }],
	feeExplanation: [{ required: true, message: '请填写规则说明' }],
	status: [{ required: true, message: '请选择状态' }],
	feeModel: [{ required: true, message: '请选择收费模式' }],
	feeNumber: [{ required: true, validator: isIntegerNotMust }],
	belongCompany: [{ required: true, message: '请选择费用归属', trigger: 'blur' }],
};
const formData: any = reactive({
	data: {},
});
const initOption = async () => {
	await useOptions.getBusinessTypeOptionList();
};
const option = computed(() => useOptions.businessTypeOptionList);
//初始化页面
const initPage = async (): Promise<void> => {
	// 判断编辑还是新增，自定义面包屑
	if (route.currentRoute.value?.query?.edit) {
		navigatorBar.setNavigator(['结算管理', '综费产品', '编辑']);
		api.getcomprehensiveFeeDetail(route.currentRoute.value?.query?.oid).then((res: any) => {
			formData.data = res;
			formData.data.feeNumber = accDiv(formData.data.feeNumber, 100)
		});
	} else {
		navigatorBar.setNavigator(['结算管理', '综费产品', '新增']);
		// 新增页面 默认选中
		formData.data.confirmDailyCharge = 0; // 是否按天收费 默认选否
		formData.data.status = 1; // 状态启用
		formData.data.feeModel = 0; // 收费模式 人数
	}
};
// 提交保存
const onSubmit = () => {
	formref.value
		.validate()
		.then((res: object) => {
			const Data = {
				comprehensiveFeeProductName: formData.data.comprehensiveFeeProductName,
				confirmDailyCharge: formData.data.confirmDailyCharge,
				feeExplanation: formData.data.feeExplanation,
				status: formData.data.status,
				feeModel: formData.data.feeModel,
				feeNumber: formData.data.feeNumber * 100,
				belongCompany: formData.data.belongCompany,
			};
			save(toRaw(Data));
		})
		.catch((err: object) => {
			console.log('error', err);
		});
};
// 保存成功
const save = async (params: any) => {
	let res;
	if (route.currentRoute.value?.query?.edit) {
		// 判断是否编辑
		params.oid = formData.data.oid; // 编辑需要带oid
		await api.comprehensiveFeeUpdate(params).then((res) => {
			// 编辑
			message.success('保存成功');
			route.push({ path: '/settlementManagement/comprehensiveFee' });
		});
	} else {
		await api.comprehensiveFeeAdd(params).then((res) => {
			// 新增
			message.success('保存成功');
			route.push({ path: '/settlementManagement/comprehensiveFee' });
		});
	}
};
// 取消
const reset = async () => {
	route.push({ path: '/settlementManagement/comprehensiveFee' });
};

onMounted(() => {
	initPage();
	initOption();
});
</script>

<style lang="less" scoped>
.warp {
	padding: 0 20px;
	.title {
		height: 44px;
		line-height: 44px;
		font-weight: bold;
		color: #1e2226;
		margin-top: 12px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
		font-size: 16px;
		font-family: Microsoft YaHei UI;
		font-weight: bold;
		color: #1e2226;
		box-sizing: content-box;
	}
	.footer {
		position: fixed;
		bottom: 12px;
		line-height: 64px;
		height: 64px;
		width: calc(100% - 288px);
		border-top: 1px solid #f1f2f5;
		margin-left: -16px;
		margin-right: 24px;
		background-color: #fff;
		z-index: 99;

		.tooter-btn {
			width: 60%;
			margin-left: 16px;
		}
		button:first-of-type {
			margin-right: 16px;
		}
	}
}
// .ant-form-item {
// 	font-size: 14px;
// 	font-family: Microsoft YaHei UI;
// 	font-weight: 400;
// 	color: #1e2226;
// 	margin-top: 13px;
// 	margin-bottom: 0;
// 	height: 32px;
// }
// ::v-deep(.ant-form-item-control-input) {
// 	height: 18px;
// }
// ::v-deep(.ant-form-item-label > label) {
// 	position: relative;
// 	display: inline-flex;
// 	align-items: center;
// 	max-width: 100%;
// 	height: 32px;
// 	font-size: 14px;
// 	font-family: Microsoft YaHei UI;
// 	font-weight: 400;
// 	color: #1e2226;
// }
</style>
