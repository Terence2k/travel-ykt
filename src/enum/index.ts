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
export enum GroupStatus {
  Drafts = 1,     //草稿1
  WaitingGroup,   //待接团2
  HaveABall,      //已接团3
  RefuseGroup,    //拒绝接团4
  WaitingChange = 7,  //待变更7
  CloseAnAccount, //已结算8
  Cancellation,    //已作废9
  Overtime,        //审核超时10
  Unpaid,         //未支付
  WaitRegiment,   //待出团
}

// 酒店订单状态
export enum HotelStatus{
  waits = 1,   //待审核
  success = 2,//审核通过2
  refuse = -1, //审核不通过-1
  cancal =0, //取消
  finish =3,   //完成
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
  AdministrativeSendGroup = 3, // 待管理部门审核（发团）3
  AdministrativeChange, // 待管理部门审核（变更）4
  FinanceSendGroup, // 带财务审核（发团）5
  FinanceChange, // 待财务审核（变更）6
}