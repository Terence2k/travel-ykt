<template>
    <div>
      
      <CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
  
          <template #bodyCell="{ column, text, index,record }">
              <!-- <template v-if="column.key === 'itineraryNo'">
              <div>
                  <a @click="goToDetail(record)">{{text}}</a>
              </div>
              </template> -->
              <template v-if="column.key === 'index'">
                  <div>
                      {{(travelStore.traveList.drafts.params.pageNo - 1) * (travelStore.traveList.drafts.params.pageSize) + (index + 1)}}
                  </div>
              </template>
  
  
              <template v-if="column.key === 'action'">
                  <div class="action-btns">
                      
                    <a v-permission="`${item.label}_查看详情`" @click="goToPath(record)">查看详情</a>
                    <a v-if="isShowStop && record.status != 9" v-permission="`${item.label}_暂停行程`" @click="suspendItinerary(record.oid)">暂停行程</a> 
                    <a v-if="isShowStop && record.status == 9" v-permission="`${item.label}_开启行程`" @click="startItinerary(record.oid)">开启行程</a> 
                    <!--  v-permission="`${item.label}暂停行程`" -->
                  </div>
              </template>
          </template>
          </CommonTable>
          <CommonPagination
              :current="params.pageNo"
              :page-size="params.pageSize"
              :total="state.total"
              @change="onHandleCurrentChange"
              @showSizeChange="pageSideChange"
          />
      </div>
  </template>
  <script lang="ts" setup>
    import CommonTable from '@/components/common/CommonTable.vue';
    import CommonPagination from '@/components/common/CommonPagination.vue';
    import { message } from 'ant-design-vue';
  
    import api from '@/api/index';

    import { useTravelStore } from '@/stores/modules/travelManagement';
    import { GroupMode, GroupStatus } from '@/enum'
    import { cloneDeep } from 'lodash-es';
    import { getUserInfo } from '@/utils';
    import { ROLE } from '@/constant';

    const travelStore = useTravelStore();
    const router = useRouter();
    const params = ref({
        pageNo: 1,
        pageSize: 10
    });
    const props = defineProps({
        activeKey: {
            type: [Number, String],
            default: 1
        },
        queryParams: {
            type: Object,
            default: {}
        },
        search: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            default: 1
        },
        item: {
            type: Object,
            default: {}
        }
    })
    const state = reactive({
        total:  0,
        tableData: [],
        columns: [
            {
                title: ' 序号 ',
                key: 'index',
                width: '80px'
            },
            {
                title: '行程单号',
                dataIndex: 'itineraryNo',
                key: 'itineraryNo',
                width: 200
            },
            {
                title: '线路名称',
                dataIndex: 'routeName',
                key: 'routeName',
            },
            {
                title: '地接社',
                dataIndex: 'subTravelName',
                key: 'subTravelName',
            },
            {
                title: '团队类型',
                dataIndex: 'teamTypeName',
                key: 'teamTypeName',
            },
            {
                title: '团客人数',
                dataIndex: 'touristCount',
                key: 'touristCount',
            },
            {
                title: '出散团日期',
                dataIndex: 'time',
                key: 'time',
            },
            {
                title: '操作',
                fixed: 'right',
                key: 'action',
                width: 180
            }
        ]
    })
    const onSearch = async (reset?: boolean) => {
        if (reset) {
            params.value.pageNo = 1
        }
        const queryParams: any = { ...props.queryParams, ...params.value };
        queryParams.status = props.activeKey
        const res = await api.travelManagement.getTravelCheck(queryParams);
        res.content = res.content.map((it: any) => {
            if (it.startDate) {
                it.time = it.startDate + '-' + it.endDate;
            }
            
            return it;
        });
        state.tableData = res.content;
        state.total = res.total;

    }

    const suspendItinerary = (oid: any) => {
        const formatData = new FormData();
        formatData.append('itineraryId', oid)
        api.travelManagement.suspendItinerary(formatData).then((res: any) => {
            onSearch()
            message.success('暂停成功')
        })
    }
    const startItinerary = (oid: any) => {
        const formatData = new FormData();
        formatData.append('itineraryId', oid)
        api.travelManagement.startItinerary(formatData).then((res: any) => {
            onSearch()
            message.success('开启成功')
        })
    }
    const onHandleCurrentChange = (e:any) => {
        params.value.pageNo = e
        onSearch()
    }
    const deleteTrave = (id: number) => {
        api.travelManagement.deleteTrave(id).then((res: any) => {
            onSearch()
            message.success('删除成功')
        })
    }
    const pageSideChange = () => {

    }
    const goToPath = (row: any) => {
        router.push({
            path: '/travel/travel_manage/travel_detail',
            query: {
                oid: row.oid
            }
        })
    }
    const userInfo = getUserInfo();
    const statusPermission = ['2', '3', '6', '7', '8', 2, 3, 6, 7, 8]
    const isShowStop = computed(() => (userInfo.sysCompany.businessType === ROLE.YKT) && statusPermission.includes(props.activeKey))

    onSearch()

    watch(() => props.search, newVal => {
    
        if (props.activeKey == props.index) {
            onSearch(true)
        }
    
    })
</script>