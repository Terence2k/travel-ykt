<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns">
      <template #describe>
        共<span class="color-red">{{state.total}}</span>条行程单。其中待审核 <span class="color-red">{{auditInfoNum}}</span> 条。
      </template>
      <template #bodyCell="{ column, text, index, record }">
        <template v-if="column.key === 'index'">
          <div>
              {{(travelStore.auditList.administrativeSendGroup.params.pageNo - 1) * (travelStore.auditList.administrativeSendGroup.params.pageSize) + (index + 1)}}
          </div>
        </template>
        <template v-if="column.key === 'totalFee'">
          {{accDiv(record.totalFee,100) }}
        </template>
        <template v-if="column.key === 'action'">
          <div class="action-btns">
            <a @click="auditStatus(record)" v-if="record.auditInfo?.length" v-permission="'发团审核_去审核'">去审核</a>
          </div>
        </template>
      </template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.auditList.administrativeSendGroup.params.pageNo"
			:page-size="travelStore.auditList.administrativeSendGroup.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
  <BaseModal title="行程详情预览" v-model="changeAuditVisible" :width="1000">
		<div class="table_box">
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key">团队类型</td>
					<td class="value">{{ state.detail.teamTypeName }}</td>
				</tr>
				<tr class="row">
					<td class="key">行程单编号</td>
					<td class="value">{{ state.detail.itineraryNo }}</td>
				</tr>
				<tr class="row">
					<td class="key">线路名称</td>
					<td class="value">{{ state.detail.routeName }}</td>
				</tr>
				<tr class="row">
					<td class="key">组团社</td>
					<td class="value">{{ state.detail.travelName }}</td>
				</tr>
				<tr class="row">
					<td class="key">组团社计调</td>
					<td class="value">{{ state.detail.travelOperatorName }} {{ state.detail.travelOperatorPhone }}</td>
				</tr>
				<tr class="row">
					<td class="key">地接社</td>
					<td class="value">{{ state.detail.subTravelName }}</td>
				</tr>
				<tr class="row" v-if="state.detail.startDate && state.detail.endDate">
					<td class="key">出散团时间</td>
					<td class="value">{{ `${state.detail.startDate.split(' ')[0]} ~ ${state.detail.endDate.split(' ')[0]} (${state.detail.travelDays}天)`  }}</td>
				</tr>
				<tr class="row">
					<td class="key">团客人数</td>
					<td class="value">{{ state.detail.touristCount }}</td>
				</tr>
				<tr class="row">
					<td class="key">古维管理费</td>
					<td class="value">{{accDiv(state.detail.maintainFee,100) }}元</td>
				</tr>
				<tr class="row">
					<td class="key">综费产品</td>
					<td class="value">{{accDiv(state.detail.productFee,100) }}元</td>
				</tr>
				<tr class="row">
					<td class="key">酒店</td>
					<td class="value">{{accDiv(state.detail.hotelFee,100)  }}元</td>
				</tr>
				<tr class="row">
					<td class="key">景区</td>
					<td class="value">{{accDiv(state.detail.ticketFee,100)  }}元</td>
				</tr>
				<tr class="row">
					<td class="key">餐饮</td>
					<td class="value">{{accDiv(state.detail.cateringFee,100)}}元</td>
				</tr>
			</table>
		</div>
		<template v-slot:footer>
      <a-button @click="sendAudit(3)">驳回</a-button>
			<a-button type="primary" @click="sendAudit(2)">同意发团</a-button>
		</template>
  </BaseModal>
  <BaseModal title="驳回确认" v-model="rejectAuditVisible">
    驳回 {{state.detail.travelName}} 的行程发团申请，填写驳回理由：
    <a-textarea v-model:value="rejectReason" placeholder="请填写驳回理由" :rows="4" />
		<template v-slot:footer>
      <a-button @click="rejectAuditVisible = false">取消</a-button>
			<a-button type="primary" @click="rejectAudit">确定</a-button>
		</template>
  </BaseModal>
