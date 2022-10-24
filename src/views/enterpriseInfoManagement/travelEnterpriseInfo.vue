<template>
  <div class="header">
    <div class="header_top">
      <div class="title">企业信息</div>
      <div class="register_data" v-if="baseInfo.createTime">
        注册时间：{{baseInfo.createTime}}
      </div>
    </div>
    <div class="header_bottom">
      <div class="list_item">
        <div class="list_item_top">
          <div class="list_item_name">所属集团</div>
          <div class="list_item_operate" @click="membership">{{ btnName }}</div>
        </div>
        <div class="list_item_bottom">{{ groupName }}</div>
      </div>
      <div class="split_line"></div>
      <div class="list_item">
        <div class="list_item_top">
          <div class="list_item_name">账户余额</div>
          <div class="list_item_operate">去充值</div>
        </div>
        <div class="list_item_bottom active">{{ baseInfo.accountBalance }}</div>
      </div>
      <div class="split_line"></div>
      <div class="list_item">
        <div class="list_item_top">
          <div class="list_item_name">已委派导游</div>
          <div class="list_item_operate">去管理</div>
        </div>
        <div class="list_item_bottom active">{{baseInfo.delegateGuide}}</div>
      </div>
    </div>
  </div>
  <div class="info_details">
    <!-- <div class="row">
      <div class="key">企业名称</div>
      <div class="value">丽江风情假日旅行社</div>
    </div> -->
    <table class="info_table" cellpadding="16px" border="1">
      <tr class="row">
        <td class="key">企业名称</td>
        <td class="value">{{ details.name }}</td>
      </tr>
      <tr class="row">
        <td class="key">企业地址</td>
        <td class="value">{{ details.addressDetail }}</td>
      </tr>
      <tr class="row">
        <td class="key">法定代表人</td>
        <td class="value">{{ details.legalPerson }}</td>
      </tr>
      <tr class="row">
        <td class="key">经营范围</td>
        <td class="value">{{ details.managementRange }}</td>
      </tr>
      <tr class="row">
        <td class="key">注册资本</td>
        <td class="value"><span v-if="details.registeredCapital">{{ details.registeredCapital }}万元</span></td>
      </tr>
      <tr class="row">
        <td class="key">成立日期</td>
        <td class="value">{{ details.establishTime }}</td>
      </tr>
      <tr class="row">
        <td class="key">营业期限</td>
        <td class="value">{{ details.businessTerm }}</td>
      </tr>
      <tr class="row">
        <td class="key">公司联系方式</td>
        <td class="value"><span v-if="details.contactName&&details.phone">{{ details.contactName +"&nbsp;&nbsp"+
        details.phone }}</span></td>
      </tr>
      <tr class="row">
        <td class="key">公司账户类型</td>
        <td class="value">
          <span v-if="details.accountType === 1">对公账户</span>
          <span v-else-if="details.accountType === 2">对私账户</span>
        </td>
      </tr>
      <tr class="row">
        <td class="key">公司账户名称</td>
        <td class="value">{{ details.bankAccountName }}</td>
      </tr>
      <tr class="row">
        <td class="key">开户行</td>
        <td class="value">{{ details.bank }}</td>
      </tr>
      <tr class="row">
        <td class="key">公司账号</td>
        <td class="value">{{ details.bankAccount }}</td>
      </tr>
      <tr class="row">
        <td class="key">营业执照</td>
        <td class="value">
          <a-image width="200px" :src="details.businessLicenseUrl" />
        </td>
      </tr>
      <tr class="row">
        <td class="key">经营许可证</td>
        <td class="value">
          <a-image width="200px" :src="details.manageUrl" />
        </td>
      </tr>
    </table>
    <!-- <div class="btn_box">
      <span class="btn" @click="goTo">信息有变更，立即更新</span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';
