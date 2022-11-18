<template>
  <div class="content_box">
    <div class="check_box">
      <div class="title">
        <span>
          企业信息
        </span>
        <span class="close_btn" @click="back">
          <close-outlined />
        </span>
      </div>
      <div class="table_box">
        <table class="change_table" cellpadding="16px" border="1">
          <tr class="row" v-for="(value, key) in detailsArrList" :key="key">
            <td class="key">{{ keyNameList[key] }}</td>

            <td class="value" v-if="['manageUrl', 'businessLicenseUrl', 'legalPersonUrl'].includes(key) && value">
              <a-image width="200px" :src="value" />
            </td>
            <td class="value" v-else-if="key === 'regionCode'">
              <address-selector v-if="value[0]" key="oldadd" style="width:30%" :value="value" disabled>
              </address-selector>
            </td>
            <td class="value" v-else>{{ getComputedVal(key, value) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import AddressSelector from '@/views/baseInfoManage/businessManagement/components/addressSelector.vue';
import { getKeylist, flat } from '@/views/baseInfoManage/businessManagement/super/common'
import api from '@/api';
import { string } from 'vue-types';
const router = useRouter();
const route = useRoute();
type queryParamsType = {
  oid?: string,
  businessType?: string,
  fromPath?: string
}
const props = defineProps<queryParamsType>()
const detailsArrList = ref<any>({})
const keyNameList = ref()

const queryParams = reactive<queryParamsType>({})
const getComputedVal = computed(() => (key: string, val: any) => {
  if (key === 'accountType') {
    return val == 1 ? '对公账户' : '对私账户'
  } else if (key === 'unitStatus') {
    return val === 1 || val === false ? '停业' : '开业'
  } else if (key === 'derate') {
    return val === 1 || val === true ? '是' : '否'
  } else if (key === 'businessType') {
    let name = ''
    switch (val) {
      case 'HOTEL':
        name = '酒店'
        break;
      case 'CATERING':
        name = '餐饮'
        break;
      case 'TICKET':
        name = '景区'
        break;
      case 'TRAVEL':
        name = '旅行社'
        break;
      case 'SUPERVISE':
        name = '监理'
        break;
      case 'ASSOCIATION':
        name = '协会'
        break;
      case 'GROUP':
        name = '集团'
        break;
      case 'CULTURE_BUREAU':
        name = '文旅局'
        break;
      case 'ANCIENT_UYGUR':
        name = '古维管理部门'
        break;
      case 'YKT':
        name = '一卡通'
        break;
    }
    return name
  } else if (key === 'scenicLevel') {
    return val ? val + 'A' : ''
  } else if (key === 'isIndividual') {
    return val == 1 ? '是' : '否'
  } else {
    return val
  }
})
const getData = async () => {
  detailsArrList.value = {}
  let res = await api.getBusinessDetails(queryParams)
  res = flat(res)
  if (Object.prototype.toString.call(res) !== '[object Object]') return
  keyNameList.value = getKeylist(res.businessType)
  let keyList = Object.keys(keyNameList.value)
  keyList.forEach((key: string) => {
    if (key === 'regionCode') {
      if (res.provinceId) {
        const region = [res.provinceId, res.cityId, res.areaId]
        detailsArrList.value['regionCode'] = region
      }
    } else if (key === 'reduceRules') {
      if (res.reduceRule && res.fullRule) {
        detailsArrList.value['reduceRules'] = `满${res.fullRule}减${res.reduceRule}`
      }
    } else {
      detailsArrList.value[key] = res[key]
    }
  })
}
const back = () => {
  router.push({
    name: queryParams.fromPath
  })
}
onActivated(() => {
  if (props.oid) {
    let key: keyof queryParamsType;
    for (key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        queryParams[key] = JSON.parse(decodeURIComponent(props[key] as string))
      }
    }
    getData()
  }
})
</script>

<style scoped lang="scss">
.content_box {
  position: relative;
  width: 100%;
  height: 100%;

  .check_box {
    width: 100%;
    padding: 24px 20px;

    .title {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-family: Microsoft YaHei UI;
      font-weight: bold;
      color: #1E2226;
      padding-bottom: 12px;
      border-bottom: 1px solid #F1F2F5;

      .close_btn {
        cursor: pointer;
      }
    }

    .table_box {
      .row {
        width: 100%;
        font-size: 14px;
        font-family: Microsoft YaHei UI;
        font-weight: 400;
        color: #1E2226;
        border: 1px solid #E9E9E9;
      }

      .change_table {
        width: 100%;

        .key {
          width: 150px;
          background: rgba(245, 247, 250, 0.39);
        }

        .value {
          min-width: 300px;
        }
      }
    }
  }
}
</style>