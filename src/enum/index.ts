export enum RoleEnum {
  "运营人员" = "2",
  "管理员" = "5",
}

// 组团模式
export enum GroupMode {
  All,
  TeamGroup,
  NoTeamGroup
}

// 行程单状态
// (1, "草稿")
// (2, "待协作")
// (3, "待管理部门审核(发团)")
// (4, "待管理部门审核(变更)")
// (5, "待财务审核(发团)")
// (6, "待财务审核(变更)")
// (7, "待接团")
// (8, "已过期")
// (9, "暂停行程")
// (10, "待预定酒店")
// (11, "待出团")
// (12, "出团中")
// (13, "已散团")
// (14, "预结算")
// (15, "已结算")
// (16, "已申请转账")
// (17, "结算完成")
export enum GroupStatus {
  Drafts = 1,     //草稿1
  WaitRegiment,   //待审核2
  WaitingGroup,   //待接团3
  HaveABall,      //已接团4
  Cancellation,    //已散团5
  // RefuseGroup = 13,    //拒绝接团4
  WaitingChange,  //待变更6
  // CloseAnAccount = 15, //已结算8
  Overtime,        //已过期7
  // Unpaid,         //未支付
}

// 酒店订单状态
export enum HotelStatus{
  waits = 1,   //待审核
  success = 2,//审核通过2
  refuse = -1, //审核不通过-1
  cancal =0, //取消
  finish =3,   //完成
}
// 古维减免状态
export enum GouvyStatus{
  waits = 0,   //待审核
  success = 1,//审核通过2
  refuse = -1, //审核不通过-1
}
// 撤销重提状态
export enum revocationStatus{
  waits = 0,   //待审核
  success = 1,//审核通过1
  refuse = 2, //审核不通过2
}

// 线路类型
export enum RouteType {
  Routemodel = 1,
  CustomRoute
}

// 性别
export enum Gender {
  Madam,
  Male
}

// 组团类型
export enum GroupType {
  Cooperation = 1,
  NonCooperation

}

// 导游类型
export enum GuideType {
  UnderGuide = 1,
  AppointGuide
}

// 收费模式
export enum FeeModel {
  Number,
  Price
}

// 是否按天收费
export enum ConfirmDailyCharge {
  NotDay,
  IsDay
}
// 险种
export enum insuranceType{
  accident,
  brigade
}

// 审核状态类型
export enum AuditStaus {
  FinanceChange, // 待财务审核（变更）0
  AdministrativeSendGroup = 3, // 待管理部门审核（发团）3
  AdministrativeChange, // 待管理部门审核（变更）4
  FinanceSendGroup, // 带财务审核（发团）5
  withdrawalChange=20,//带财务审核（撤销重提）
}

// 接团状态类型
export enum TakeGroupStatus {
  Drafts = 1,     // 草稿 1
  WaitingGroup,   // 待接团 2
  WaitingReserved,   // 待预订 3
  Dispatched,   // 已出团 4
  Cancellation,    // 已散团 5
  WaitingChange,  // 待变更 6
  Overtime,        // 已过期 7
  WaitingOutGroup,        // 待出团 8
}

export enum HealthCode {
  Green = '00',
  Yellow = '01',
  Red = '10'
}

export enum TicketType {
  ONE = 1,
  UNITE = 2,
  SHOW = 3
}