</template>
<script lang="ts" setup>
	import CommonTable from '@/components/common/CommonTable.vue';
	import CommonPagination from '@/components/common/CommonPagination.vue';
  import BaseModal from '@/components/common/BaseModal.vue';
  import { getUserInfo } from '@/utils/util';
  import { message } from 'ant-design-vue';
  import { Modal } from 'ant-design-vue';
  import { accDiv,accMul} from '@/utils/compute';

	import api from '@/api/index';

	import { useTravelStore } from '@/stores/modules/travelManagement';
	import { AuditStaus } from '@/enum'

	const travelStore = useTravelStore();
  const userInfo = getUserInfo();
	const state = reactive({
		total: computed(() => travelStore.auditList.administrativeSendGroup.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: computed(() => travelStore.auditList.administrativeSendGroup.list),
    detail: {} as any,
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
					title: '行程时间',
					dataIndex: 'time',
					key: 'time',
			},
			{
					title: '团队类型',
					dataIndex: 'teamTypeName',
					key: 'teamTypeName',
			},
			{
					title: '发团计调',
					dataIndex: 'travelOperatorName',
					key: 'travelOperatorName',
			},
			{
					title: '团客人数',
					dataIndex: 'touristCount',
					key: 'touristCount',
			},
			{
					title: '操作',
					fixed: 'right',
					key: 'action',
			}
		]
	})
  const changeAuditVisible = ref(false);
  const rejectAuditVisible = ref(false);
  const rejectReason = ref('');
  const auditInfoNum = ref(0);
	const onSearch = async () => {
    auditInfoNum.value = 0;
		travelStore.auditList.administrativeSendGroup.params.status = AuditStaus.AdministrativeSendGroup;
		const res = await travelStore.getAuditList(travelStore.auditList.administrativeSendGroup.params);
    let result = res.content.map( async (item: any) => {
      item.auditInfo = await getAuditButton(item.auditUuid);
      if (item.auditInfo) {
        auditInfoNum.value += 1;
      }
      return item;
    })
    res.content = await Promise.all(result);
    travelStore.setAuditList(res, 'administrativeSendGroup');
	}
  const cancel = () => {
    changeAuditVisible.value = false;
    rejectAuditVisible.value = false;
    onSearch();
  }
  const auditStatus = (row: any) => {
    console.log('row:', row);
    getDetail(row.oid, row);
    changeAuditVisible.value = true;
    
  }
  const getAuditButton = async (uuid: string) => {
			let res = await api.travelManagement.getAuditButton({uuid: uuid});
      console.log(res);
      return res;
    
  }
  const sendAudit = (status: any) => {
    console.log('state.detail:', state.detail);
    // 审核通过
    if (status == 2) {
      Modal.confirm({
        title: '发团审核提示',
        width: 560,
        closable: true,
        centered: true,
        icon: false,
        content: `您即将批准 ${state.detail.travelName} 的行程发团申请，请确认该行程单的内容是否合规？是否同意发团？`,
        onOk() {
          const queryData = {
            auditTypeCode: 7, //审核类code（详情参考CompanyAuditStatusEnum）
            auditRemark: rejectReason.value, //审核描述
            businessType: state.detail.auditInfo.auditBusinessType, //审核企业业态
            uuid: state.detail.auditInfo.uuid, //uuid
            roleId: state.detail.auditInfo.roleId || userInfo.sysRoles.oid, //角色id为查询是否拥有审核权限时返回的角色id，若返回的角色id为null，则不传
            auditStatus: 2 //审核类型
          };
          console.log('queryData:', queryData);
          api.travelManagement.auditInfo(queryData)
            .then((res: any) => {
              console.log('审核返回信息：', res);
              message.success('保存成功');
              cancel();
            })
            .catch((err: any) => {
              console.error(err);
            });
        },
        onCancel() {},
      });
    } else if (status == 3) { // 审核不通过
      rejectAuditVisible.value = true;
    }
  }
  const rejectAudit = () => {
    console.log('state.detail.auditInfo:', state.detail.auditInfo)
    const queryData = {
      auditTypeCode: 7, //审核类code（详情参考CompanyAuditStatusEnum）
      auditRemark: rejectReason.value, //审核描述
      businessType: state.detail.auditInfo.auditBusinessType, //审核企业业态
      uuid: state.detail.auditInfo.uuid, //uuid
      roleId: state.detail.auditInfo.roleId || userInfo.sysRoles.oid, //角色id为查询是否拥有审核权限时返回的角色id，若返回的角色id为null，则不传
      auditStatus: 3 //审核类型
    };
    console.log('queryData:', queryData);
    api.travelManagement.auditInfo(queryData)
      .then((res: any) => {
        console.log('审核返回信息：', res);
        message.success('保存成功');
        cancel();
      })
      .catch((err: any) => {
        console.error(err);
      });
  }
  const getDetail = (id: any, row: any) => {
    const backup = row;
    api.travelManagement.getAuditInfo(id)
    .then((res: any) => {
      state.detail = res;
      if (row.auditInfo?.length) state.detail.auditInfo = row.auditInfo[0];
    })
    .catch((err: any) => {
      console.error(err);
      state.detail = backup;
    });
  }
	const onHandleCurrentChange = (e: any) => {
		travelStore.auditList.administrativeSendGroup.params.pageNo = e
		onSearch()
	}
	const pageSideChange = () => {

	}
	onSearch()

  watch(changeAuditVisible, (nVal) => {
    if (!nVal) state.detail = {};
  });
</script>
<style scoped lang="less">
.table_box {
	max-height: 80vh;
	padding: 1px 0;
	overflow: auto;

	.row {
		width: 100%;
		font-size: 14px;
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		color: #1E2226;
		border: 1px solid #E9E9E9;
    td {
      text-align: center;
    }
	}

	.change_table {
		width: 100%;

		.key,
		.key_hd {
			width: 150px;
		}

		.key_hd {
			background: rgba(245, 247, 250, 0.39);
		}

		.value {
			min-width: 300px;
		}
	}

	.info_table {
		width: 100%;

		.key {
			width: 150px;
			background: rgba(245, 247, 250, 0.39);
		}
	}
}
</style>