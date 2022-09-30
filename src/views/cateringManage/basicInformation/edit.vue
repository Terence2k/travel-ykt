<template>
	<div class="warp">
		<div class="form_pad">
			<header>基本信息</header>
			<a-form
				:model="formData.data"
				ref="formRef"
				labelAlign="left"
				:label-col="{ span: 3 }"
				:wrapper-col="{ span: 6 }"
				autocomplete="off"
				:scrollToFirstError="true"
			>
				<a-form-item label="门店名称" v-bind="validateInfos[`data.name`]">
					<a-select allowClear v-model:value="formData.data.name" placeholder="请选择门店名称">
						<a-select-option v-for="i in cateringStoreName" :key="i.shopName" :value="i.shopId">{{ i.shopName }}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="企业类型" v-bind="validateInfos[`data.businessType`]">
					<a-select allowClear v-model:value="formData.data.businessType" placeholder="请选择企业类型">
						<a-select-option v-for="o in businessTypeOption" :key="o.name" :value="o.oid">{{ o.name }}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="门店地址" class="area" :wrapperCol="{ span: 18 }" v-bind="errorInfos">
					<a-select allowClear v-model:value="formData.data.provinceId" placeholder="请选择省" style="width: 120px" @change="selectCity">
						<a-select-option v-for="item in proviceList" :key="item.oid" :value="item.oid">{{ item.name }}</a-select-option>
					</a-select>
					&nbsp;
					<a-select allowClear v-model:value="formData.data.cityId" placeholder="请选择市" style="width: 120px" @change="selectArea">
						<a-select-option v-for="item in cityList" :key="item.oid" :value="item.oid">{{ item.name }}</a-select-option>
					</a-select>
					&nbsp;
					<a-select allowClear v-model:value="formData.data.areaId" placeholder="请选择辖区" style="width: 120px">
						<a-select-option v-for="item in areaList" :key="item.oid" :value="item.oid">{{ item.name }}</a-select-option>
					</a-select>
					&nbsp;
					<a-input v-model:value="formData.data.addressDetail" allowClear style="width: 150px" placeholder="请输入详细地址" />
				</a-form-item>
				<a-form-item label="统一社会信用代码" v-bind="validateInfos[`data.creditCode`]">
					<a-input v-model:value="formData.data.creditCode" />
				</a-form-item>
				<a-form-item label="营业执照" v-bind="validateInfos[`data.businessLicenseUrl`]">
					<pic></pic>
				</a-form-item>
				<a-form-item label="联系人姓名" v-bind="validateInfos[`data.contactName`]">
					<a-input v-model:value="formData.data.contactName" placeholder="请输入联系人姓名" />
				</a-form-item>
				<a-form-item label="联系人电话" v-bind="validateInfos[`data.phone`]">
					<a-input v-model:value="formData.data.phone" placeholder="请输入联系人电话" />
				</a-form-item>
				<a-form-item label="企业状态" v-bind="validateInfos[`data.onOff`]">
					<a-radio-group v-model:value="formData.data.onOff">
						<a-radio :value="1">开通</a-radio>
						<a-radio :value="0">关闭</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="账户类型" v-bind="validateInfos[`data.accountType`]">
					<a-radio-group v-model:value="formData.data.accountType">
						<a-radio :value="1">对公账号</a-radio>
						<a-radio :value="2">个人账号</a-radio>
					</a-radio-group>
				</a-form-item>
				<div class="title">结算（收款）账户信息</div>

				<a-form-item label="收款账号" v-bind="validateInfos[`data.bankAccount`]">
					<a-input v-model:value="formData.data.bankAccount" placeholder="请输入收款银行卡号" />
				</a-form-item>
				<a-form-item label="账户名" v-bind="validateInfos[`data.bankAccountName`]">
					<a-input v-model:value="formData.data.bankAccountName" placeholder="请输入账户名" />
				</a-form-item>
				<a-form-item label="开户行地址" v-bind="validateInfos[`data.accountAddress`]">
					<a-input v-model:value="formData.data.accountAddress" placeholder="请输入开户行地址" />
				</a-form-item>
				<a-form-item label="收款行" v-bind="validateInfos[`data.bank`]">
					<a-input v-model:value="formData.data.bank" placeholder="请输入收款行" />
				</a-form-item>
				<div class="title">补充说明</div>

				<a-form-item label="营业时间" required>
					<a-time-picker v-model:value="formData.data.starttime" format="HH:mm" valueFormat="HH:mm" :placeholder="formData.data.startTime" />
					<span class="span_width">至</span>
					<a-time-picker v-model:value="formData.data.endtime" format="HH:mm" valueFormat="HH:mm" :placeholder="formData.data.endTime" />
				</a-form-item>
				<a-form-item label="联系电话" v-bind="validateInfos[`data.shopPhone`]">
					<a-input v-model:value="formData.data.shopPhone" placeholder="请输入联系电话" />
				</a-form-item>
				<a-form-item label="其他">
					<a-input v-model:value="formData.data.cateringDesc" placeholder="请输入" />
				</a-form-item>
			</a-form>
		</div>
		<div class="footer">
			<a-button type="primary" @click="auditing">提交审核</a-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { useScenicSpotOption } from '@/stores/modules/scenicSpot';
