const sharedOnCell = (_, index) => {
  console.log('_:', _);
  console.log('index:', index);
  
};

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
        dataIndex: 'specialCertificateType',
        key: 'specialCertificateType',
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
        dataIndex: 'insuranceName',
        key: 'insuranceName',
      },
      {
        title: '团队游客人数',
        dataIndex: 'peopleCount',
        key: 'peopleCount',
      },
      {
        title: '应缴人数',
        dataIndex: 'insuranceType',
        key: 'insuranceType',
      },
      {
        title: '应缴总金额（元）',
        dataIndex: 'protectDays',
        key: 'protectDays',
      },
      {
        title: '是否发起过减免申请',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '减免申请是否通过',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '出票状态',
        dataIndex: 'totalFee',
        key: 'totalFee',
      },
      {
        title: '操作',
        dataIndex: 'buyChannel',
        key: 'buyChannel',
      },
    ],
    title: '古维管理费',
    descriptions: 
      `共<span style="color: red;">${0}</span>人`,
    dataSource: [],
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
        dataIndex: 'insuranceName',
        key: 'insuranceName',
      },
      {
        title: '结算归属',
        dataIndex: 'peopleCount',
        key: 'peopleCount',
      },
      {
        title: '收费模式',
        dataIndex: 'insuranceType',
        key: 'insuranceType',
      },
      {
        title: '是否按天收取',
        dataIndex: 'protectDays',
        key: 'protectDays',
      },
      {
        title: '单价（元）',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '人数',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '行程天数',
        dataIndex: 'totalFee',
        key: 'totalFee',
      },
      {
        title: '总金额（元）',
        dataIndex: 'totalFee',
        key: 'totalFee',
      },
      {
        title: '操作',
        dataIndex: 'buyChannel',
        key: 'buyChannel',
      },
    ],
    title: '综费产品',
    descriptions: 
      `费用总计<span style="color: red;">${0}</span>元，订单状态：`,
    dataSource: [],
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
        dataIndex: '',
        key: '',
      },
      {
        title: '房型',
        dataIndex: 'roomTypeName',
        key: 'roomTypeName',
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
    ],
    title: '酒店费用',
    descriptions: 
      `已预订<span style="color: red;">${props.hotelList?.length}</span>个酒店，
      房间数量：<span style="color: red;">${props.hotelList?.reduce((prev: any, curr: any) => prev + curr.roomCount, 0)}</span>;
      费用总计：<span style="color: red;">${props.hotelList?.reduce((prev: any, curr: any) => prev + curr.orderFee, 0)}</span>元`,
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
        dataIndex: '',
        key: '',
      },
      {
        title: '购票人数',
        dataIndex: 'peopleCount',
        key: 'peopleCount',
      },
      {
        title: '费用（元）',
        dataIndex: 'totalFee',
        key: 'totalFee',
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
      `已预订<span style="color: red;">${props.ticketList?.length}</span>个景区，
      游玩人数：<span style="color: red;">${props.ticketList?.reduce((prev: any, curr: any) => prev + curr.peopleCount, 0)}</span>；
      费用总计：<span style="color: red;">${props.ticketList?.reduce((prev: any, curr: any) => prev + curr.totalFee, 0) || 0}</span>元`,
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