<template>
	<div class="warp">
		<!-- <header>基本信息</header> -->
		<div class="title">基本信息</div>
		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-form-item label="综费产品" name="menuName">
				<a-input v-model:value="formValidate.menuName" placeholder="请填写产品名称" />
			</a-form-item>
			<a-form-item label="是否必收费用" name="menuStatus">
				<a-radio-group v-model:value="formValidate.menuStatus">
					<a-radio :value="1">必收</a-radio>
					<a-radio :value="0">可选</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="费用说明" name="menuName">
					<a-input v-model:value="formValidate.menuName" placeholder="请填写规则说明" />
				</a-form-item>
			</a-form>
			<a-form-item label="状态" name="menuStatus">
				<a-radio-group v-model:value="formValidate.menuStatus">
					<a-radio :value="1">启用</a-radio>
					<a-radio :value="0">禁用</a-radio>
				</a-radio-group>
			</a-form-item>
			<div class="title">扣费规则</div>
			<a-form-item label="收费模式" name="menuStatus">
				<a-radio-group v-model:value="formValidate.menuStatus">
					<a-radio :value="1">人数</a-radio>
					<a-radio :value="0">价格</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="收款数量" name="menuDescribe">
				<a-input v-model:value="formValidate.menuDescribe" placeholder="请输入收款数量" />
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
const navigatorBar = useNavigatorBar();
const tstyle = { 'font-weight': '700' };
const formValidate: Ref<Record<string, any>> = ref({});
const route = useRouter();

// 保存
const onSubmit = async () => {
	console.log('保存');
	// validate()
	// 	.then((res) => {
	// 		console.log(toRaw(formData.data), 'psss');
	// 		save(toRaw(formData.data));
	// 	})
	// 	.catch((err) => {
	// 		console.log('error', err);
	// 	});
};
// 取消
const reset = async () => {
	route.push({ path: '/settlementManagement/comprehensiveFee' });
	// validate()
	// 	.then((res) => {
	// 		console.log(toRaw(formData.data), 'psss');
	// 		save(toRaw(formData.data));
	// 	})
	// 	.catch((err) => {
	// 		console.log('error', err);
	// 	});
};
//初始化页面
const initPage = async (): Promise<void> => {
	route.currentRoute.value?.query?.edit ? navigatorBar.setNavigator(['结算管理','综费产品', '编辑']) : navigatorBar.setNavigator(['结算管理','综费产品', '新增']);
};
onMounted(() => {
	initPage();
	// 自定义面包屑
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
		// margin-bottom: 16px;
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
.ant-form-item {
	font-size: 14px;
	font-family: Microsoft YaHei UI;
	font-weight: 400;
	color: #1e2226;
	margin-top: 13px;
	margin-bottom: 0;
	height: 32px;
}
::v-deep(.ant-form-item-control-input) {
	height: 18px;
}
::v-deep(.ant-form-item-label > label) {
	position: relative;
	display: inline-flex;
	align-items: center;
	max-width: 100%;
	height: 32px;
	font-size: 14px;
	font-family: Microsoft YaHei UI;
	font-weight: 400;
	color: #1e2226;
}
</style>
