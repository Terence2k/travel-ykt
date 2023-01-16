<template>
	<div class="insurance-container">
		<p>已在他处购买保险，填写反馈购买情况即可（默认全员必购保险）：</p>
		<a-form-item label="保险购买方：" name="insuranceStatus">
			<a-select 
				style="width: 20%"
				v-model:value="travelStore.insuranceStatus" 
				placeholder="请选择保险购买方" >
				<a-select-option 
					:value="key" 
					:name="item"
					v-for="(item, key) in INSURANCE" 
					:key="key">
					{{item}}
				</a-select-option>
			</a-select>
		</a-form-item>
		<a-radio v-model:checked="travelStore.checkInsurance"> 我已阅读并同意<a>《云南省团队旅游保险购买政策》</a>、<a>《一卡通平台免责声明》</a></a-radio>
	</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { INSURANCE } from '@/constant';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { message } from 'ant-design-vue/es';
const travelStore = useTravelStore();
const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});

const checked = ref<boolean>(travelStore.insuranceStatus ? true : false);
const emits = defineEmits(['onSuccess', 'getTravelDetail']);
// watch(() => props.onCheck, newVal => {
// 	if (!checked.value) {
// 		return message.error('请同意《云南省团队旅游保险购买政策》、《一卡通平台免责声明》')
// 	}
// })
</script>
<style lang="less" scoped>
.insurance-container {
	padding: 0 20px;
}
</style>
