const keyNameList = {
  businessType: '企业类型',
  name: '企业名称',
  regionCode: '企业所属地区',
  // provinceId: '省',
  // cityId: '市',
  // areaId: '县',
  addressDetail: '企业详情地址',
  legalPerson: '法定代表人',
  managementRange: '经营范围',
  registeredCapital: '注册资本',
  establishTime: '成立日期',
  businessTerm: '营业期限',
  contactName: '联系人',
  phone: '联系电话',
  accountType: '公司账户类型',
  bankAccountName: '公司账户名称',
  bank: '开户行',
  bankAccount: '公司账号',
  creditCode: '统一社会信用代码',
  businessLicenseUrl: '营业执照',
  // manageUrl: '经营许可证',
  hotelStarCode: '星级',
  unitStatus: '开业状态', //  0-开业 1-停业
  isReduced: '是否支持减免', // 0-否 1-是
  reduceRule: '减免规则',
  startTime: '开始营业时间', // '营业时间',
  endTime: '结束营业时间',
  shopPhone: '店铺联系电话',
  cateringDesc: '其他'
}
// 旅行社、旅游集团
const keyNameList1 = {
  businessType: '企业类型',
  name: '企业名称',
  regionCode: '企业所属地区',
  addressDetail: '企业详情地址',
  legalPerson: '法定代表人',
  managementRange: '经营范围',
  registeredCapital: '注册资本',
  establishTime: '成立日期',
  businessTerm: '营业期限',
  contactName: '联系人',
  phone: '联系电话',
  accountType: '公司账户类型',
  bankAccountName: '公司账户名称',
  bank: '开户行',
  bankAccount: '公司账号',
  creditCode: '统一社会信用代码',
  businessLicenseUrl: '营业执照',
}
// 酒店
const keyNameList2 = {
  ...keyNameList1,
  unitStatus: '开业状态', //  0-开业 1-停业
  hotelStarCode: '星级',
  isReduced: '是否支持减免', // 0-否 1-是
  reduceRule: '减免规则',
}
// 景区
const keyNameList3 = {
  ...keyNameList1,
  unitStatus: '开业状态', //  0-开业 1-停业
  scenicLevel: '等级',
  isReduced: '是否支持减免', // 0-否 1-是
  reduceRule: '减免规则',
}
// 餐厅
const keyNameList4 = {
  ...keyNameList1,
  unitStatus: '开业状态', //  0-开业 1-停业
  startTime: '开始营业时间', // '营业时间',
  endTime: '结束营业时间',
  shopPhone: '店铺联系电话',
  cateringDesc: '其他'
}
// 监理、古维管理部门
const keyNameList5 = {
  businessType: '企业类型',
  name: '企业名称',
  regionCode: '企业所属地区',
  addressDetail: '企业详情地址',
  contactName: '联系人',
  phone: '联系电话',
  accountType: '公司账户类型',
  bankAccountName: '公司账户名称',
  bank: '开户行',
  bankAccount: '公司账号',
}
// 旅游协会、文旅局、一卡通
const keyNameList6 = {
  businessType: '企业类型',
  name: '企业名称',
  regionCode: '企业所属地区',
  addressDetail: '企业详情地址',
  contactName: '联系人',
  phone: '联系电话',
}
function getKeylist(businessType: string) {
  let keys
  switch (businessType) {
    case 'TRAVEL':
    case 'GROUP':
      keys = keyNameList1
      break;
    case 'HOTEL':
      keys = keyNameList2
      break;
    case 'TICKET':
      keys = keyNameList3
      break;
    case 'CATERING':
      keys = keyNameList4
      break;
    case 'ANCIENT_UYGUR':
    case 'SUPERVISE':
      keys = keyNameList5
      break;
    case 'CULTURE_BUREAU':
    case 'ASSOCIATION':
    case 'YKT':
      keys = keyNameList6
      break;
  }
  return keys
}
export { getKeylist }