const router = useRouter();
const route = useRoute();
type detailsType = {
  name?: string,
  addressDetail?: string,
  legalPerson?: string,
  managementRange?: string,
  registeredCapital?: string,
  establishTime?: string,
  businessTerm?: string,
  contactName?: string,
  phone?: string,
  accountType?: number | string,
  bankAccountName?: string,
  accountAddress?: string,
  bankAccount?: string,
  businessLicenseUrl?: string,
  manageUrl?: string,
  oid?: string | number,
  bank?: string
}
type stateType = {
  baseInfo: {
    accountBalance?: string | number,
    delegateGuide?: string | number,
    createTime?: string,
    group?: string,
    groupState?: number
  }
  details: detailsType
}
const state = reactive<stateType>({
  baseInfo: {},
  details: {}
})
const { baseInfo, details } = toRefs(state)
const initOpeion = async () => {
  let { accountBalance, delegateGuide, createTime, group, companyBo, groupState } = await api.getTravelInformation()
  state.baseInfo.accountBalance = accountBalance
  state.baseInfo.delegateGuide = delegateGuide
  state.baseInfo.createTime = createTime
  state.baseInfo.group = group
  state.baseInfo.groupState = groupState
  state.details = companyBo
  state.details.manageUrl = "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
}
const goTo = () => {
  let newObj: any = {}
  let key: keyof detailsType
  for (key in state.details) {
    if (Object.prototype.hasOwnProperty.call(state.details, key)) {
      newObj[key] = encodeURIComponent(JSON.stringify(state.details[key]));
    }
  }
  router.push({
    name: 'modifyEnterpriseInfo',
    params: newObj
  })
}
type paramsType = {
  id: string | number,
  contactName: string,
  phone: string
}
const membership = () => {
  const params: paramsType = {
    id: state.details.oid as number,
    contactName: state.details.contactName as string,
    phone: state.details.phone as string
  }
  let key: keyof paramsType
  for (key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      params[key] = encodeURIComponent(JSON.stringify(params[key]));
    }
  }
  router.push({
    name: 'membershipManagement',
    params
  })
}
/* （1.入会待审核2.入会通过 3.入会拒绝 4 .退会待审核  5.退会拒绝  6.退会通过） */
const btnName = computed(() => {
  let val
  switch (state.baseInfo.groupState) {
    case 0:
    case 1:
    case 3:
    case 6:
      val = '申请入会'
      break;
    case 2:
    case 4:
    case 5:
      val = '查看详情'
      break;
    default:
      val = '申请入会'
      break
  }
  return val
})
const groupName = computed(() => {
  let val
  switch (state.baseInfo.groupState) {
    case 0:
    case 1:
    case 3:
    case 6:
      val = '暂无'
      break;
    case 2:
    case 4:
    case 5:
      val = state.baseInfo.group
      break;
    default:
      val = '暂无'
      break
  }
  return val
})
onMounted(() => {
  initOpeion()
})
</script>

<style scoped lang="scss">
.header {
  display: flex;
  flex-wrap: wrap;
  padding: 24px 20px;
  border-bottom: 12px #f1f2f5 solid;

  .header_top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid #F1F2F5;

    .title {
      font-size: 16px;
      font-family: Microsoft YaHei UI;
      font-weight: bold;
      color: #1E2226;
    }

    .register_data {
      font-size: 14px;
      font-family: Microsoft YaHei UI;
      font-weight: 400;
      color: #1E2226;
    }
  }

  .header_bottom {
    display: flex;
    margin-top: 24px;
    width: 100%;
    align-items: center;

    .split_line {
      width: 0px;
      height: 40px;
      margin: 0 8px;
      border: 1px solid #C8C9CC;
    }

    .list_item {
      box-sizing: border-box;
      height: 130px;
      width: 20%;
      min-width: 200px;
      padding: 20px 30px;

      .list_item_top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .list_item_name {
          font-size: 16px;
          font-family: Source Han Sans SC;
          font-weight: 500;
          color: #1E2226;
        }

        .list_item_operate {
          cursor: pointer;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #4197EF;
        }
      }

      .list_item_bottom {
        margin-top: 23px;
        font-size: 26px;
        font-family: Microsoft YaHei UI;
        font-weight: 400;
        color: #C8C9CC;
      }

      .active {
        font-size: 40px;
        font-family: DIN;
        font-weight: 400;
        color: #36B374;
      }
    }
  }
}

.info_details {
  padding: 20px;

  .info_table {

    .row {
      font-size: 14px;
      font-family: Microsoft YaHei UI;
      font-weight: 400;
      color: #1E2226;
      border: 1px solid #E9E9E9;

      .key {
        width: 150px;
        background: rgba(245, 247, 250, 0.39);
      }

      .value {
        width: 650px;
      }
    }
  }

  .btn_box {
    width: 100%;
    text-align: center;
    padding-top: 16px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #4197EF;

    .btn {
      cursor: pointer;
    }
  }
}
</style>