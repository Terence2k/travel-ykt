import { accDiv } from '@/utils/compute';

export const getOptions = (props: any) => {
  let touristOption = {
    columns: [
      {
        title: '序号',
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
        title: '紧急联系人',
        dataIndex: 'emergencyContactName',
        key: 'emergencyContactName',
      },
      {
        title: '健康码',
        dataIndex: 'healthCodeName',
        key: 'healthCodeName',
      },
      {
        title: '古维费减免资格',
        dataIndex: 'isDerate',
        key: 'isDerate',
      },
    ],
    title: '游客信息',
    descriptions: 
      `共<span style="color: red;">${props.touristList?.total}</span>人，
      古维待缴人数：<span style="color: red;">${props.basic?.guWeiCount}</span>，
      待缴费用：<span style="color: red;">￥${props.basic?.totalFee || 0}</span>`,
    dataSource: props.touristList?.content,
    pagination: true
  }
  let insuranceOption = {
    columns: [
      {
        title: '保险方案名称',
        dataIndex: 'insuranceName',
        key: 'insuranceName',
      },
      {
        title: '人数',
        dataIndex: 'peopleCount',
        key: 'peopleCount',
      },
      {
        title: '险种',
        dataIndex: 'insuranceType',
        key: 'insuranceType',
      },
      {
        title: '保障天数',
        dataIndex: 'protectDays',
        key: 'protectDays',
      },
      {
        title: '保险生效时间',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '保险失效时间',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '预估保费（元）',
        dataIndex: 'totalFee',
        key: 'totalFee',
      },
      {
        title: '保险购买渠道',
        dataIndex: 'buyChannel',
        key: 'buyChannel',
      },
    ],
    title: '保险购买信息',
    descriptions: 
      `共<span style="color: red;">${props.touristInsurance?.length}</span>人，
      保险购买状态：${props.touristInsurance?.length? props.touristInsurance[0].isBuy : ''}，
      预估保费：<span style="color: red;">${accDiv(props.touristInsurance?.reduce((prev: any, curr: any) => prev + curr.totalFee, 0), 100)}</span>元`,
    dataSource: props.touristInsurance,
  }
  let hotelListOption = {
    columns: [
      {
        title: '酒店名称',
        dataIndex: 'hotelName',
        key: 'hotelName',
      },
      {
        title: '入住人数',
        dataIndex: 'peopleCount',
        key: 'peopleCount',
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
        title: '预估住宿费用（元）',
        dataIndex: 'totalFee',
        key: 'totalFee',
      },
      {
        title: '审核状态',
        dataIndex: 'statusName',
        key: 'statusName',
      },
    ],
    title: '已预订酒店',
    descriptions: 
      `已预订<span style="color: red;">${props.hotelList?.length}</span>个酒店，
      入住人数：<span style="color: red;">${props.hotelList?.reduce((prev: any, curr: any) => prev + curr.peopleCount, 0)}</span>人；
      房间数量：<span style="color: red;">${props.hotelList?.reduce((prev: any, curr: any) => prev + curr.roomCount, 0)}</span>;
      预估费用：<span style="color: red;">${accDiv(props.hotelList?.reduce((prev: any, curr: any) => prev + curr.totalFee, 0), 100)}</span>元`,
    dataSource: props.hotelList,
  }
  let ticketListOption = {
    columns: [
      {
        title: '景区门票',
        dataIndex: 'scenicName',
        key: 'scenicName',
      },
      {
        title: '门票类型',
        dataIndex: 'ticketTypeName',
        key: 'ticketTypeName',
      },
      {
        title: '门票数量',
        dataIndex: 'ticketCount',
        key: 'ticketCount',
      },
      {
        title: '单价（元）',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },
      {
        title: '总价（元）',
        dataIndex: 'totalFee',
        key: 'totalFee',
      },
      {
        title: '入园时间',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '离园时间',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '购买状态',
        dataIndex: 'buyStatusName',
        key: 'buyStatusName',
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 208
      },
    ],
    title: '已预订景区',
    descriptions: 
      `已预订<span style="color: red;">${props.ticketList?.length}</span>个景区，
      门票数量：<span style="color: red;">${props.ticketList?.reduce((prev: any, curr: any) => prev + curr.ticketCount, 0)}</span>；
      预估费用：<span style="color: red;">${accDiv(props.ticketList?.reduce((prev: any, curr: any) => prev + curr.totalFee, 0), 100)}</span>元`,
    dataSource: props.ticketList,
  }
  let cateringListOption = {
    columns: [
      {
        title: '就餐时间',
        dataIndex: 'cateringTime',
        key: 'cateringTime',
      },
      {
        title: '餐次',
        dataIndex: 'meals',
        key: 'meals',
      },
      {
        title: '餐厅名称',
        dataIndex: 'cateringName',
        key: 'cateringName',
      },
      {
        title: '就餐类型',
        dataIndex: 'cateringTypeName',
        key: 'cateringTypeName',
      },
      {
        title: '就餐描述',
        dataIndex: 'cateringDesc',
        key: 'cateringDesc',
      },
      {
        title: '人均单价（元）',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },
      {
        title: '就餐人数',
        dataIndex: 'peopleCount',
        key: 'peopleCount',
      },
      {
        title: '预估费用',
        dataIndex: 'totalFee',
        key: 'totalFee',
      },
      {
        title: '购买状态',
        dataIndex: 'buyStatusName',
        key: 'buyStatusName',
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 208
      },
    ],
    title: '已预订餐饮',
    descriptions: 
      `已预订<span style="color: red;">${props.cateringList?.length}</span>个餐厅，
      就餐人数：<span style="color: red;">${props.cateringList?.reduce((prev: any, curr: any) => prev + curr.peopleCount, 0)}</span>；
      预估费用：<span style="color: red;">${accDiv(props.cateringList?.reduce((prev: any, curr: any) => prev + curr.totalFee, 0), 100)}</span>元`,
    dataSource: props.cateringList,
  }
  return {
    touristOption,
    insuranceOption,
    hotelListOption,
    ticketListOption,
    cateringListOption
  }
}