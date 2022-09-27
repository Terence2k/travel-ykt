<template>
	<div class="warp">
		<div class="form_pad">
			<header>基本信息</header>
			<a-form name="basic" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="门店名称" >
					{{ formData.data.name }}
				</a-form-item>
				<a-form-item label="企业类型" >
					{{ formData.data.accountType }}
				</a-form-item>
				<a-form-item label="门店地址" :wrapperCol="{ span: 10 }" >
					{{ formData.data.addressDetail }}
				</a-form-item>
				<a-form-item label="统一社会信用代码" >
					{{ formData.data.creditCode }}
				</a-form-item>
				<a-form-item label="营业执照" > <img :src="formData.data.businessLicenseUrl" /> </a-form-item>
				<a-form-item label="联系人姓名" >
					{{ formData.data.contactName }}
				</a-form-item>
				<a-form-item label="联系人电话" >
					{{ formData.data.phone }}
				</a-form-item>
				<a-form-item label="企业状态" >
					{{ formData.data.onOff == 0 ? '关闭' : '开通' }}
				</a-form-item>
				<div class="title">结算（收款）账户信息</div>

				<a-form-item label="收款账号" >
					{{ formData.data.bankAccount }}
				</a-form-item>
				<a-form-item label="账户名" >
					{{ formData.data.bankAccountName }}
				</a-form-item>
				<a-form-item label="开户行地址" >
					{{ formData.data.accountAddress }}
				</a-form-item>
				<a-form-item label="收款行" >
					{{ formData.data.bank }}
				</a-form-item>
				<div class="title">补充说明</div>

				<a-form-item label="营业时间" > {{ formData.data.startTime }} 至 {{ formData.data.endTime }} </a-form-item>
				<a-form-item label="联系电话" >
					{{ formData.data.shopPhone }}
				</a-form-item>
				<a-form-item label="其他" >
					{{ formData.data.cateringDesc }}
				</a-form-item>
			</a-form>
		</div>
		<!-- <div class="footer">
			<a-button type="primary">保存</a-button>
			<a-button type="primary">提交审核</a-button>
		</div> -->
	</div>
</template>

<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { onMounted, reactive, toRaw, UnwrapRef, watch } from 'vue';
import api from '@/api';

const navigatorBar = useNavigatorBar();
const route = useRouter();

const formData = reactive({
	data: [],
});
// 表单

const initPage = async (): Promise<void> => {
	console.log(route.currentRoute.value?.query?.oid);
	api.getCateringInfo(route.currentRoute.value?.query?.oid).then((res: any) => {
		formData.data = res;
	});
};

onMounted(() => {
	initPage();
	navigatorBar.setNavigator(['基础信息管理', '查看']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less">
.warp {
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
	width: 100%;
	box-sizing: border-box;
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