const scenicSpotOptions = useScenicSpotOption();
import { message } from 'ant-design-vue';
import { Form } from 'ant-design-vue';
import { RadioGroupProps } from 'ant-design-vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import { onMounted, reactive, toRaw, ref, computed } from 'vue';
import Pic from '@/components/common/imageWrapper.vue';
import { toArray } from 'lodash';
import api from '@/api';
const useForm = Form.useForm;
const navigatorBar = useNavigatorBar();
const route = useRouter();

const formData = reactive({
	data: [],
});

//下拉列表
const businessTypeOption = computed(() => scenicSpotOptions.businessTypeOption);
const proviceList = computed(() => scenicSpotOptions.proviceList);
const cityList = computed(() => scenicSpotOptions.cityList);
const areaList = computed(() => scenicSpotOptions.areaList);
const cateringStoreName = computed(() => scenicSpotOptions.cateringStoreName);
// 联动
const selectCity = async (id: number) => {
	if (id) {
		await scenicSpotOptions.getAllAreaCity(id);
	} else {
		scenicSpotOptions.cleanCity();
		formData.data.cityId = null;
		formData.data.areaId = null;
	}
};
const selectArea = async (id: any) => {
	await scenicSpotOptions.getAllArea(id);
	if (id) {
		await scenicSpotOptions.getAllAreaCity(id);
	} else {
		scenicSpotOptions.cleanArae();
		formData.data.areaId = null;
	}
};

const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formData,
	reactive({
		'data.provinceId': [{ required: true, message: '请选择省份' }],
		'data.cityId': [{ required: true, message: '请选择市' }],
		'data.areaId': [{ required: true, message: '请选择县区' }],
		'data.addressDetail': [{ required: true, message: '请填写详细地址' }],
		'data.name': [{ required: true, message: '请输入门店名字' }],
		'data.creditCode': [{ required: true, message: '请填写统一社会行用代码' }],
		'data.phone': [{ required: true, message: '请填写手机号码' }],
		'data.contactName': [{ required: true, message: '请填写联系人姓名' }],
		'data.businessLicenseUrl': [{ required: true, message: '请上传图片' }],
		'data.accountType': [{ required: true, message: '请选择账户类型' }],
		'data.bankAccount': [{ required: true, message: '请填写银行账号' }],
		'data.accountAddress': [{ required: true, message: '请填写开户地址' }],
		'data.businessType': [{ required: true, message: '请选择企业类型' }],
		'data.bankAccountName': [{ required: true, message: '请填写银行账户名' }],
		'data.unitStatus': [{ required: true, message: '请选择企业状态' }],
		'data.bank': [{ required: true, message: '请填写还款行' }],
		'data.shopPhone': [{ required: true, message: '请填写店铺联系电话' }],
		'data.onOff': [{ required: true, message: '请选择企业状态' }],
	})
);

//合并错误提示
const errorInfos = computed(() => {
	return mergeValidateInfo(toArray(validateInfos).splice(0, 4));
});

const disabledDate = (time: any) => {
	return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
};

const auditing = () => {
	validate()
		.then((res) => {
			const Data = {
				oid: formData.data.oid, //oid
				name: formData.data.name, //企业名称
				creditCode: formData.data.creditCode, //统一社会行用代码
				phone: formData.data.phone, //电话
				contactName: formData.data.contactName, //联系人姓名
				provinceId: formData.data.provinceId, //省id
				cityId: formData.data.cityId, //市id
				areaId: formData.data.areaId, //县区id
				addressDetail: formData.data.addressDetail, //详细地址
				onOff: formData.data.onOff, //审核状态，（0.注册审核中 1.注册审核通过   2.注册审核未通过  ）
				accountType: formData.data.accountType, //账户类型
				bankAccount: formData.data.bankAccount, //银行账号
				accountAddress: formData.data.accountAddress, //开户地址
				bank: formData.data.bank, //收款行
				businessLicenseUrl: formData.data.businessLicenseUrl, //营业执照图片地址
				businessType: formData.data.businessType, //企业业态（注册时，根据字典配置，景区、酒店、旅行社等）
				bankAccountName: formData.data.bankAccountName, //银行账户名
				shopPhone: formData.data.shopPhone, //店铺联系电话
				startTime: formData.data.startTime, //开始时间
				endTime: formData.data.endTime, //餐结束时间
				cateringDesc: formData.data.cateringDesc, //其他描述
			};
			if (formData.data.starttime) {
				Data.startTime = formData.data.starttime;
			}
			if (formData.data.endtime) {
				Data.endTime = formData.data.endtime;
			}
			Audit(toRaw(Data));
		})
		.catch((err) => {
			console.log('error', err);
		});
};

const Audit = async (params: object) => {
	let res = await api.getCateringAudit(params);
	if (res) {
		message.success('提交审核成功');
		route.push({ path: '/catering/basic_Information/index' });
	}
};

const initPage = async (): Promise<void> => {
	await scenicSpotOptions.getBusinessTypeOption();
	await scenicSpotOptions.getCateringStoreName();
	await scenicSpotOptions.getAllAreaProvice(0);
	api.getCateringInfo(route.currentRoute.value?.query?.oid).then((res: any) => {
		formData.data = res;
	});
};

onMounted(() => {
	initPage();
	navigatorBar.setNavigator(['基础信息管理', '编辑']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less" scoped>
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
	.area {
		min-height: 55px;
		max-height: 120px;
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
	.span_width {
		margin: 0 35px;
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
