<template>
	<a-carousel class="pic-wrapper" arrows>
		<div v-for="img in imgArr" :key="img">
			<img :src="img" alt="pic" />
		</div>
	</a-carousel>
</template>
<script lang="ts" setup>
// import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
// import { defineComponent } from 'vue';
// export default defineComponent({
// 	components: {
// 		LeftCircleOutlined,
// 		RightCircleOutlined,
// 	},
// });
const imgArr = [
	'https://img1.baidu.com/it/u=1316542432,3416023648&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
	'https://img1.baidu.com/it/u=630883413,288568907&fm=253&fmt=auto&app=138&f=GIF?w=300&h=300',
];
</script>
<style scoped lang="scss">
/* For demo */
.pic-wrapper {
	width: 500px;
	height: 500px;
	img {
		width: 300px;
		width: 100%;
		height: 200px;
		// width: 500px;
		border-radius: 25px;
		// height: 100%;
		object-fit: cover;
	}
}
.ant-carousel :deep(.slick-slide) {
	text-align: center;
	height: 300px;
	line-height: 160px;
	// background: #364d79;
	overflow: hidden;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
	width: 25px;
	height: 25px;
	font-size: 25px;
	color: #fff;
	background-color: rgba(31, 45, 61, 0.11);
	opacity: 0.3;
	z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
	display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
	opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
	color: #fff;
}
</style>
