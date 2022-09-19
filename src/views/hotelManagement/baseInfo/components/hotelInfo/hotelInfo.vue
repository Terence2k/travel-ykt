<template>
	<div class="wrapper-tab-hotelInfo">
		<a-form :model="formValidate" :rules="rules" :label-col="{ span: 3 }" :wrapper-col="{ span: 8, offset: 1 }" labelAlign="left">
			<a-form-item label="酒店名称" name="hotelName">
				<a-input v-model:value="formValidate.hotelName" />
			</a-form-item>
			<a-form-item label="企业类型" name="companyType">
				<a-input v-model:value="formValidate.account" />
			</a-form-item>
			<a-form-item label="所属地区" name="area">
				<div class="flex-container">
					<a-select
						v-model:value="areaState.firstLevelArea"
						class="select-area"
						:options="areaState.firstLevelAreasGroup.map(({ id, name }) => ({ value: id, label: name }))"
					></a-select>
					<a-select
						v-model:value="areaState.secondLevelArea"
						class="select-area"
						:options="areaState.currentSecondLevelAreasGroup.map(({ id, name }) => ({ value: id, label: name }))"
					></a-select>
					<a-select
						v-model:value="areaState.thirdLevelArea"
						class="select-area"
						:options="areaState.currentThirdLevelAreasGroup.map(({ id, name }) => ({ value: id, label: name }))"
					></a-select>
					<a-input placeholder="请输入详细地址" v-model:value="formValidate.detailAddress" />
				</div>
			</a-form-item>
			<!-- <a-form-item label="营业执照">
				<a-form-item name="businessLicense" no-style>
					<a-upload-dragger v-model:fileList="formState.businessLicense" name="businessLicense" action="/upload.do">
						<p class="ant-upload-drag-icon"></p>
					
					</a-upload-dragger>
				</a-form-item>
			</a-form-item> -->
			<a-form-item label="统一社会信用代码" name="usci">
				<a-input v-model:value="formValidate.usci" />
			</a-form-item>
			<a-form-item label="企业状态" name="companyStatus">
				<a-radio-group v-model:value="formValidate.companyStatus">
					<a-radio :value="1">开业</a-radio>
					<a-radio :value="0">停业</a-radio>
				</a-radio-group>
			</a-form-item>
		</a-form>
	</div>
</template>

<script setup lang="ts">
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

const formValidate: Ref<Record<string, any>> = ref({});

const rules: any = {
	hotelName: [{ required: true, trigger: 'blur', message: '请输入酒店名称' }],
	companyType: [{ required: true, trigger: 'blur', message: '请输入企业类型' }],
	detailAddress: [{ required: true, trigger: 'blur', message: '请输入详细地址' }],
	businessLicense: [{ required: true, trigger: 'blur', message: '请上传营业执照' }],
	usci: [{ required: true, trigger: 'blur', message: '请输入统一社会信用代码' }],
	companyStatus: [{ required: true, trigger: 'change', message: '请选择企业状态' }],
};

const areaState = reactive({
	firstLevelAreasGroup,
	secondLevelAreasGroup,
	thirdLevelAreasGroup,
	firstLevelArea: firstLevelAreasGroup[0],
	secondLevelArea: '',
	thirdLevelArea: '',
	currentSecondLevelAreasGroup: [],
	currentThirdLevelAreasGroup: [],
});

const businessLicense = ref([]);

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
</script>

<style lang="less" scoped>
@import './styles/hotelInfo.less';
</style>
