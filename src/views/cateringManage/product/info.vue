<template>
	<div class="warp">
		<div class="form_pad">
			<header>基本信息</header>
			<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="所属门店" name="name"> {{ formData.data.companyName }} </a-form-item>
				<a-form-item label="餐饮名称"> {{ formData.data.cateringName }} </a-form-item>
				<a-form-item label="可预订数量"> {{ formData.data.orderNum }} </a-form-item>
				<a-form-item label="单价"> {{ formData.data.price }} </a-form-item>
				<a-form-item label="图片">
					<img :width="200" :src="formData.data.imgUrl" />
				</a-form-item>
				<a-form-item label="状态">
					{{ formData.data.status == 1 ? '启用' :'禁用'  }}
				</a-form-item>
				<div class="title">其他信息</div>
				<a-form-item label="供餐时间">
					{{ formData.data.provideStart }} 至 {{ formData.data.provideEnd }}
				</a-form-item>
				<a-form-item label="其他"> {{ formData.data.cateringDesc }} </a-form-item>
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
import { computed, reactive, toRaw, UnwrapRef, watch } from 'vue';

const navigatorBar = useNavigatorBar();
const route = useRouter();

const formData = reactive({
	data: [],
});

const initPage = async (): Promise<void> => {
	api.getProductInfo(route.currentRoute.value?.query?.id).then((res: any) => {
		formData.data = res;
	});
};

onMounted(() => {
	navigatorBar.setNavigator(['产品管理', '查看']);
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
