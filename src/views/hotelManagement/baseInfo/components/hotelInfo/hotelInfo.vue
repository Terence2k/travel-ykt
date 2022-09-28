<template>
	<div class="wrapper-tab-hotelInfo">
		<a-form
			:model="formValidate"
			:rules="rules"
			:scrollToFirstError="true"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 8, offset: 1 }"
			labelAlign="left"
		>
			<div class="scroll-container">
				<div class="baseInfo-container container">
					<div class="title">
						<span>基本信息</span>
					</div>
					<a-form-item class="form-item" label="酒店名称" name="hotelName">
						<a-input v-model:value="formValidate.hotelName" />
					</a-form-item>
					<a-form-item class="form-item" label="企业类型" name="companyType">
						<a-select v-model:value="formValidate.companyType" :options="companyTypeOptions"></a-select>
					</a-form-item>
					<a-form-item class="form-item" label="所属地区">
						<!-- <address-selector placeholder="请选择所属地区" v-model:value="areaState.regionCode" @change="regionChange" /> -->
						<div class="flex-container">
							<a-form-item name="firstLevelArea">
								<a-select v-model:value="areaState.firstLevelArea" class="select-area" :options="areaState.firstLevelAreasGroup"></a-select>
							</a-form-item>
							<a-form-item name="secondLevelArea">
								<a-select v-model:value="areaState.secondLevelArea" class="select-area" :options="areaState.currentSecondLevelAreasGroup"></a-select>
							</a-form-item>
							<a-form-item name="thirdLevelArea">
								<a-select v-model:value="areaState.thirdLevelArea" class="select-area" :options="areaState.currentThirdLevelAreasGroup"></a-select>
							</a-form-item>
							<a-form-item name="detailAddress">
								<a-input placeholder="请输入详细地址" v-model:value="formValidate.detailAddress" />
							</a-form-item>
						</div>
					</a-form-item>
					<a-form-item class="form-item" label="统一社会信用代码" name="usci">
						<a-input v-model:value="formValidate.usci" />
					</a-form-item>
					<a-form-item class="form-item item-businessLicense" label="营业执照">
						<!-- <Pic v-model:value="formValidate.businessLicense"></Pic> -->
						<a-form-item name="businessLicense" no-style>
							<a-upload
								:maxCount="1"
								list-type="picture-card"
								@preview="handlePreview"
								class="uploadArea"
								v-model:fileList="fileState.businessLicense"
								:beforeUpload="beforeUpload"
							>
								<p class="ant-upload-drag-icon">上传图片</p>
								<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
									<img alt="example" style="width: 100%" :src="previewImage" />
								</a-modal>
							</a-upload>
						</a-form-item>
					</a-form-item>
					<a-form-item class="form-item" label="联系人姓名" name="personName">
						<a-input v-model:value="formValidate.personName" />
					</a-form-item>
					<a-form-item class="form-item" label="联系人电话" name="phoneNumber">
						<a-input v-model:value="formValidate.phoneNumber" />
					</a-form-item>
					<a-form-item class="form-item" label="企业状态" name="companyStatus">
						<a-radio-group v-model:value="formValidate.companyStatus">
							<a-radio :value="0">开业</a-radio>
							<a-radio :value="1">停业</a-radio>
						</a-radio-group>
					</a-form-item>
					<a-form-item class="form-item bottom-item" label="酒店星级" name="hotelStar">
						<a-select v-model:value="formValidate.hotelStar" class="select-area" :options="starOptions"></a-select>
					</a-form-item>
				</div>
				<div class="discount-container container">
					<div class="title">
						<span>减免属性</span>
					</div>
					<a-form-item class="form-item" label="企业是否支持减免" name="isDiscount">
						<a-radio-group v-model:value="formValidate.isDiscount">
							<a-radio :value="1">是</a-radio>
							<a-radio :value="0">否</a-radio>
						</a-radio-group>
					</a-form-item>
					<a-form-item class="form-item" label="减免规则" name="discountRule">
						<a-input placeholder="请输入减免规则,用,号分隔。如16，1表示16免1" v-model:value="formValidate.discountRule" />
					</a-form-item>
				</div>
				<div class="account-container container">
					<div class="title">
						<span>结算（收款）账户信息</span>
					</div>
					<a-form-item class="form-item" label="账户类型" name="accountType">
						<a-radio-group v-model:value="formValidate.accountType">
							<a-radio :value="1">对公账户</a-radio>
							<a-radio :value="2">个人账户</a-radio>
						</a-radio-group>
					</a-form-item>
					<a-form-item class="form-item" label="收款账户" name="receivableAccount">
						<a-input placeholder="请输入收款银行卡号" v-model:value="formValidate.receivableAccount" />
					</a-form-item>
					<a-form-item class="form-item" label="账户名" name="accountName">
						<a-input placeholder="请输入账户名" v-model:value="formValidate.accountName" />
					</a-form-item>
					<a-form-item class="form-item" label="开户行地址" name="passBankAddress">
						<a-input placeholder="请输入开户行地址" v-model:value="formValidate.passBankAddress" />
					</a-form-item>
					<a-form-item class="form-item" label="收款行" name="receivableBank">
						<a-input placeholder="请输入收款行" v-model:value="formValidate.receivableBank" />
					</a-form-item>
				</div>
			</div>
			<div class="footer-container">
				<div class="form-item footer-item">
					<a-button html-type="submit" @click="saveHotelInfo" class="button">保存</a-button>
					<a-button class="button">提交审核</a-button>
				</div>
			</div>
		</a-form>
	</div>
