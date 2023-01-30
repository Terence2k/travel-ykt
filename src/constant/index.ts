import { HealthCode, Insurance } from "@/enum"

export const ROLE = {
    TRAVE_CODE: 'TRAVEL_OPERATOR', //计调
    CULTURE_BUREAU: 'CULTURE_BUREAU', //旅游局
    ANCIENT_UYGUR: 'ANCIENT_UYGUR', //古维
    SUPERVISE: 'SUPERVISE', //监理公司
    ASSOCIATION: 'ASSOCIATION', //旅游协会
    YKT: 'YKT', //一卡通
    GROUP: 'GROUP', //集团
}

export const CODEVALUE= {
    TRAVE_CODE: {
        IDCARD: 'CERTIFICATE_TYPE',//证件类型
        SPECIALID: 'SPECIAL_CERTIFICATE_TYPE',//特殊证件
        TRAFFICTYPE: 'TRANSPORT_TYPE',//交通类型
        TRAFFICCOLOR: 'LICENCE_PLATE_COLOR',//车牌颜色
        IDENTITY_CARD: 'IDENTITY_CARD', //身份证
        DRAFT: 'DRAFT', //草稿
        WAIT_COOPERATE: 'WAIT_COOPERATE', //待协作
        WAIT_MANAGE_AUDIT_SEND: 'WAIT_MANAGE_AUDIT_SEND', //待管理部门审核(发团)
        WAIT_MANAGE_AUDIT_CHANGE: 'WAIT_MANAGE_AUDIT_CHANGE', //待管理部门审核(变更)
        WAIT_FINANCE_AUDIT_SEND: 'WAIT_FINANCE_AUDIT_SEND', //待财务审核(发团)
        WAIT_FINANCE_AUDIT_CHANGE: 'WAIT_FINANCE_AUDIT_CHANGE', //待财务审核(变更)
        WAIT_TAKE: 'WAIT_TAKE', //待接团
        TIMEOUT: 'TIMEOUT', //已过期
        SUSPEND: 'SUSPEND', //暂停行程
        WAIT_RESERVE_HOTEL: 'WAIT_RESERVE_HOTEL', //待预定酒店
        WAIT_GO_OUT: 'WAIT_GO_OUT', //待出团
        AT_OUT: 'AT_OUT', //出团中
        TEAM_END: 'TEAM_END', //已散团
        PRE_SETTLE: 'PRE_SETTLE', //预结算
        HAD_SETTLED: 'HAD_SETTLED', //已结算
        HAD_APPLY_TRANSFER: 'HAD_APPLY_TRANSFER', //已申请转账
        SETTLE_COMPLETE: 'SETTLE_COMPLETE' //结算完成
    },
    HEALTHCODE: {
        [HealthCode.Green]: '绿码',
        [HealthCode.Yellow]: '黄码',
        [HealthCode.Red]: '红码'
    }
}
export const TICKET = {
    'ONE': '单票',
    'UNITE': '联票',
    'SHOW': '演出票'
}

export const INSURANCE = {
    // [Insurance.NOTSURE]: '没有确认',
    [Insurance.SUBBUY]: '应地接社购买',
    [Insurance.TEAMBUY]: '组团社确认已购买'
}
