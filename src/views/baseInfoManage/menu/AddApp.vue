<template>
	<BaseModal :modelValue="dialogVisible" :title="state.title" width="606px" @cancel="cancel">
		<div class="form-wrap">
			<a-form ref="formRef" :rules="rules" :model="state.data" :label-col="{ span: 4 }" :wrapper-col="{ flex: 12 }" labelAlign="left">
				<a-form-item label="页面名称" name="menuName">
					<a-input v-model:value="state.data.menuName"></a-input>
				</a-form-item>
				<a-form-item label="页面路径" name="url">
					<a-input v-model:value="state.data.url"></a-input>
				</a-form-item>
				<div v-for="(item, index) in state.data.dateList" :key="index" class="time-item">
					<a-row>
						<a-col :span="24">
							<a-form-item
								label="权限名称"
								:name="['dateList', index, 'menuName']"
								:rules="[{ required: true, trigger: 'blur', message: '请输入权限名称' }]"
								@change="updateList(item)"
							>
								<a-input v-model:value="state.data.dateList[index].menuName"></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item
								label="权限编码"
								:name="['dateList', index, 'url']"
								:rules="[{ required: true, trigger: 'blur', message: '请输入权限编码' }]"
								@change="updateList(item)"
							>
								<a-input v-model:value="state.data.dateList[index].url"></a-input>
							</a-form-item>
						</a-col>
						<div class="btn-wrapper inner">
							<a-button type="primary" v-if="state.data.dateList.length > 1 && index + 1 === state.data.dateList.length" @click="addList"
								>添加</a-button
							>
							<a-button v-if="state.data.dateList.length > 1" @click="del(item, index)" class="del">删除</a-button>
						</div>
					</a-row>
				</div>

				<div class="btn-wrapper bottom-btn">
					<a-button type="primary" v-if="state.data.dateList.length === 1" @click="addList">添加</a-button>
				</div>
			</a-form>
		</div>
		<template v-slot:footer>
			<div class="footer-wrapper">
				<a-button type="primary" @click="submit">保存</a-button>
				<a-button @click="cancel">取消</a-button>
			</div>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
	menuList: Array,
});
const dialogVisible = ref(false);
const route = useRouter();
const state = reactive({
	data: {
		menuName: '',
		url: '',
		dateList: [{ menuName: '', url: '', menuId: '', parentId: '', deleted: '', sysAppChildMenuVos: [] }],
	},
	title: '',
	sysAppChildMenuVos: [] as any,
	addDate: [] as any,
	menuId: '',
	upList: [] as any,
});
const formRef = ref();
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);

const rules: any = {
	menuName: [{ required: true, trigger: 'blur', message: '请填写页面名称' }],
	url: [{ required: true, trigger: 'blur', message: '请填写页面路径' }],
};
const addList = () => {
	state.data.dateList.push({ sysAppChildMenuVos: [], index: 1 });
};

const del = (item: any, index: any) => {
	item.deleted = true;
	if (item.menuId) {
		state.sysAppChildMenuVos.push({ ...item });
	}
	state.data.dateList.splice(index, 1);
};
const updateList = (value: any) => {
	value.index = 1;
};
const updateApp = () => {
	let addDate = state.data.dateList.filter((i) => i.index == 1);
	let delDate = state.sysAppChildMenuVos.map((i) => {
		return {
			deleted: i.deleted,
			menuName: i.menuName,
			url: i.url,
			menuId: i.menuId,
			parentId: i.parentId,
		};
	});
	let newDate = addDate.map((i) => {
		if (i.menuId) {
			return {
				deleted: false,
				menuName: i.menuName,
				url: i.url,
				menuId: i.menuId,
				parentId: i.parentId,
			};
		} else {
			return {
				menuName: i.menuName,
				url: i.url,
				parentId: state.menuId,
			};
		}
	});
	const params = [].concat.call(delDate, newDate);
	let data = {
		menuId: props.params?.menuId,
		menuName: state.data.menuName,
		url: state.data.url,
		sysAppChildMenuVos: params,
	};
	api.updateAppMenuVo(data).then((i) => {
			message.success('编辑成功');
			emit('onSearch');
			cancel();
		})
		.error(() => {
			message.error('编辑失败');
		});
	console.log(params, '331');
};
const addApp = () => {
	let data = {
		menuName: state.data.menuName,
		url: state.data.url,
		sysAppChildMenuVos: state.data.dateList.map((i) => {
			return {
				menuName: i.menuName,
				url: i.url,
			};
		}),
	};
	api.addAppMenuVo(data).then((i) => {
			message.success('新增成功');
			emit('onSearch');
			cancel();
		})
		.error(() => {
			message.error('新增失败');
		});
	console.log(data, '12313');
};
const submit = () => {
	formRef.value
		.validateFields()
		.then((values: any) => {
			if (props.params?.menuId) {
				updateApp();
			} else {
				addApp();
			}
		})
		.catch((info: any) => {
			console.log('Validate Failed:', info);
		});
};
// 关闭弹窗
const cancel = () => {
	dialogVisible.value = false;
	state.data.menuName = '';
	state.data.url = '';
	state.data.dateList.map((i) => {
		return (i.menuName = ''), (i.url = '');
	});
	if (state.data.dateList.length > 1) {
		state.data.dateList.splice(0, state.data.dateList.length - 1);
	}
};
const detail = async (id: any) => {
	console.log('调用', '13313');
	await api.getAppMenuDetail(id).then((res: any) => {
		state.data.menuName = res.menuName;
		state.data.url = res.url;
		state.menuId = res.menuId;
		state.data.dateList = res.sysAppChildMenuVos.map((i: any) => {
			return {
				menuName: i.menuName,
				url: i.url,
				menuId: i.menuId,
				parentId: i.parentId,
				deleted: i.deleted,
			};
		});
	});
};
const init = async () => {
	console.log(props.params, '12321312');
	if (props.params?.menuId) {
		state.title = '编辑菜单';
	} else {
		state.title = '新增菜单';
	}
};
watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
			if (props.params?.menuId) {
				await detail(props.params?.menuId);
			}
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style scoped lang="less">
.form-wrap {
	max-height: 600px;
	overflow-y: auto;
}
.btn-wrapper {
	width: 100%;
	display: flex;
	justify-content: end;
}
.bottom-btn {
	margin-bottom: 20px;
	// margin-right: 24px;
}

.footer-wrapper {
	border-top: 1px solid #ddd;
	padding-top: 20px;
}
.time-item {
	display: block;
	margin-top: 10px;
	width: 100%;
	button {
		margin-left: 20px;
		display: flex;
		justify-content: end;
	}
}
</style>
