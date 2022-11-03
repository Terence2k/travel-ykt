<template>
	<a-carousel class="pic-wrapper" autoplay>
		<div>
			<img src="@/assets/images/login.png" alt="pic" />
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

</script>
<style scoped lang="scss">
/* For demo */
.pic-wrapper {
	width: 100%;
	// border: 1px solid red;
	img {
		width: 100%;
		height: 100%;
	}
}
// .ant-carousel :deep(.slick-slide) {
// 	text-align: center;
// 	height: 300px;
// 	line-height: 160px;
// 	// background: #364d79;
// 	overflow: hidden;
// }

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
