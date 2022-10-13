<template>
	<div class="warp">
		<div class="form_pad">
			<!-- 查看 -->
			<a-form v-if="route.currentRoute.value?.query?.id" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
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
			<a-form v-else labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="行程类型" name="a">
					<a-radio-group :options="travaType" />
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
					<a-input placeholder="请输入联系电话"  />
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
					<a-input placeholder="请输入联系电话"  />
				</a-form-item>
				<a-form-item label="模板名称" name="a">
					<a-input   />
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
import { computed, reactive, toRaw, UnwrapRef, watch } from 'vue';

const navigatorBar = useNavigatorBar();
const route = useRouter();

const formData = reactive({
	data: [],
});

// 新增
// 行程类型枚举
const travaType = [
	{ label: '标准团', value: '1' },
	{ label: '散客网点团', value: '2' },
	{ label: '休闲通道团', value: '3' },
];

// 查看

// 初始化
const initPage = async (): Promise<void> => {
	if (route.currentRoute.value?.query?.id) {
		api.getProductInfo(route.currentRoute.value?.query?.id).then((res: any) => {
			formData.data = res;
		});
	}
};

onMounted(() => {
	if (route.currentRoute.value?.query?.id) {
		navigatorBar.setNavigator(['行程模板管理', '查看']);
	} else {
		navigatorBar.setNavigator(['行程模板管理', '新增']);
	}
	initPage();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
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
