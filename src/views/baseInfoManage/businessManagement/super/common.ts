import api from '@/api';
import type { Rule } from 'ant-design-vue/es/form';
import dayjs, { Dayjs } from 'dayjs';
// 银行二级账户开通信息（如果需要充值或收付款、提现，均需先开通银行二级账户）
const bankAccountKeys = {
  bankAccountType: '账号类型',
  legalPerson: '法人姓名',
  legalPersonIdNumber: '法人身份证',
  businessLicenseNo: '营业执照号码',
  bankNo: '开户行行号',
  bank: '开户行名称',
  bankAccount: '银行卡号',
  bankAccountName: '账号名称',
  companyEnglishName: '英文名',
  contactEmail: '联系人邮箱',
  postalCode: '邮政编码',
}
// 旅游集团
const keyNameList1 = {
  businessType: '企业类型',
  name: '企业名称',
  regionCode: '所属地址',
  addressDetail: '详情地址',
  establishTime: '成立日期',
  businessTerm: '营业期限',
  contactName: '联系人',
  phone: '联系电话',
  creditCode: '统一社会信息代码',
  businessLicenseUrl: '营业执照',
  registeredCapital: '注册资本',
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
  rangeTime: '营业时间',
  shopPhone: '店铺联系电话',
  cateringDesc: '其他'
}
// 餐厅
const editKeyNameList4 = {
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
  ...keyNameList1,
  licenseNo: "12301旅行社许可证号",
  individualDeparturePlace: '散客常用出发地',
  individualReturnPlace: '散客常用返回地',
  isIndividual: "是否为散客中心",
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
      if (type === 'edit') {
        keys = editKeyNameList4
      } else {
        keys = keyNameList4
      }
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
const bankCommonFormRules: Record<string, Rule[]> = {
  bankAccountType: [{ required: true, trigger: 'blur', message: '请选择账号类型' }],
  legalPerson: [{ required: true, trigger: 'blur', message: '请输入法人姓名' }],
  legalPersonIdNumber: [{ required: true, trigger: 'blur', message: '请输入法人身份证' }],
  businessLicenseNo: [{ required: true, trigger: 'blur', message: '请输入营业执照号码' }],
  bankNo: [{ required: true, trigger: 'blur', message: '请输入开户行行号' }],
  bank: [{ required: true, trigger: 'blur', message: '请输入开户行名称' }],
  bankAccount: [{ required: true, trigger: 'blur', message: '请输入银行卡号' }],
  bankAccountName: [{ required: true, trigger: 'blur', message: '请输入账号名称' }],
  companyEnglishName: [{ required: true, trigger: 'blur', message: '请输入英文名' }],
  contactEmail: [{ required: true, trigger: 'blur', message: '请输入联系人邮箱' }],
  postalCode: [{ required: true, trigger: 'blur', message: '请输入邮政编码' }],
}
const commonFormRules: Record<string, Rule[]> = {
  businessType: [{ required: true, trigger: 'blur', message: '请选择企业类型' }],
  name: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
  regionCode: [{ required: true, trigger: 'blur', message: '请选择所属地址' }],
  addressDetail: [{ required: true, trigger: 'blur', message: '请输入详情地址' }],
  creditCode: [{ required: true, trigger: 'blur', message: '请输入统一社会信息代码' }],
  businessLicenseUrl: [{ required: true, trigger: 'blur', message: '请上传营业执照照片' }],
  registeredCapital: [{ required: true, trigger: 'blur', message: '请输入注册资本' }],
  accountName: [{ required: true, trigger: 'blur', message: '请输入超级管理员姓名' }],
  account: [{ required: true, trigger: 'blur', message: '请输入管理员账号' }],
  accountPhone: [{ required: true, trigger: 'blur', message: '请输入管理员手机号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入管理员密码' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入联系人电话' }],
  ...bankCommonFormRules
}
const hotelCommonFormRules: Record<string, Rule[]> = {
  ...commonFormRules,
  unitStatus: [{ required: true, trigger: 'blur', message: '请选择企业状态' }],
  hotelStarId: [{ required: true, trigger: 'blur', message: '请选择酒店星级' }],
  derate: [{ required: true, trigger: 'blur', message: '请选择是否支持减免' }],
  fullRule: [{ required: true, trigger: 'blur', message: '请输入减免规则' }],
  reduceRule: [{ required: true, trigger: 'blur', message: '请输入减免规则' }]
}
const cateringCommonFormRules: Record<string, Rule[]> = {
  ...commonFormRules,
  unitStatus: [{ required: true, trigger: 'blur', message: '请选择企业状态' }],
  /* startTime: [{ required: true, trigger: 'blur', message: '请选择开始营业时间' }],
  endTime: [{ required: true, trigger: 'blur', message: '请选择结束营业时间' }],
  shopPhone: [{ required: true, trigger: 'blur', message: '请输入店铺联系电话' }]'', */
}
const ticketCommonFormRules: Record<string, Rule[]> = {
  ...commonFormRules,
  unitStatus: [{ required: true, trigger: 'blur', message: '请选择企业状态' }],
  scenicLevel: [{ required: true, trigger: 'blur', message: '请选择景区等级' }],
  derate: [{ required: true, trigger: 'blur', message: '请选择是否支持减免' }],
  fullRule: [{ required: true, trigger: 'blur', message: '请输入减免规则' }],
  reduceRule: [{ required: true, trigger: 'blur', message: '请输入减免规则' }]
}
const travelCommonFormRules: Record<string, Rule[]> = {
  ...commonFormRules,
  licenseNo: [{ required: true, trigger: 'blur', message: '请输入12301旅行社许可证号' }],
  individualDeparturePlace: [{ required: true, trigger: 'blur', message: '请输入散客常用出发地' }],
  individualReturnPlace: [{ required: true, trigger: 'blur', message: '请输入散客常用返回地' }],
  isIndividual: [{ required: true, trigger: 'blur', message: '请选择是否为散客中心' }],
  manageUrl: [{ required: true, trigger: 'blur', message: '请上传经营许可证' }],
}
const getFormRules = (businessType: string) => {
  if (businessType === 'HOTEL') {
    return hotelCommonFormRules
  } else if (businessType === 'CATERING') {
    return cateringCommonFormRules
  } else if (businessType === 'TICKET') {
    return ticketCommonFormRules
  } else if (businessType === 'TRAVEL') {
    return travelCommonFormRules
  } else {
    return {}
  }
}
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
const toIcbc = (id: number, callback?: any) => {
  api.certification({ companyId: id }).then((res: any) => {
    if (res?.redirectParam) {
      window.open(res.redirectParam, '_blank');
      callback && callback()
    }
  })
}
export {
  getKeylist,
  getFormRules,
  flat,
  disabledBeforeDate,
  disabledAfterDate,
  businessTypeOption,
  toIcbc
}