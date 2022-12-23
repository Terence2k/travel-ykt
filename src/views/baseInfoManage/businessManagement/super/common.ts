import type { Rule } from 'ant-design-vue/es/form';
import dayjs, { Dayjs } from 'dayjs';
// 银行二级账户开通信息（如果需要充值或收付款、提现，均需先开通银行二级账户）
const bankAccountKeys = {
  companyUserEmail: '企业对公邮箱',
  postalCode: '企业所在地邮编',
  businessLicenseNo: '企业营业执照证件号码',
  contactEmail: '企业联系人邮箱',
  contactIdNumber: '企业联系人身份证号码',
  legalPersonPhone: '企业法人/负责人手机号',
  legalPersonIdNumber: '企业法人/负责人身份证号',
  bankAddressIds: '企业开户行所在地',
  bankNo: '企业开户行行号',
  bankReservePhone: '企业开户行预留手机号',
  memberRegistrationPhone: '企业会员注册手机号',
  legalPersonUrl: '法人身份证照片'
}
// 旅游集团
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
  ...bankAccountKeys
}
// 酒店
const keyNameList2 = {
  ...keyNameList1,
  unitStatus: '开业状态', //  1-开业 0-停业
  hotelStarCode: '星级',
  derate: '是否支持减免', // false-否 true-是
  reduceRules: '减免规则',
}
// 酒店
const editKeyNameList2 = {
  ...keyNameList1,
  unitStatus: '开业状态', //  1-开业 0-停业
  hotelStarId: '星级',
  derate: '是否支持减免', // false-否 true-是
  reduceRules: '减免规则',
}
// 景区
const keyNameList3 = {
  ...keyNameList1,
  unitStatus: '开业状态', //  1-开业 0-停业
  scenicLevel: '等级',
  derate: '是否支持减免', // false-否 true-是
  reduceRules: '减免规则',
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
  accountType: '公司账户类型',
  bankAccountName: '公司账户名称',
  bank: '开户行',
  bankAccount: '公司账号',
  ...bankAccountKeys
}
// 文旅局、保险公司
const keyNameList6 = {
  businessType: '企业类型',
  name: '企业名称',
  regionCode: '企业所属地区',
  addressDetail: '企业详情地址',
  contactName: '联系人',
  phone: '联系电话',
}
// 旅行社
const keyNameList7 = {
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
  licenseNo: "12301旅行社许可证号",
  individualDeparturePlace: '散客常用出发地',
  individualReturnPlace: '散客常用返回地',
  isIndividual: "是否为散客中心",
  businessLicenseUrl: '营业执照',
  manageUrl: '经营许可证',
  ...bankAccountKeys
}
// 旅游协会、一卡通
const keyNameList8 = {
  businessType: '企业类型',
  name: '企业名称',
  regionCode: '企业所属地区',
  addressDetail: '企业详情地址',
  ...bankAccountKeys
}
const fullRuleKeyNames = {
  fullRule: '满',
  reduceRule: '减'
}
function getKeylist(businessType: string, type?: string) {
  let keys
  switch (businessType) {
    case 'TRAVEL':
      keys = keyNameList7
      break;
    case 'GROUP':
      keys = keyNameList1
      break;
    case 'HOTEL':
      if (type === 'edit') {
        keys = { ...editKeyNameList2, ...fullRuleKeyNames }
      } else {
        keys = keyNameList2
      }
      break;
    case 'TICKET':
      if (type === 'edit') {
        keys = { ...keyNameList3, ...fullRuleKeyNames }
      } else {
        keys = keyNameList3
      }
      break;
    case 'CATERING':
      keys = keyNameList4
      break;
    case 'ANCIENT_UYGUR':
    case 'SUPERVISE':
      keys = keyNameList5
      break;
    case 'CULTURE_BUREAU':
    case 'INSURANCE_COMPANY':
      keys = keyNameList6
      break;
    case 'ASSOCIATION':
    case 'YKT':
      keys = keyNameList8
      break;
  }
  return keys
}

