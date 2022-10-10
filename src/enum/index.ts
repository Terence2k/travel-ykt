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
  Drafts = 1,     //草稿
  WaitingGroup,   //待接团
  Unpaid,         //未支付
  RefuseGroup,    //拒绝接团
  WaitRegiment,   //待出团
  HaveABall,      //已出团
  WaitingChange,  //待变更
  CloseAnAccount, //已结算
  Cancellation    //已作废
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