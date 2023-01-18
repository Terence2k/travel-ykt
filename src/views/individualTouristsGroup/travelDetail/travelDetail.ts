import { accDiv } from '@/utils/compute';
const sharedOnCell = (_, index) => {
  console.log('_:', _);
  console.log('index:', index);

};

export const getOptions = (props: any) => {
  let touristOption = {
    columns: [
      {
        title: '编号',
        key: 'index',
      },
      {
        title: '游客姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '证件类型',
        dataIndex: 'certificateType',
        key: 'certificateType',
      },
      {
        title: '证件号码',
        dataIndex: 'certificateNo',
        key: 'certificateNo',
      },
      {
        title: '性别',
        dataIndex: 'genderName',
        key: 'genderName',
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '客源地',
        dataIndex: 'sourceAddressName',
        key: 'sourceAddressName',
      },
      {
        title: '健康码',
        dataIndex: 'healthCodeName',
        key: 'healthCodeName',
      },
      {
        title: '中高风险',
        dataIndex: '',
        key: '',
      },
      {
        title: '特殊证件',
        dataIndex: 'specialCertificateTypeName',
        key: 'specialCertificateTypeName',
      },
    ],
    title: '游客信息',
    descriptions:
      `（共<span style="color: red;">${props.touristList?.total}</span>人）`,
    dataSource: props.touristList?.content,
    total: props.touristList?.total,
    pagination: true
  }
  let guweiOption = {
    columns: [
      {
        title: '费用名称',
        dataIndex: 'feeName',
        key: 'feeName',
      },
      {
        title: '团队游客人数',
        dataIndex: 'touristNum',
        key: 'touristNum',
      },
      {
        title: '应缴人数',
        dataIndex: 'payableNum',
        key: 'payableNum',
      },
      {
        title: '应缴总金额（元）',
        dataIndex: 'payablePrice',
        key: 'payablePrice',
      },
      {
        title: '是否发起过减免申请',
        dataIndex: 'isInitiateReductionName',
        key: 'isInitiateReductionName',
      },
      {
        title: '减免申请是否通过',
        dataIndex: 'isReductionPassedName',
        key: 'isReductionPassedName',
      },
      {
        title: '出票状态',
        dataIndex: 'issueStatusName',
        key: 'issueStatusName',
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 208
      },
    ],
    title: '古维管理费',
    descriptions:
    `共<span style="color: red;">${props.guWeiDetail?.reduce((prev: any, curr: any) => prev + curr.touristNum, 0) || 0}</span>人，
    古维待缴人数：<span style="color: red;">${props.guWeiDetail?.reduce((prev: any, curr: any) => prev + curr.payableNum, 0) || 0}</span>，
    应缴费用：<span style="color: red;">￥${accDiv(props.guWeiDetail?.reduce((prev: any, curr: any) => prev + curr.payablePrice, 0), 100) || 0}</span>`,
    dataSource: props.guWeiDetail,
  }
  let productOption = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '费用名称',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: '结算归属',
        dataIndex: 'belongCompanyTypeName',
        key: 'belongCompanyTypeName',
      },
      {
        title: '收费模式',
        dataIndex: 'feeModelName',
        key: 'feeModelName',
      },
      {
        title: '是否按天收取',
        dataIndex: 'isDaily',
        key: 'isDaily',
      },
      {
        title: '单价（元）',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },
      {
        title: '人数',
        dataIndex: 'peopleCount',
        key: 'peopleCount',
      },
      {
        title: '行程天数',
        dataIndex: 'dayCount',
        key: 'dayCount',
      },
      {
        title: '总金额（元）',
        dataIndex: 'totalFee',
        key: 'totalFee',
      },
    ],
    title: '综费产品',
    descriptions:
    `费用总计<span style="color: red;">${accDiv(props.productList?.reduce((prev: any, curr: any) => prev + curr.totalFee, 0), 100)}</span>元`,
    dataSource: props.productList,
  }
  let hotelListOption = {
    columns: [
      {
        title: '酒店名称',
        dataIndex: 'hotelName',
        key: 'hotelName',
      },
      {
        title: '可入住人数',
        dataIndex: 'limitPeopleCount',
        key: 'limitPeopleCount',
      },
      {
        title: '房型',
        dataIndex: 'roomDetail',
        key: 'roomDetail',
      },
      {
        title: '房间数量',
        dataIndex: 'roomCount',
        key: 'roomCount',
      },
      {
        title: '入住天数',
        dataIndex: 'stayDays',
        key: 'stayDays',
      },
      {
        title: '入住时间',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '离店时间',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '费用总计（元）',
        dataIndex: 'orderFee',
        key: 'orderFee',
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatusName',
        key: 'orderStatusName',
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 208
      }
    ],
    title: '酒店费用',
    descriptions:
      `已预订<span style="color: red;">${props.hotelList?.length}</span>个酒店，
      房间数量：<span style="color: red;">${props.hotelList?.reduce((prev: any, curr: any) => prev + curr.roomCount, 0)}</span>;
      费用总计：<span style="color: red;">${props.hotelList?.reduce((prev: any, curr: any) => prev + accDiv(curr.orderFee, 100), 0)}</span>元`,
    dataSource: props.hotelList,
  }
  let ticketListOption = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '景区名称',
        dataIndex: 'scenicName',
        key: 'scenicName',
      },
      {
        title: '游玩日期',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '门票名称',
        dataIndex: 'ticketName',
        key: 'ticketName',
      },
      {
        title: '单价（元）',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },
      {
        title: '团队游客人数',
        dataIndex: 'peopleCount',
        key: 'peopleCount',
      },
      {
        title: '购票人数',
        dataIndex: 'reservePeopleCount',
        key: 'reservePeopleCount',
      },
      {
        title: '费用（元）',
        dataIndex: 'orderFee',
        key: 'orderFee',
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatusName',
        key: 'orderStatusName',
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 208
      },
    ],
    title: '景区费用',
    descriptions:
    `已预订<span style="color: red;">${[...new Set(props.ticketList?.map((item: any) => item.oid))].length}</span>个景区，
    游玩人数：<span style="color: red;">${props.ticketList?.reduce((prev: any, curr: any) => Number(prev) + Number(curr.reservePeopleCount), 0)}</span>；
    费用总计：<span style="color: red;">${accDiv(props.ticketList?.reduce((prev: any, curr: any) => prev + curr.orderFee, 0), 100)}</span>元`,
    dataSource: props.ticketList,
  }
  const contractOption = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '合同编号',
        dataIndex: 'contractNo',
        key: 'contractNo',
      },
      {
        title: '合同类型',
        dataIndex: 'contractTypeName',
        key: 'contractTypeName',
      },
      {
        title: '内含线路/委托项目',
        dataIndex: 'lineNames',
        key: 'lineNames',
      },
      {
        title: '人数',
        dataIndex: 'touristPeopleNumber',
        key: 'touristPeopleNumber',
      },
      {
        title: '行程日期',
        dataIndex: 'tripDate',
        key: 'tripDate',
      },
      {
        title: '合同签约旅行社',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '签署网点',
        dataIndex: 'storeName',
        key: 'storeName',
      },
      {
        title: '合同费用（元）',
        dataIndex: 'contractAmount',
        key: 'contractAmount',
      },
      {
        title: '操作',
        dataIndex: '',
        key: '',
      },
    ],
    title: '已选择的合同',
    descriptions:
      `（${props.contractList?.length || 0}）`,
    dataSource: props.contractList,
  }
  return {
    touristOption,
    guweiOption,
    productOption,
    hotelListOption,
    ticketListOption,
    contractOption
  }
}