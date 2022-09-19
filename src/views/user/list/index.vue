<template>
	<div class="user_list con">
		<Button type="primary">12</Button>
		<!-- <x-table :req="userList" :filterDict="searchDict">
			<template v-slot:myTable="table">
				<a-table
					:data-source="table.data"
					:pagination="false"
					:columns="coloumns"
					:scroll="{
						x: `1200px`,
						y: `calc(${table.tableH}px - 100px)`,
					}"
				>
				</a-table>
			</template>
		</x-table> -->
	</div>
</template>
<script setup lang="ts">
import api from '@/api';
import { coloumns, searchDict } from './dict';
import { Button } from 'ant-design-vue'
console.log(coloumns);
// getInfo({page: 1}).then(res => {
// 	console.log(res)
// })
api.getOrder({pageIndex: 1, pageSize: 10}).then(res => {
	console.log(res)
}).catch(err => {
	console.log(err)
})
</script>
<style lang="less" scoped>
.box {
	color: #60d659;
}
</style>