// 旅游集团、酒店、景区、餐厅
const commonFormRules6: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  regionCode: [{ required: true, trigger: 'blur', message: '请选择企业所属地区' }],
  addressDetail: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  legalPerson: [{ required: true, trigger: 'blur', message: '请输入法定代表人' }],
  managementRange: [{ required: true, trigger: 'blur', message: '请输入经营范围' }],
  registeredCapital: [{ required: true, trigger: 'blur', message: '请输入注册资本' }],
  establishTime: [{ required: true, trigger: 'blur', message: '请选择成立日期' }],
  businessTerm: [{ required: true, trigger: 'blur', message: '请选择营业期限' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
  accountType: [{ required: true, trigger: 'blur', message: '请选择公司账户类型' }],
  bankAccountName: [{ required: true, trigger: 'blur', message: '请输入公司账户名称' }],
  bank: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
  bankAccount: [{ required: true, trigger: 'blur', message: '请输入公司账号' }],
  creditCode: [{ required: true, trigger: 'blur', message: '请输入统一社会信用代码' }],
  businessLicenseUrl: [{ required: true, trigger: 'blur', message: '请上传营业执照照片' }],
}
// 一卡通
const commonFormRules9: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  regionCode: [{ required: true, trigger: 'blur', message: '请选择企业所属地区' }],
  addressDetail: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
}
// 监理、古维管理部门
const commonFormRules7: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  regionCode: [{ required: true, trigger: 'blur', message: '请选择企业所属地区' }],
  addressDetail: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
  accountType: [{ required: true, trigger: 'blur', message: '请选择公司账户类型' }],
  bankAccountName: [{ required: true, trigger: 'blur', message: '请输入公司账户名称' }],
  bank: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
  bankAccount: [{ required: true, trigger: 'blur', message: '请输入公司账号' }],
}
// 旅游协会、文旅局、保险公司
const commonFormRules8: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  regionCode: [{ required: true, trigger: 'blur', message: '请选择企业所属地区' }],
  addressDetail: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
}
// 旅行社
const commonFormRules5: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  regionCode: [{ required: true, trigger: 'blur', message: '请选择企业所属地区' }],
  addressDetail: [{ required: true, trigger: 'blur', message: '请输入企业详情地址' }],
  legalPerson: [{ required: true, trigger: 'blur', message: '请输入法定代表人' }],
  managementRange: [{ required: true, trigger: 'blur', message: '请输入经营范围' }],
  registeredCapital: [{ required: true, trigger: 'blur', message: '请输入注册资本' }],
  establishTime: [{ required: true, trigger: 'blur', message: '请选择成立日期' }],
  businessTerm: [{ required: true, trigger: 'blur', message: '请选择营业期限' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
  accountType: [{ required: true, trigger: 'blur', message: '请选择公司账户类型' }],
  bankAccountName: [{ required: true, trigger: 'blur', message: '请输入公司账户名称' }],
  bank: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
  bankAccount: [{ required: true, trigger: 'blur', message: '请输入公司账号' }],
  creditCode: [{ required: true, trigger: 'blur', message: '请输入统一社会信用代码' }],
  licenseNo: [{ required: true, trigger: 'blur', message: '请输入旅行社许可证号' }],
  isIndividual: [{ required: true, trigger: 'blur', message: '选择是否为散客中心' }],
  individualDeparturePlace: [{ required: true, trigger: 'blur', message: '请输入散客常用出发地' }],
  individualReturnPlace: [{ required: true, trigger: 'blur', message: '请输入散客常用返回地' }],
  legalPersonUrl: [{ required: true, trigger: 'blur', message: '请上传法人身份证附件' }],
  businessLicenseUrl: [{ required: true, trigger: 'blur', message: '请上传营业执照照片' }],
  manageUrl: [{ required: true, trigger: 'blur', message: '请上传经营许可证' }],
}
// 旅游集团、酒店、景区、餐厅
const condition1 = ['GROUP', 'HOTEL', 'TICKET', 'CATERING']
// 一卡通
const condition2 = ['YKT']
// 监理、古维管理部门
const condition3 = ['SUPERVISE', 'ANCIENT_UYGUR']
// 旅游协会、文旅局、保险公司
const condition4 = ['ASSOCIATION', 'CULTURE_BUREAU', 'INSURANCE_COMPANY']
// 旅行社
const condition5 = ['TRAVEL']
const businessTypeOption = [
  { codeValue: 'HOTEL', name: '酒店' },
  { codeValue: 'CATERING', name: '餐饮' },
  { codeValue: 'TICKET', name: '景区' },
  { codeValue: 'TRAVEL', name: '旅行社' },
  { codeValue: 'GROUP', name: '集团' },
  { codeValue: 'YKT', name: '一卡通' },
  { codeValue: 'SUPERVISE', name: '监理' },
  { codeValue: 'ASSOCIATION', name: '协会' },
  { codeValue: 'CULTURE_BUREAU', name: '文旅局' },
  { codeValue: 'ANCIENT_UYGUR', name: '古维管理部门' },
  { codeValue: 'INSURANCE_COMPANY', name: '保险公司' },
];
// 对象扁平化
const flat = (target: any) => {
  let obj: any = {};
  let process = (_target: any) => {
    if (Object.prototype.toString.call(_target) === '[object Object]') {
      let keys = Object.keys(_target)
      keys.forEach(item => {
        if (Object.prototype.toString.call(_target[item]) === '[object Object]') {
          process(_target[item])
        } else {
          obj[item] = _target[item]
        }
      })
    }
  }
  process(target)
  return obj
}
const disabledBeforeDate = (current: Dayjs) => {
  // Can not select days before today and today
  // return current && current < dayjs().endOf('day');
  // Can not select days before today
  return current < dayjs().endOf('day');
};
const disabledAfterDate = (current: Dayjs) => {
  // Can not select days before today and today
  // return current && current < dayjs().endOf('day');
  // Can not select days after today
  return dayjs().endOf('day') < current;
};
export {
  getKeylist,
  commonFormRules5,
  commonFormRules6,
  commonFormRules9,
  commonFormRules7,
  commonFormRules8,
  condition1,
  condition2,
  condition3,
  condition4,
  condition5,
  flat,
  disabledBeforeDate,
  disabledAfterDate,
  businessTypeOption
}