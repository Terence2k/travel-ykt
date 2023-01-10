import { accDiv } from '@/utils/compute';

export const getOptions = (props: any) => {
  let guideOption = {
    columns: [
      {
        title: '编号',
        key: 'index',
      },
      {
        title: '导游姓名',
        dataIndex: 'guideName',
        key: 'guideName',
      },
      {
        title: '导游星级',
        dataIndex: 'guideLevelName',
        key: 'guideLevelName',
      },
      {
        title: '导游证编号',
        dataIndex: 'guideCertificateNo',
        key: 'guideCertificateNo',
      },
      {
        title: '性别',
        dataIndex: 'genderName',
        key: 'genderName',
      },
      {
        title: '导游电话',
        dataIndex: 'guidePhone',
        key: 'guidePhone',
      },
      {
        title: '已选带团时间',
        dataIndex: 'time',
        key: 'time',
      },
    ],
    title: '导游信息',
    descriptions: 
      `（共<span style="color: red;">${props.guideList?.length}</span>人）`,
    dataSource: props.guideList,
    pagination: false
  }
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
        dataIndex: 'certificateTypeName',
        key: 'certificateTypeName',
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
  let trafficOption = {
    columns: [
      {
        title: '编号',
        key: 'index',
      },
      {
        title: '交通类型',
        dataIndex: 'transportationType',
        key: 'transportationType',
      },
      {
        title: '车牌号',
        dataIndex: 'licencePlateNumber',
        key: 'licencePlateNumber',
      },
      {
        title: '车牌颜色',
        dataIndex: 'licencePlateColor',
        key: 'licencePlateColor',
      },
      {
        title: '车企名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '核载人数',
        dataIndex: 'approvedLoad',
        key: 'approvedLoad',
      },
      {
        title: '用车时段',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '驾驶员',
        dataIndex: 'driver',
        key: 'driver',
      },
    ],
    title: '交通信息',
    descriptions: 
      `（共<span style="color: red;">${props.transportList?.length}</span>条）`,
    dataSource: props.transportList,
    pagination: false
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
      }
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
      费用总计：<span style="color: red;">${accDiv(props.hotelList?.reduce((prev: any, curr: any) => prev + curr.orderFee, 0), 100)}</span>元`,
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
  let attachmentOption = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '附件名称',
        dataIndex: 'attachmentTypeName',
        key: 'attachmentTypeName',
        width: 500,
        align: 'center'
      },
      {
        title: '附件url',
        dataIndex: 'attachmentUrl',
        key: 'attachmentUrl',
      }
    ],
    title: '已上传的附件',
    dataSource: props.attachmentList,
  }
  return {
    guideOption,
    touristOption,
    trafficOption,
    guweiOption,
    productOption,
    hotelListOption,
    ticketListOption,
    attachmentOption
  }
}