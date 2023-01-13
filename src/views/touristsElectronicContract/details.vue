<template>
  <div class="content_box">
    <div class="btn_box">
      <div class="tag">
        基本信息
      </div>
      <span class="close_btn" @click="back">
        <close-outlined />
      </span>
    </div>
    <div class="content disflex">
      <div class="flex1">
        <div class="content_item">
          <div class="key_name">系统编号</div>
          <div class="key_val">{{ form.contractNo }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">出发地</div>
          <div class="key_val">{{ form.departurePlace }}</div>
        </div>

        <div class="content_item">
          <div class="key_name">委托旅行社</div>
          <div class="key_val" :class="{ gray_text: form.entrustTravelName === '未填写' }">{{ form.entrustTravelName }}
          </div>
        </div>
        <div class="content_item">
          <div class="key_name">行程日期</div>
          <div class="key_val">{{ form.travelDate }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">游客人数</div>
          <div class="key_val"><span class="count">{{ form.touristPeopleNumber }}</span>人</div>
        </div>
        <div class="content_item">
          <div class="key_name">合同类型</div>
          <div class="key_val">{{ form.contractTypeName }} <span @click="(modalVisible = true)" class="append"
              v-show="(form.contractType === 1)">查看已上传附件
            </span>
          </div>
        </div>
        <div class="content_item">
          <div class="key_name">合同状态</div>
          <div class="key_val">{{ form.contractStatusName }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">紧急联系人</div>
          <div class="key_val">{{ form.emergencyContact }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">紧急联系方式</div>
          <div class="key_val">{{ form.emergencyContactPhone }}</div>
        </div>
      </div>
      <div class="flex1">
        <!-- 当合同状态为 已登记、已签署、已成团、已出团、旅行社解除、已解除 6个状态时，在【合同编号】字段处显示“下载12301合同电子版”按钮 -->
        <div class="content_item"
          v-show="((form.contractType === 2) && [2, 3, 4, 5, 6, 7].includes(form.contractStatus))">
          <div class="key_name">合同编号</div>
          <div class="key_val">{{ form.electronicContractNo }}<a target="_blank" :href="form.signingUrl" class="append"
              v-show="form.signingUrl">下载12301合同电子版
            </a></div>
        </div>
        <div class="content_item">
          <div class="key_name">目的地</div>
          <div class="key_val">{{ form.destination }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">返回地</div>
          <div class="key_val">{{ form.returnPlace }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">合同天数</div>
          <div class="key_val">{{ form.travelDayNight }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">合同创建方</div>
          <div class="key_val">{{ form.contractEstablish }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">合同创建人</div>
          <div class="key_val">{{ form.creatorName }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">合同总金额</div>
          <div class="key_val"><span class="count">{{ form.contractAmount }}</span>元</div>
        </div>
        <div class="content_item">
          <div class="key_name">合同录入时间</div>
          <div class="key_val">{{ form.createTime }}</div>
        </div>
        <div class="content_item">
          <div class="key_name">关联行程单号</div>
          <div class="key_val" :class="{ gray_text: form.itineraryNo === '尚未成团' }">{{ form.itineraryNo }}</div>
        </div>
      </div>
    </div>
    <div class="tag">
      已选择线路（<span class="count">{{ form.individualContractLineBos.length }}</span>）
    </div>
    <div class="content">
      <CommonTable :dataSource="form.individualContractLineBos" :columns="lineColumns">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
        </template>
      </CommonTable>
    </div>
    <div class="tag">
      签约游客（<span class="count">{{ form.individualContractTouristBos.length }}</span>）
    </div>
    <div class="content">
      <CommonTable :dataSource="form.individualContractTouristBos" :columns="touristColumns">
        <template #bodyCell="{ column, record, text, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
          <!-- <template v-if="column.key === 'healthyCode'">
            <span :class="cmpHealthyColor(text)">{{ text }}</span>
          </template> -->
        </template>
      </CommonTable>
    </div>
    <div class="content" v-show="(form.contractType === 2)">
      <div class="content_item">
        <div class="key_name">游客代表</div>
        <div class="key_val">{{ form.touristName }}</div>
      </div>
      <div class="content_item">
        <div class="key_name">游客代表证件</div>
        <div class="key_val">{{ form.certificatesNo }}</div>
      </div>
      <div class="content_item">
        <div class="key_name">游客代表手机号</div>
        <div class="key_val">{{ form.phone }}</div>
      </div>
      <div class="content_item">
        <div class="key_name">游客代表地址</div>
        <div class="key_val">{{ form.certificatesAddress }}</div>
      </div>
    </div>
    <div class="btn_box">
      <div class="tag">
        行程费用明细
      </div>
      <div>
        游客合同费用支付方式：{{ form.paymentMethodName }}
      </div>
    </div>

    <div class="content">
      <CommonTable :dataSource="form.individualContractPriceBos" :columns="costColumns">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
        </template>
      </CommonTable>
    </div>
    <div class="tag">
      其他约定
    </div>
    <div class="content">
      <p style="overflow-wrap: anywhere;">
        {{ form.otherAgreements }}
      </p>
    </div>
  </div>
  <CommonModal title="散客合同签署确认" v-model:visible="modalVisible" @close="(modalVisible = false)"
    @cancel="(modalVisible = false)" @conform="(modalVisible = false)" :conform-text="'关闭'" :is-cancel="false">
    <p>已上传{{ imageCount }}张图片，{{ pdfCount }}个pdf：</p>
    <div v-for="(item, index) in form.contractFileUrlList" :key="index" class="file">
      <a :href="item" class="file_box" v-if="item.indexOf('.pdf') !== -1">合同附件.pdf</a>
      <a-image width="104px" :src="item" v-else />
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import { useRouter, useRoute } from 'vue-router';
import { awsGetPreSignedUrl } from '@/utils/awsUpload';
import { accDiv, accMul } from '@/utils/compute';
const accDivValue = (value: any) => {
  if (typeof value === 'number') {
    return accDiv(value, 100)
  } else {
    return undefined
  }
}
const router = useRouter();
const route = useRoute();
const back = () => {
  router.push({
    name: 'electronicContratList',
  })
}
const modalVisible = ref(false)
const imageCount = ref(0)
const pdfCount = ref(0)
const form = ref({
  contractNo: '',
  travelDayNight: '',
  entrustTravelName: '未填写',
  travelDate: '',
  touristPeopleNumber: '',
  insuranceBuyModeName: '',
  contractTypeName: '',
  contractType: undefined,
  contractFileUrlList: '',
  contractFileUrl: '',
  contractStatusName: '',
  itineraryNo: '尚未成团',
  contractEstablish: '',
  creatorName: '',
  contractAmount: '',
  createTime: '',
  takeEffectTime: '',
  otherAgreements: '',
  individualContractLineBos: [],
  individualContractTouristBos: [],
  individualContractPriceBos: [],
  touristName: '',
  certificatesNo: '',
  phone: '',
  certificatesAddress: '',
  departurePlace: '',
  destination: '',
  returnPlace: '',
  paymentMethodName: '',
  emergencyContact: '',
  emergencyContactPhone: '',
  electronicContractNo: '',
  signingUrl: '',
  contractStatus: -1,
})
const lineColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '线路名称',
    dataIndex: 'lineId',
    key: 'lineId',
  },
  {
    title: '开始时间',
    dataIndex: 'lineStartTime',
    key: 'lineStartTime',
  },
  {
    title: '结束时间',
    dataIndex: 'lineEndTime',
    key: 'lineEndTime',
  },
  {
    title: '成人价格(元）',
    dataIndex: 'adultPrice',
    key: 'adultPrice',
  },
  {
    title: '小孩价格（元）',
    dataIndex: 'childPrice',
    key: 'childPrice',
  },
  {
    title: '行程描述',
    dataIndex: 'lineDescribe',
    key: 'lineDescribe',
  },
]
const touristColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '游客姓名',
    dataIndex: 'touristName',
    key: 'touristName',
  },
  {
    title: '身份证件类型',
    dataIndex: 'certificatesType',
    key: 'certificatesType',
  },
  {
    title: '身份证件号码',
    dataIndex: 'certificatesNo',
    key: 'certificatesNo',
  },
  {
    title: '游客类型',
    dataIndex: 'touristType',
    key: 'touristType',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '是否健康',
    dataIndex: 'isHealthy',
    key: 'isHealthy',
  },
  /* {
    title: '健康码',
    dataIndex: 'healthyCode',
    key: 'healthyCode',
  }, */
  {
    title: '古维费购买状态',
    dataIndex: 'isAncientUygur',
    key: 'isAncientUygur',
  },
]
const costColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '费用名称',
    dataIndex: 'priceName',
    key: 'priceName',
  },
  {
    title: '成人数量（人）',
    dataIndex: 'adultNumber',
    key: 'adultNumber',
  },
  {
    title: '成人价（元）',
    dataIndex: 'adultPrice',
    key: 'adultPrice',
  },
  {
    title: '儿童数量（人）',
    dataIndex: 'childNumber',
    key: 'childNumber',
  },
  {
    title: '儿童价（元）',
    dataIndex: 'childPrice',
    key: 'childPrice',
  },
  {
    title: '单项小计（元）',
    dataIndex: 'individualSubtotal',
    key: 'individualSubtotal',
  },
]
/* const cmpHealthyColor = computed(() => (text: string) => {
  if (text === '绿码') {
    return 'green_text'
  } else if (text === '黄码') {
    return 'yellow_text'
  } else if (text === '红码') {
    return 'red_text'
  }
})
// 批量获取健康码
const getHealthyCodes = async (ids: number[]) => {
  let res = await api.getHealthyCode(ids)
  if (res) {
    res.forEach((item: any) => {
      // 00:绿码，01：黄码，10：红码
      switch (item.healthCodeStatus) {
        case '00':
          item.codeName = '绿码'
          break;
        case '01':
          item.codeName = '黄码'
          break;
        case '10':
          item.codeName = '红码'
          break;
        default:
          item.codeName = '暂无健康码'
      }
    })
  }
  return res || []
} */
const setList = (list: any) => {
  list.forEach((item: any) => {
    item.adultPrice = accDivValue(item.adultPrice)
    item.childPrice = accDivValue(item.childPrice)
    item.individualSubtotal = accDivValue(item.individualSubtotal)
    const keys = Object.keys(item)
    for (let i = 0; i < keys.length; i++) {
      const element = keys[i];
      item[element] = [undefined, null, ''].includes(item[element]) ? '/' : item[element]
    }
  })
}
const setList1 = (list: any) => {
  list.forEach((item: any) => {
    const keys = Object.keys(item)
    for (let i = 0; i < keys.length; i++) {
      const element = keys[i];
      if (element === 'touristType') {
        item[element] = [undefined, null, ''].includes(item[element]) ? '/' : item[element] === 1 ? '成人' : '儿童'
      } else if (element === 'isHealthy') {
        item[element] = [undefined, null, ''].includes(item[element]) ? '/' : item[element] === 1 ? '是' : '否'
      } else if (element === 'isAncientUygur') {
        item[element] = [undefined, null, ''].includes(item[element]) ? '/' : item[element] === 1 ? '已购' : '未购'
      } else if (element === 'certificatesType') {
        switch (item[element]) {
          case 'IDENTITY_CARD':
            item[element] = '身份证'
            break
          case 'PASSPORT':
            item[element] = '护照'
            break
          case 'COMPATRIOT_CARD':
            item[element] = '港澳台同胞证'
            break
          default:
            item[element] = '/'
        }
      } else {
        item[element] = [undefined, null, ''].includes(item[element]) ? '/' : item[element]
      }
    }
  })
}
/* const configCodeName = (certificateCodes: any, targetArr: any) => {
  for (let i = 0, l = certificateCodes.length; i < l; i++) {
    const item = certificateCodes[i];
    for (let j = 0, l = targetArr.length; j < l; j++) {
      const citem = targetArr[j];
      if (item.certificateId === citem.certificatesNo) {
        targetArr[j].healthyCode = item.codeName
      }
    }
  }
} */
const getDetails = async (id: number) => {
  const res = await api.findIndividualContractById(id)
  if (res) {
    let {
      contractNo,
      contractDays,
      travelNight,
      entrustTravelName,
      tripStartTime,
      tripEndTime,
      touristPeopleNumber,
      insuranceBuyMode,
      contractType,
      contractFileUrl,
      contractStatusName,
      itineraryNo,
      contractEstablish,
      creatorName,
      contractAmount,
      createTime,
      takeEffectTime,
      individualContractLineBos,
      individualContractTouristBos,
      individualContractPriceBos,
      otherAgreements,
      departurePlace,
      destination,
      returnPlace,
      paymentMethodName,
      emergencyContact,
      emergencyContactPhone,
      electronicContractNo,
      signingUrl,
      contractStatus
    } = res
    const arr = contractFileUrl ? contractFileUrl.split(',') : []
    let contractFileUrlList = arr.map(async (item: any) => {
      if (['jpg', 'png'].indexOf(item.split('.')[1]) !== -1) {
        imageCount.value += 1
      } else if (['pdf'].indexOf(item.split('.')[1]) !== -1) {
        pdfCount.value += 1
      }
      item = await awsGetPreSignedUrl(item);
      return item
    })
    contractFileUrlList = await Promise.all(contractFileUrlList);
    const insuranceBuyModeName = (function () {
      let res
      switch (insuranceBuyMode) {
        case 1:
          res = '放弃购买'
          break
        case 2:
          res = '自行购买'
          break
        case 3:
          res = '委托旅行社购买'
          break
        default:
          res = ''
          break
      }
      return res
    })()
    const contractTypeName = (function () {
      let res
      switch (contractType) {
        case 1:
          res = '线上合同'
          break
        case 2:
          res = '线下合同'
          break
        default:
          res = ''
          break
      }
      return res
    })()
    /* // 获取身份证列表
    const certificateIds = individualContractTouristBos.map((item: any) => {
      return { certificateId: item.certificatesNo }
    })
    // 根据身份证列表查询健康码列表
    const certificateCodes = await getHealthyCodes(certificateIds)
    // 将健康码和游客列表数据关联
    configCodeName(certificateCodes, individualContractTouristBos) */

    setList(individualContractLineBos)
    setList(individualContractPriceBos)
    setList1(individualContractTouristBos)
    const travelDayNight = `${contractDays}天${travelNight}夜`
    const travelDate = `${tripStartTime}至${tripEndTime}`
    let touristName, certificatesNo, phone, certificatesAddress
    for (let i = 0, l = individualContractTouristBos.length; i < l; i++) {
      const item = individualContractTouristBos[i];
      if (item.isRepresentative === 1) {
        touristName = item.touristName
        certificatesNo = item.certificatesNo
        phone = item.phone
        certificatesAddress = item.certificatesAddress
        break
      }
    }
    form.value = {
      contractNo: contractNo || '/',
      travelDayNight,
      entrustTravelName: entrustTravelName || '未填写',
      travelDate,
      touristPeopleNumber,
      insuranceBuyModeName,
      contractTypeName,
      contractType,
      contractFileUrlList,
      contractFileUrl,
      contractStatusName: contractStatusName || '/',
      itineraryNo: itineraryNo || '尚未成团',
      contractEstablish: contractEstablish || '/',
      creatorName: creatorName || '/',
      contractAmount: accDivValue(contractAmount) || '/',
      createTime,
      takeEffectTime: takeEffectTime || '/',
      otherAgreements: otherAgreements || '/',
      individualContractLineBos,
      individualContractTouristBos,
      individualContractPriceBos,
      touristName,
      certificatesNo,
      phone,
      certificatesAddress,
      departurePlace,
      destination,
      returnPlace,
      paymentMethodName,
      emergencyContact,
      emergencyContactPhone,
      electronicContractNo: electronicContractNo || '/',
      signingUrl,
      contractStatus
    }
  }
}
watch(
  route,
  (newVal) => {
    if (newVal.name === "electronicContratDetails") {
      getDetails(newVal.query.id)
    }
  },
  { immediate: true })
</script>

<style scoped lang="scss">
.table-area {
  padding: unset;
}

.content_box {
  padding: 20px;

  .btn_box {
    display: flex;
    justify-content: space-between;

    .close_btn {
      cursor: pointer;
    }
  }
}

.tag {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
}

.count {
  color: #d70024;
}

.content {
  margin: 0 0 20px 40px;
}

.content_item {
  display: flex;
  margin-bottom: 10px;

  .key_name {
    width: 130px;
  }

  .key_val {}
}

.gray_text {
  color: #d7d7d7;
}

.green_text {
  color: #71b621;
}

.yellow_text {
  color: #bfbe26;
}

.red_text {
  color: #d70095;
}

.append {
  margin-left: 40px;
  cursor: pointer;
  color: #209cd3;
}

.file_box {
  display: inline-block;
  width: 104px;
  height: 104px;
  line-height: 88px;
  margin: 0 8px 8px 0;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

.file {
  display: inline-block;
}

.disflex {
  display: flex;
  justify-content: space-around;

  .flex1 {
    flex: 1;
  }
}
</style>