<template>
	<div>
		<BaseModal title="选择可变更项目" v-model="dialogVisible" :width="500">
			<div class="model-div">
				<a-button type="primary" style="width: 120px" @click="changeMission">修改出团信息</a-button>
				<p>包括导游、交通信息、附件内容，散团前均可修改</p>
			</div>
			<div class="model-div">
				<a-button type="primary" style="width: 120px" @click="openModifyproduct()">修改预订产品</a-button>
				<p>包括行程时间、景区、酒店、餐饮等，未核销时可修改</p>
			</div>
			<div class="model-div">
				<a-button type="primary" style="width: 120px" @click="addTourist">添加游客</a-button>
				<p>如有新增游客，可发起一条新行程单的填报</p>
			</div>
			<div class="model-div">
				<a-button type="primary" style="width: 120px" @click="revoke">撤销并重提</a-button>
				<p>如需删除、修改游客，未核销时可撤销原行程单，重新填报</p>
			</div>
			<template v-slot:footer>
				<a-button @click="dialogVisible = false">取消</a-button>
			</template>
		</BaseModal>
	</div>
</template>
<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import api from '@/api';
import { message } from 'ant-design-vue';
const router = useRouter();
const modelValue = ref(false);
const dialogVisible = ref(false);
const formValidate: Ref<Record<string, any>> = ref({});
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	changeParams: Object,
});
const state = reactive({
    id:'',
    itineraryNo:'',
	data:[]
});
const addTourist = () => {
	router.push({
		path: '/travel/take_group/addTourist',
		query: {
			id: state.id,
			itineraryNo: state.itineraryNo,
		},
	});
};
const revoke = () => {
	router.push({
		path: '/travel/take_group/revoke',
		query: {
			id: state.id,
			itineraryNo: state.itineraryNo,
		},
	});
};
const changeMission = () => {
	router.push({
		path: '/travel/take_group/changetravel',
		query: {
			id: state.id,
			itineraryNo: state.itineraryNo,
		},
	});
};
const openModifyproduct = () => {
	router.push({
		path: '/travel/take_group/modify_o_product',
		query: {
			oid: state.id,
		},
	});
};
const init = async () => {
	formValidate.value={};
	console.log('changeParams', props.changeParams);
	formValidate.value = { ...props.changeParams };
	state.id=formValidate.value.id
	state.itineraryNo=formValidate.value.itineraryNo
};

watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>
<style lang="less" scoped>
.model-div {
	text-align: center;
	margin-bottom: 30px;
}
.model-div > p {
	color: rgb(225, 225, 225);
	margin-top: 10px;
}
</style>