</template>

<script setup lang="ts">
import { toRaw } from '@vue/reactivity';
import api from '@/api';
import { message } from 'ant-design-vue/es';
// import Pic from '@/components/common/imageWrapper.vue';
// import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
interface FileItem {
	uid: string;
	name?: string;
	status?: string;
	response?: string;
	percent?: number;
	url?: string;
	preview?: string;
	originFileObj?: any;
}

interface FileInfo {
	file: FileItem;
	fileList: FileItem[];
}

const route = useRoute();

const formValidate: Ref<Record<string, any>> = ref({});

let address1Validate = async (_rule: Rule, value: string) => {
	if (areaState.firstLevelArea) {
		return Promise.resolve();
	} else {
		return Promise.reject('请输入正确的地址信息');
	}
};
let address2Validate = async (_rule: Rule, value: string) => {
	if (areaState.secondLevelArea) {
		return Promise.resolve();
	} else {
		return Promise.reject('请输入正确的地址信息');
	}
};
let address3Validate = async (_rule: Rule, value: string) => {
	if (areaState.thirdLevelArea) {
		return Promise.resolve();
	} else {
		return Promise.reject('请输入正确的地址信息');
	}
};
let address4Validate = async (_rule: Rule, value: string) => {
	if (formValidate?.value?.detailAddress) {
		return Promise.resolve();
	} else {
		return Promise.reject('请输入正确的地址信息');
	}
};

let businessLicenseValidate = async (_rule: Rule, value: string) => {
	if (fileState.businessLicense.length > 0) {
		return Promise.resolve();
	} else {
		return Promise.reject('请上传营业执照');
	}
};

const rules: any = {
	hotelName: [{ required: true, trigger: 'blur', message: '请输入酒店名称' }],
	companyType: [{ required: true, trigger: 'blur', message: '请输入企业类型' }],
	firstLevelArea: [{ validator: address1Validate, trigger: 'change', message: '请输入第一级地址' }],
	secondLevelArea: [{ validator: address2Validate, trigger: 'change', message: '请输入第二级地址' }],
	thirdLevelArea: [{ validator: address3Validate, trigger: 'change', message: '请输入第三级地址' }],
	detailAddress: [{ validator: address4Validate, trigger: 'blur', message: '请输入详细地址' }],
	businessLicense: [{ validator: businessLicenseValidate, trigger: 'change', message: '请上传营业执照' }],
	usci: [{ required: true, trigger: 'blur', message: '请输入统一社会信用代码' }],
	personName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
	phoneNumber: [{ required: true, trigger: 'blur', message: '请输入联系人电话' }],
	companyStatus: [{ required: true, trigger: 'change', message: '请选择企业状态' }],
	hotelStar: [{ required: true, trigger: 'blur', message: '请输入酒店星级' }],
	isDiscount: [{ required: true, trigger: 'change', message: '请选择企业是否支持减免' }],
	discountRule: [{ required: true, trigger: 'blur', message: '请输入减免规则' }],
	accountType: [{ required: true, trigger: 'change', message: '请输入账户类型' }],
	receivableAccount: [{ required: true, trigger: 'blur', message: '请输入收款账号' }],
	accountName: [{ required: true, trigger: 'blur', message: '请输入账户名' }],
	passBankAddress: [{ required: true, trigger: 'blur', message: '请输入开户行地址' }],
	receivableBank: [{ required: true, trigger: 'blur', message: '请输入收款行' }],
};

