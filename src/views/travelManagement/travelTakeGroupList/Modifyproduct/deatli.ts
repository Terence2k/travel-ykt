export const getOptions = (props: any) => {
    let hotelcolumns = reactive({
        columns: [
            {
                title: '酒店名称',
                dataIndex: 'hotelName',
                key: 'hotelName',
            },
            {
                title: '可入住人数',
                dataIndex: 'routeName',
                key: 'routeName',
            },
            {
                title: '房型',
                dataIndex: 'roomTypeList',
                key: 'roomTypeList',
            },
            {
                title: '房间数量',
                dataIndex: 'roomCount',
                key: 'roomCount',
            },
            {
                title: '入住天数',
                dataIndex: 'time',
                key: 'time',
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
                title: '费用总计(元)',
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
                fixed: 'right',
                key: 'action',
            },
        ],
        title: '酒店费用',
        descriptions: 
          `已预订<span style="color: red;">${props.hotelList?props.hotelList?.length:props.newHotelList?.length}</span>个酒店，
          最大可入住人数：<span style="color: red;">${props.hotelList ? props.hotelList?.reduce((prev: any, curr: any) => prev + curr.roomCount, 0):
            props.newHotelList?.reduce((prev: any, curr: any) => prev + curr.roomCount, 0)}</span>；
          房间数量：<span style="color: red;">${props.hotelList?props.hotelList.reduce((prev: any, curr: any) => prev + curr.roomCount, 0):
            props.newHotelList?.reduce((prev: any, curr: any) => prev + curr.roomCount, 0)}</span>；
          费用总计：<span style="color: red;">${props.hotelList?props.hotelList?.reduce((prev: any, curr: any) => prev + curr.orderFee, 0) || 0:
            props.newHotelList?.reduce((prev: any, curr: any) => prev + curr.orderFee, 0) || 0}</span>元`,
        dataSource: props.hotelList?props?.hotelList:props?.newHotelList,
    })
    let ticketcolumns = reactive({
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
                title: '日期',
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
                dataIndex: 'totalFee',
                key: 'totalFee',
            },
            {
                title: '支付状态',
                dataIndex: 'orderStatusName',
                key: 'orderStatusName',
            },
            {
                title: '操作',
                key: 'action',
                fixed: 'right',
            },
        ],
        title: '景区费用',
        descriptions: `已预订<span style="color: red;">${props.ticketList ? props.ticketList?.length : props.newTicketList?.length}</span>个景区，
          游玩人数：<span style="color: red;">${props.ticketList ? props.ticketList?.reduce((prev: any, curr: any) => prev + curr.reservePeopleCount, 0) :
            props.newTicketList?.reduce((prev: any, curr: any) => prev + curr.reservePeopleCount, 0)}</span>；
          门票数量：<span style="color: red;">${props.ticketList ? props.ticketList.reduce((prev: any, curr: any) => prev + curr.reservePeopleCount, 0) :
            props.newTicketList?.reduce((prev: any, curr: any) => prev + curr.reservePeopleCount, 0)}</span>；
          费用总计：<span style="color: red;">${props.ticketList ? props.ticketList.reduce((prev: any, curr: any) => prev + curr.unitPrice * curr.reservePeopleCount, 0) || 0 :
            props.newTicketList?.reduce((prev: any, curr: any) => prev + curr.unitPrice * curr.reservePeopleCount, 0) || 0}</span>元`,
        dataSource: props.ticketList ? props?.ticketList : props.newTicketList,
    })
    return{
        hotelcolumns,
        ticketcolumns
    }
}