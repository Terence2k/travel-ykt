<template>
	<div class="warp">
		<div class="form_pad">
			<header>基本信息</header>
			<a-form :model="formData.data" ref="formref" :rules="rulesRef" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="所属门店" name="companyName">
					<a-input v-model:value="formData.data.companyName" />
				</a-form-item>
				<a-form-item label="餐饮名称" name="cateringName">
					<a-input placeholder="请输入餐饮名称" v-model:value="formData.data.cateringName" />
				</a-form-item>
				<a-form-item label="可预订数量" name="orderNum">
					<a-input placeholder="请输入可预订数量，单位：人" v-model:value="formData.data.orderNum" />
				</a-form-item>
				<a-form-item label="单价" name="price">
					<a-input placeholder="请输入单价，单位：元/人" v-model:value="formData.data.price" />
				</a-form-item>
				<a-form-item label="图片" name="imgUrl">
					<Pic v-model:value="formData.data.imgUrl"></Pic>
				</a-form-item>
				<a-form-item label="状态" name="status">
					<a-radio-group v-model:value="formData.data.status">
						<a-radio :value="true">启用</a-radio>
						<a-radio :value="false">禁用</a-radio>
					</a-radio-group>
				</a-form-item>
				<div class="title">其他信息</div>
				<a-form-item label="供餐时间" required>
					<a-time-picker v-model:value="formData.data.starttime" valueFormat="HH:mm" :placeholder="formData.data.provideStart" />
					<span class="span_width">至</span>
					<a-time-picker v-model:value="formData.data.endtime" valueFormat="HH:mm" :placeholder="formData.data.provideEnd" />
				</a-form-item>
				<a-form-item label="其他">
					<a-input placeholder="请输入" v-model:value="formData.data.cateringDesc" />
				</a-form-item>
			</a-form>
		</div>
		<div class="footer">
			<a-button type="primary" @click="onSubmit">保存</a-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { computed, reactive, toRaw, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import api from '@/api';
import Pic from '@/components/common/imageWrapper.vue';

const navigatorBar = useNavigatorBar();
const route = useRouter();

const formref = ref();

const rulesRef = {
	companyName: [{ required: true, message: '请填写所属门店' }],
	cateringName: [{ required: true, message: '请填写餐饮名称' }],
	orderNum: [{ required: true, message: '请填写可预订数量' }],
	price: [{ required: true, message: '请填写单价' }],
	imgUrl: [{ required: true, message: '请上传图片' }],
	status: [{ required: true, message: '请选择状态' }],
};

const formData = reactive({
	data: [],
});

const initPage = async (): Promise<void> => {
	api.getProductInfo(route.currentRoute.value?.query?.id).then((res: any) => {
		formData.data = res;
	});
};

const onSubmit = () => {
	formref.value
		.validate()
		.then((res) => {
			const Data = {
				oid: formData.data.oid, //oid
				shopId: formData.data.shopId, //oid
				companyName: formData.data.companyName,
				cateringName: formData.data.cateringName,
				orderNum: formData.data.orderNum,
				price: formData.data.price,
				imgUrl: formData.data.imgUrl,
				status: formData.data.status,
				provideStart: formData.data.provideStart,
				provideEnd: formData.data.provideEnd,
				cateringDesc: formData.data.cateringDesc,
			};
			if (formData.data.starttime) {
				Data.provideStart = formData.data.starttime;
			}
			if (formData.data.endtime) {
				Data.provideEnd = formData.data.endtime;
			}
			save(toRaw(Data));
		})
		.catch((err) => {
			console.log('error', err);
		});
};
const save = async (params: object) => {
	let res = await api.getProductEdit(params);
	if (res) {
		message.success('保存成功');
		route.push({ path: '/catering/product_Management/index' });
	}
};

onMounted(() => {
	navigatorBar.setNavigator(['产品管理', '编辑']);
	initPage();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less">
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
	.span_width {
		margin: 0 35px;
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
