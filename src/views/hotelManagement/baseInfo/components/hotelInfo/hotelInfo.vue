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
						<a-input v-model:value="formValidate.companyType" />
					</a-form-item>
					<a-form-item class="form-item" label="所属地区">
						<div class="flex-container">
							<a-form-item name="firstLevelArea">
								<a-select
									v-model:value="areaState.firstLevelArea"
									class="select-area"
									:options="areaState.firstLevelAreasGroup.map(({ id, name }) => ({ value: id, label: name }))"
								></a-select>
							</a-form-item>
							<a-form-item name="secondLevelArea">
								<a-select
									v-model:value="areaState.secondLevelArea"
									class="select-area"
									:options="areaState.currentSecondLevelAreasGroup.map(({ id, name }) => ({ value: id, label: name }))"
								></a-select>
							</a-form-item>
							<a-form-item name="thirdLevelArea">
								<a-select
									v-model:value="areaState.thirdLevelArea"
									class="select-area"
									:options="areaState.currentThirdLevelAreasGroup.map(({ id, name }) => ({ value: id, label: name }))"
								></a-select>
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
						<a-form-item name="businessLicense" no-style>
							<a-upload
								:maxCount="1"
								action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								list-type="picture-card"
								@preview="handlePreview"
								class="uploadArea"
								v-model:fileList="fileState.businessLicense"
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
						<a-input v-model:value="formValidate.hotelStar" />
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
import api from '@/api';
import { message } from 'ant-design-vue/es';
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

let firstLevelAreasGroup = [
	{
		id: 'a1',
		name: '广东',
	},
	{
		id: 'a2',
		name: '四川',
	},
	{
		id: 'a3',
		name: '浙江',
	},
];
let secondLevelAreasGroup = [
	{
		id: 'b1',
		containerId: 'a1',
		name: '广州',
	},
	{
		id: 'b2',
		containerId: 'a1',
		name: '中山',
	},
	{
		id: 'b3',
		containerId: 'a1',
		name: '佛山',
	},
	{
		id: 'b4',
		containerId: 'a1',
		name: '韶关',
	},
	{
		id: 'b5',
		containerId: 'a2',
		name: '成都',
	},
	{
		id: 'b6',
		containerId: 'a2',
		name: '攀枝花',
	},
	{
		id: 'b7',
		containerId: 'a2',
		name: '绵阳',
	},
	{
		id: 'b8',
		containerId: 'a2',
		name: '乐山',
	},
	{
		id: 'b9',
		containerId: 'a3',
		name: '杭州',
	},
	{
		id: 'b10',
		containerId: 'a3',
		name: '宁波',
	},
	{
		id: 'b11',
		containerId: 'a3',
		name: '嘉兴',
	},
	{
		id: 'b12',
		containerId: 'a3',
		name: '金华',
	},
];
let thirdLevelAreasGroup = [
	{
		id: 'c1',
		containerId: 'b1',
		name: '天河',
	},
	{
		id: 'c2',
		containerId: 'b1',
		name: '越秀',
	},
	{
		id: 'c3',
		containerId: 'b1',
		name: '海珠',
	},
	{
		id: 'c4',
		containerId: 'b1',
		name: '番禺',
	},
	{
		id: 'c5',
		containerId: 'b2',
		name: '小榄',
	},
	{
		id: 'c6',
		containerId: 'b2',
		name: '东凤',
	},
	{
		id: 'c7',
		containerId: 'b2',
		name: '坦洲',
	},
	{
		id: 'c8',
		containerId: 'b3',
		name: '南海',
	},
	{
		id: 'c9',
		containerId: 'b4',
		name: '乐昌',
	},
	{
		id: 'c10',
		containerId: 'b5',
		name: '锦江',
	},
	{
		id: 'c11',
		containerId: 'b5',
		name: '成化',
	},
	{
		id: 'c12',
		containerId: 'b5',
		name: '青羊',
	},
	{
		id: 'c13',
		containerId: 'b5',
		name: '武侯',
	},
	{
		id: 'c14',
		containerId: 'b5',
		name: '金牛',
	},
	{
		id: 'c15',
		containerId: 'b9',
		name: '西湖',
	},
	{
		id: 'c16',
		containerId: 'b9',
		name: '滨江',
	},
	{
		id: 'c17',
		containerId: 'b9',
		name: '余杭',
	},
	{
		id: 'c18',
		containerId: 'b9',
		name: '钱塘',
	},
];

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
};