const companyTypeOptions = ref([]);
const starOptions = ref([]);
const areaState = reactive({
	firstLevelAreasGroup: [],
	firstLevelArea: '',
	secondLevelArea: '',
	thirdLevelArea: '',
	currentSecondLevelAreasGroup: [],
	currentThirdLevelAreasGroup: [],
});

const regionChange = () => {
	areaState.provinceId = areaState.regionCode ? areaState.regionCode[0] : undefined;
	areaState.cityId = areaState.regionCode ? areaState.regionCode[1] : undefined;
	areaState.areaId = areaState.regionCode ? areaState.regionCode[2] : undefined;
};

const fileState = reactive({
	businessLicense: [],
});

const previewVisible = ref<boolean>(false);
const previewImage = ref<string | undefined>('');

const hotelInfoResponse = ref({});
const getBase64 = (file: File) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};

const handleCancel = () => {
	previewVisible.value = false;
};

const handlePreview = async (file: FileItem) => {
	if (!file.url && !file.preview) {
		file.preview = (await getBase64(file.originFileObj)) as string;
	}
	previewImage.value = file.url || file.preview;
	previewVisible.value = true;
};

const beforeUpload = (file: any) => {
	const maxSize = 20 * 1024 * 1024;
	if (file.size > maxSize) {
		message.error('只能上传 20M 以下的文件');
		return false;
	}

	return true;
};

const handleChange = ({ fileList: newFileList }: FileInfo) => {
	fileList.value = newFileList;
};

watch(
	() => areaState.firstLevelArea,
	(val) => {
		if (val) {
			api.getAllArea(val, 2).then((result) => {
				areaState.currentSecondLevelAreasGroup = result?.map((item) => {
					return {
						value: item.oid,
						label: item.name,
					};
				});
				if (hotelInfoResponse.value.secondLevelArea) {
					hotelInfoResponse.value.secondLevelArea = undefined;
				} else {
					areaState.secondLevelArea = areaState.currentSecondLevelAreasGroup[0]?.value;
				}
			});
		}
	}
);

watch(
	() => areaState.secondLevelArea,
	(val) => {
		if (val) {
			api.getAllArea(val, 3).then((result) => {
				areaState.currentThirdLevelAreasGroup = result?.map((item) => {
					return {
						value: item.oid,
						label: item.name,
					};
				});
				if (hotelInfoResponse.value.thirdLevelArea) {
					hotelInfoResponse.value.thirdLevelArea = undefined;
				} else {
					areaState.thirdLevelArea = areaState.currentThirdLevelAreasGroup[0]?.value;
				}
			});
		}
	}
);

