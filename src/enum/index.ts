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
  // Unpaid,         //未支付
  RefuseGroup,    //拒绝接团4
  // WaitRegiment,   //待出团
  WaitingChange,  //待变更7
  CloseAnAccount, //已结算8
  Cancellation,    //已作废9
  Overtime        //审核超时10
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