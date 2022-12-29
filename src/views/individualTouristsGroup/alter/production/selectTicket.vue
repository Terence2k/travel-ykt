<template>
    <div class="select-ticket">
        <CommonTable 
                :row-selection="{selectedRowKeys: state.selectedRowKeys,onChange: onSelectChange}" 
                :columns="state.columns" 
                :dataSource="state.dataSource" 
                :scrollY="false">
                <template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'action'">
						<a-input v-model:value="record.action" placeholder="请输入门票张数" />
					</template>
				</template>
        </CommonTable>
    </div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';

const state = reactive<any>({
    selectedRowKeys: [],
    columns: [
        {
            title: '演出票名称',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: '所在场馆',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: '所在分区',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: '单价',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: '输入张数',
            dataIndex: 'action',
            key: 'action',
        }
    ],
    dataSource: [{}]
})
const onSelectChange = (keys: any, rows: any) => {

}
</script>
<style lang="scss" scoped>

</style>