watch(
	() => route.query,
	(res) => {
		const id = route?.query?.id;
		if (id) {
			api.getHotelDetailInfo({}, id).then((res) => {
				console.info(`id${id}酒店信息:`, res);

				//localStorage.setItem('hotelTabInfo', JSON.stringify(res));
				const resultRes = {
					hotelName: res?.hotelName,
					companyType: res?.businessType,
					//companyTypeName: res?.businessTypeName,
					firstLevelArea: res?.provinceId,
					secondLevelArea: res?.cityId,
					thirdLevelArea: res?.areaId,
					detailAddress: res?.addressDetail,
					businessLicense: res?.businessLicenseUrl,
					usci: res?.creditCode,
					personName: res?.contactName,
					phoneNumber: res?.phone,
					companyStatus: res?.unitStatus,
					hotelStar: res?.hotelStarId,
					isDiscount: res?.isReduced,
					discountRule: res?.reduceRule,
					accountType: res?.accountType,
					accountName: res?.bankAccountName,
					receivableAccount: res?.bankAccount,
					passBankAddress: res?.accountAddress,
					receivableBank: res?.bank,
				};
				hotelInfoResponse.value = resultRes;
				formValidate.value.hotelName = resultRes.hotelName;
				formValidate.value.companyType = resultRes.companyType;
				areaState.firstLevelArea = resultRes.firstLevelArea;
				areaState.secondLevelArea = resultRes.secondLevelArea;
				areaState.thirdLevelArea = resultRes.thirdLevelArea;
				formValidate.value.detailAddress = resultRes.detailAddress;
				formValidate.value.usci = resultRes.usci;
				fileState.businessLicense[0] = {
					uid: '-1',
					name: 'image.png',
					status: 'done',
					url: resultRes.businessLicense,
				};
				//formValidate.value.businessLicense = resultRes.businessLicense;
				formValidate.value.personName = resultRes.personName;
				formValidate.value.phoneNumber = resultRes.phoneNumber;
				formValidate.value.companyStatus = resultRes.companyStatus;
				formValidate.value.hotelStar = resultRes.hotelStar;
				formValidate.value.isDiscount = resultRes.isDiscount;
				formValidate.value.discountRule = resultRes.discountRule;
				formValidate.value.accountType = resultRes.accountType;
				formValidate.value.accountName = resultRes.accountName;
				formValidate.value.receivableAccount = resultRes.receivableAccount;
				formValidate.value.passBankAddress = resultRes.passBankAddress;
				formValidate.value.receivableBank = resultRes.receivableBank;
			});

			api.getAllArea(0, 1).then((result) => {
				if (Array.isArray(result)) {
					areaState.firstLevelAreasGroup = result?.map((item) => {
						return {
							value: item.oid,
							label: item.name,
						};
					});
					console.info('area 1', areaState.firstLevelAreasGroup.value);
				}
			});

			api.getCompanyType().then((result) => {
				if (Array.isArray(result)) {
					companyTypeOptions.value = result?.map((item) => {
						return {
							value: item.oid,
							label: item.name,
						};
					});
				}
			});

			api
				.getHotelStarList({})
				.then((res: any) => {
					if (Array.isArray(res) && res.length > 0) {
						starOptions.value = res?.map((item) => {
							return {
								value: item.oid,
								label: item.starCode,
							};
						});
					}
				})
				.catch((err: any) => {
					console.log(err);
				});
		}
	},
	{
		immediate: true,
	}
);

const saveHotelInfo = () => {
	const result = {
		oid: hotelInfoResponse.value.oid,
		hotelName: formValidate.value.hotelName,
		businessType: formValidate.value.companyType,
		businessTypeName: companyTypeOptions.value.filter((item) => parseInt(item?.value) === parseInt(formValidate?.value?.companyType))[0]?.label,
		provinceId: areaState.firstLevelArea,
		cityId: areaState.secondLevelArea,
		areaId: areaState.thirdLevelArea,
		addressDetail: formValidate.value.detailAddress,
		businessLicenseUrl: toRaw(fileState.businessLicense[0])?.thumbUrl,
		//businessLicenseUrl: formValidate.value.businessLicense,
		creditCode: formValidate.value.usci,
		contactName: formValidate.value.personName,
		phone: formValidate.value.phoneNumber,
		unitStatus: parseInt(formValidate.value.companyStatus),
		//hotelStarId: starOptions.value.filter((item) => parseInt(item?.value) === parseInt(formValidate?.value?.hotelStar))[0]?.label,
		hotelStarId: formValidate?.value?.hotelStar,
		isReduced: formValidate.value.isDiscount,
		reduceRule: formValidate.value.discountRule,
		accountType: formValidate.value.accountType,
		bankAccountName: formValidate.value.accountName,
		bankAccount: formValidate.value.receivableAccount,
		accountAddress: formValidate.value.passBankAddress,
		bank: formValidate.value.receivableBank,
	};

	console.info('要保存的酒店信息：', result);
	api
		.editHotelDetailInfo(result)
		.then((res) => {
			message.success('保存成功');
			console.log('编辑酒店信息返回数据：', res);
		})
		.catch((err) => {
			message.error(err?.message);
		});
};
</script>

<style lang="less" scoped>
@import './styles/hotelInfo.less';
</style>