const areaState = reactive({
	firstLevelAreasGroup,
	secondLevelAreasGroup,
	thirdLevelAreasGroup,
	firstLevelArea: '',
	secondLevelArea: '',
	thirdLevelArea: '',
	currentSecondLevelAreasGroup: [],
	currentThirdLevelAreasGroup: [],
});

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

const handleChange = ({ fileList: newFileList }: FileInfo) => {
	fileList.value = newFileList;
};

watch(
	() => areaState.firstLevelArea,
	(val) => {
		console.info('test1', val);
		areaState.secondLevelArea = '';
		areaState.currentSecondLevelAreasGroup = areaState.secondLevelAreasGroup.filter((item) => item.containerId === val);
		// if (areaState.currentSecondLevelAreasGroup.length > 0) {
		// 	//console.info('test2', areaState.currentSecondLevelAreasGroup[0]);
		// 	areaState.secondLevelArea = areaState.currentSecondLevelAreasGroup[0].name;
		// }

		console.info('areaState.currentSecondLevelAreasGroup', areaState.currentSecondLevelAreasGroup);
	}
);

watch(
	() => areaState.secondLevelArea,
	(val) => {
		console.info('test2', val);
		areaState.thirdLevelArea = '';
		areaState.currentThirdLevelAreasGroup = areaState.thirdLevelAreasGroup.filter((item) => item.containerId === val);
		// if (areaState.currentThirdLevelAreasGroup.length > 0) {
		// 	areaState.thirdLevelArea = areaState.currentThirdLevelAreasGroup[0].name;
		// }

		console.info('areaState.currentThirdLevelAreasGroup', areaState.currentThirdLevelAreasGroup);
	}
);

watch(
	route,
	(res) => {
		const id = route?.query?.id;
		if (id) {
			api.getHotelDetailInfo({}, id).then((res) => {
				console.info(`id${id}酒店信息:`, res);
				hotelInfoResponse.value = res;
				//localStorage.setItem('hotelTabInfo', JSON.stringify(res));
				const resultRes = {
					hotelName: res?.hotelName,
					companyType: res?.businessTypeName,
					detailAddress: res?.addressDetail,
					businessLicense: res?.businessLicenseUrl,
					usci: res?.creditCode,
					personName: res?.contactName,
					phoneNumber: res?.phone,
					companyStatus: res?.unitStatus,
					hotelStar: res?.hotelStarCode,
					isDiscount: res?.isReduced,
					discountRule: res?.reduceRule,
				};
				formValidate.value.hotelName = resultRes.hotelName;
				formValidate.value.companyType = resultRes.companyType;
				formValidate.value.detailAddress = resultRes.detailAddress;
				formValidate.value.businessLicense = resultRes.businessLicense;
				formValidate.value.usci = resultRes.usci;
				formValidate.value.personName = resultRes.personName;
				formValidate.value.phoneNumber = resultRes.phoneNumber;
				formValidate.value.companyStatus = resultRes.companyStatus;
				formValidate.value.hotelStar = resultRes.hotelStar;
				formValidate.value.isDiscount = resultRes.isDiscount;
				formValidate.value.discountRule = resultRes.discountRule;
			});
		}
	},
	{
		immediate: true,
	}
);

const saveHotelInfo = () => {
	const result = {
		...hotelInfoResponse.value,
		hotelName: formValidate.value.hotelName,
		businessTypeName: formValidate.value.companyType,
		addressDetail: formValidate.value.detailAddress,
		//businessLicenseUrl:formValidate.value.businessLicense,
		creditCode: formValidate.value.usci,
		contactName: formValidate.value.personName,
		phone: formValidate.value.phoneNumber,
		unitStatus: parseInt(formValidate.value.companyStatus),
		isReduced: formValidate.value.isDiscount,
		reduceRule: formValidate.value.discountRule,
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
