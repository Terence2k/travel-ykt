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
						<a-input v-model:value="formValidate.date" />
					</a-form-item>
					<a-form-item class="form-item" label="总房数" name="roomTotal">
						<a-input v-model:value="formValidate.companyType" />
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
							<a-radio :value="1">开业</a-radio>
							<a-radio :value="0">停业</a-radio>
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
					<a-button html-type="submit" class="button">保存</a-button>
					<a-button class="button">提交审核</a-button>
				</div>
			</div>
		</a-form>
	</div>
</template>

<script setup lang="ts">
import api from '@/api';
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

const route = useRouter();

const formValidate: Ref<Record<string, any>> = ref({});

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
	businessLicense: [{ validator: businessLicenseValidate, trigger: 'change', message: '请上传营业执照' }],
	usci: [{ required: true, trigger: 'blur', message: '请输入统一社会信用代码' }],
	personName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
	phoneNumber: [{ required: true, trigger: 'blur', message: '请输入联系人电话' }],
	companyStatus: [{ required: true, trigger: 'change', message: '请选择企业状态' }],
	hotelStar: [{ required: true, trigger: 'blur', message: '请输入酒店星级' }],
	isDiscount: [{ required: true, trigger: 'change', message: '请选择企业是否支持减免' }],
	discountRule: [{ required: true, trigger: 'blur', message: '请输入减免规则' }],
};

const fileState = reactive({
	businessLicense: [],
});

const previewVisible = ref<boolean>(false);
const previewImage = ref<string | undefined>('');

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
	route,
	(res) => {
		const id = route.currentRoute.value?.query?.id;
		if (id) {
			api.getHotelDetailInfo({}, id).then((res) => {
				console.info(`id${id}酒店信息:`, res);

				// //表单初始化赋值
				// formValidate.
			});
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
