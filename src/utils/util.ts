import { ConfirmDailyCharge, FeeModel, Gender } from "@/enum";
import router from "@/router/index";
import { useTravelStore } from "@/stores/modules/travelManagement";
import { message } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import { accDiv, accMul } from './compute'
import isBetween from 'dayjs/plugin/isBetween'

const travelStore = useTravelStore();

export const to2 = () => {
  window.localStorage.setItem("authorization", "");
  window.localStorage.setItem("userInfo", "");
  window.localStorage.setItem("tabArr", "");
  window.localStorage.setItem("btnArr", "");
  router.push("/login");
  // location.reload();
};
export const getToken = () => {
  const authorization = localStorage.getItem('authorization');
  const refreshToken = localStorage.getItem('refreshToken');
  const expiresIn = localStorage.getItem('expiresIn');
  const smallTown = localStorage.getItem('smallTown');
  const permissions = localStorage.getItem('ENUM_PERMISSIONS');
  return {
    authorization,
    refreshToken,
    expiresIn,
    smallTown,
    permissions: permissions ? JSON.parse(permissions) : []
  };
}
export const getUserInfo = () => {
  return JSON.parse(<string>localStorage.getItem('userInfo') || '{}');
}

export const saveToken = (token: any) => {
  const { authorization } = token;
  authorization && localStorage.setItem('authorization', authorization)
}

/**
 * tree 数据转换
 * @param  {Array} tree 待转换的 tree
 * @param  {Object} map  键值对映射
 * @return {Array}      转换后的 tree
 */
 export function convertTree(
  tree: Array<any>,
  map: Record<string, any>
): Array<any> {
  const result: Array<any> = [];
  // 遍历 tree
  tree.forEach(item => {
    // 读取 map 的键值映射
    const value = item[map.value];
    const label = item[map.label];
    let children = item[map.children];
    let expand = false;
    const newItem = { ...item };
    delete newItem['children'];
    const properties = item.properties ? item.properties : null;
    const model = newItem;
    let mobile;
    if (map.expand) {
      expand = true;
    }
    if (map.mobile) {
      mobile = item[map.mobile];
    }
    // 如果有子节点，递归
    if (children) {
      children = convertTree(children, map);
    }
    result.push({
      value,
      label,
      children,
      expand,
      mobile,
      properties,
      model
    });
  });
  return result;
}

// 计算元素相对页面位置position
export const getElementPos = (el: any) => {
  if(el.parentNode === null || el.style.display == 'none') { return false;}     
  let parent = null;
  let pos = [];
  let box;
  if(el.getBoundingClientRect) {//IE
      box = el.getBoundingClientRect();
      let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
      let scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
      return {x:box.left + scrollLeft, y:box.top + scrollTop};
  } else {
    pos = [el.offsetLeft, el.offsetTop]; 
    parent = el.offsetParent;    
    if (parent != el) {
      while (parent) { 
        pos[0] += parent.offsetLeft;
        pos[1] += parent.offsetTop;
        parent = parent.offsetParent;
      } 
    }  
  }  
  return {x:pos[0], y:pos[1]};
}

// 生成随机id
export function generateGuid() {
  let guid = "";
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16).toString(16);
    guid += n;
    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
    guid += "-";
  }
  return guid;
}
/**
 * 按身份证号码获取性别
 * @idNumber 身份证号码
 * @return 男：male；女：female；异常（身份证号码为空或长度、格式错误）：undefined
 */
export function getGenderByIdNumber(idNumber: any) {
  if (idNumber) {
      let genderCode; // 性别代码
      if (idNumber.length == 18) { // 二代身份证号码长度为18位（第17位为性别代码）
          genderCode = idNumber.charAt(16);
      } else if (idNumber.length == 15) { // 一代身份证号码长度为15位（第15位为性别代码）
          genderCode = idNumber.charAt(14);
      }
      if (genderCode && !isNaN(genderCode)) {
          // 两代身份证号码的性别代码都为男奇女偶
          if (parseInt(genderCode) % 2 == 0) {
              return Gender.Madam;
          }
          return Gender.Male;
      }
  }
}
//根据身份证号获取年龄
export function getAge(identityCard: any) {
  var len = (identityCard + "").length;
  var strBirthday = "";
  if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
  {
      strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
  }
  if (len == 15) {
      var birthdayValue='';
      birthdayValue = identityCard.charAt(6)+identityCard.charAt(7);
      if(parseInt(birthdayValue)<10){
          strBirthday = "20" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
      }else{
          strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
      }

  }
  //时间字符串里，必须是“/”
  var birthDate = new Date(strBirthday);
  var nowDateTime = new Date();
  var age = nowDateTime.getFullYear() - birthDate.getFullYear();
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}

export const checkList = (list: any, code: any, path = []):any => {
  if (!list) return []
  for (const data of list) {
    path.push(data.value)
    if (data.value == code) return path
    if (data.children && data.children.length) {
      const findchildren = checkList(data.children, code, path)
      if (findchildren.length) return findchildren
    }
    path.pop()
  }
  return []
}

export function getStyles(elem: any, prop: any) {
  if (window.getComputedStyle) {
    if (prop) {
      return parseInt(window.getComputedStyle(elem, null)[prop])
    } else {
      return window.getComputedStyle(elem, null)
    }
  } else {
    if (prop) {
      return parseInt(elem.currentStyle[prop])
    } else {
      return elem.currentStyle
    }
  }
}

/***
 *下载文件
 *@param response
 */
export const downloadFile = (response: any, name?: string) => {
  const blob = new Blob([response.data], {
    type: response.headers['content-type']
  });
  console.log('下载', response);
  console.log(blob);

  const disposition =
    response.headers['content-disposition'] || 'filename=' + name;
  if (!disposition) {
    return;
  }
  let fileName =
    disposition.split('filename=')[1] || disposition.split("''")[1];
  // let fileName = '测试下载.xlsx';
  fileName = decodeURIComponent(fileName) || fileName; //中文
  if ('download' in document.createElement('a')) {
    //非IE下载
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } else {
    if (navigator.msSaveBlob) navigator.msSaveBlob(blob, fileName);
  }
};

/**
 * 
 * @param model 收费模式
 * @param price 单价
 * @returns count 总价
 */

 export const getPrice = (model: any, price: number) => {
	let count = 0
	switch(model) {
		case FeeModel.Number :
			count = accMul(price, travelStore.touristList.length)
			break;
		case FeeModel.Price :
			count = price
			break;
	}
	return count
}


/**
 * 
 * @param a 是否按天收费
 * @param price 单价
 * @param model 收费模式
 * @returns countPrice 总价
 */

export const getAmount = (a:any, price: number, model: any) => {
	let countPrice = 0
	switch (a) {
		case ConfirmDailyCharge.NotDay :
			countPrice = getPrice(model, price)
			break;
		case ConfirmDailyCharge.IsDay :
			const dayCount = dayjs(travelStore.baseInfo.endDate).diff(travelStore.baseInfo.startDate, 'day');
			countPrice = accMul(getPrice(model, price), dayCount);
			break;
	}
	return countPrice
}

export const selectSpecialDateRange = (start: any, end: any, hotelId: number) => {
  dayjs.extend(isBetween)
  const travelStore = useTravelStore()  //下面就每两两进行比较
  const newHotel = travelStore.hotels.filter((it: any) => it.hotelId == hotelId)
  const startDate =  newHotel.map((it: any) => it.startDate);
  const endDate = newHotel.map((it: any) => it.endDate);
  // console.log(date)
  let flag = false 
  for(let i = 0; i < startDate.length; i++){
    //每次和之前选择的日期范围两两比较
    const startRes = dayjs(start).isBetween(startDate[i], endDate[i], null, '[]');
    const endRes = dayjs(end).isBetween(startDate[i], endDate[i], null, '[]');
    const dateStartRes = dayjs(startDate[i]).isBetween(start, end, null, '[]');
    const dateEndRes = dayjs(endDate[i]).isBetween(start, end, null, '[]');
    if(startRes || 
          endRes ||
          dateStartRes ||
          dateEndRes) {
      flag = true;
      break;
    }
  }
  console.log(flag)
  return flag;
}

export const range = (start: number, end: number) => {
	const result = [];

	for (let i = start; i < end; i++) {
		result.push(i);
	}

	return result;
};

export const disabledRangeTime = (start: any, end: any) => {
	return (_: Dayjs, type: 'start' | 'end') => {
   
    const current = dayjs(dayjs(_).format('YYYY-MM-DD')).unix()
    
    const startUnix = dayjs(dayjs(travelStore.teamTime[0]).format('YYYY-MM-DD')).unix();
    const endUnix = dayjs(dayjs(travelStore.teamTime[1]).format('YYYY-MM-DD')).unix();
    
    // 判断日期选择是开始时间
		if (type === 'start') {
      // console.log('start');
      // 如果是开始日期 === 所选日期就限制
      if (startUnix === current) {
        // console.log('开始日期等于所选日期')
        return {
          disabledHours: () => range(0, 24).splice(0, start.hour),
          disabledMinutes: () => range(0, 60).splice(0, start.min),
          disabledSeconds: () => range(0, 60).splice(0, start.second),
        };
      }
      // console.log('开始日期大于所选日期')
			return {
        disabledHours: () => [],
        disabledMinutes: () => [],
        disabledSeconds: () => [],
      };
		} else {
      // 如果结束日期 === 所选日期就限制
      if (endUnix === current) {
        console.log('结束日期等于所选日期')
        return {
          disabledHours: () => range(0, 24).splice(end.hour + 1, 24 - end.hour),
          disabledMinutes: () => range(0, 60).splice(end.min + 1, 60 - end.min),
          disabledSeconds: () => range(0, 60).splice(end.second + 1, 60 - end.second),
        };
      }
    }
    
    console.log('结束日期小于所选日期')
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
	}
};

/**
 * @param currentDate Arrary 当前时间
 * @param type 当前选择的是开始时间还是结束时间
 * @returns Array 当前禁用时间
 */
export const disabledRangeHours = (currentDate: any, type: string) => {
  const currentStart = dayjs(dayjs(currentDate[0]).format('YYYY-MM-DD')).unix()
  const currentEnd = dayjs(dayjs(currentDate[1]).format('YYYY-MM-DD')).unix()
    
  const startUnix = dayjs(dayjs(travelStore.teamTime[0]).format('YYYY-MM-DD')).unix();
  const endUnix = dayjs(dayjs(travelStore.teamTime[1]).format('YYYY-MM-DD')).unix();

  
  if (travelStore.teamTime[0] && type === 'start') {
    let hour = dayjs(travelStore.teamTime[0]).hour();
    if (currentStart === startUnix) {
      return range(0, 24).splice(0, hour)

    } else {
      return []
    }
    
  } else if (travelStore.teamTime[0] && type === 'end') {
    let hour = dayjs(travelStore.teamTime[1]).hour();
    if (currentEnd === endUnix) {
      return range(0, 24).splice(hour + 1, 24 - hour)

    } else {
      return []
    }
    
  } else {
    return []
  }
    
};

export const disabledRangeMinutes = (currentDate: any, type: string) => {
  
  const currentStart = dayjs(dayjs(currentDate[0]).format('YYYY-MM-DD')).unix()
  const currentEnd = dayjs(dayjs(currentDate[1]).format('YYYY-MM-DD')).unix()
    
  const startUnix = dayjs(dayjs(travelStore.teamTime[0]).format('YYYY-MM-DD')).unix();
  const endUnix = dayjs(dayjs(travelStore.teamTime[1]).format('YYYY-MM-DD')).unix();

  
  if (travelStore.teamTime[0] && type === 'start') {
    let min = dayjs(travelStore.teamTime[0]).minute();
    if (currentStart === startUnix) {
      return range(0, 60).splice(0, min)

    } else {
      return []
    }
    
  } else if (travelStore.teamTime[0] && type === 'end') {
    let min = dayjs(travelStore.teamTime[1]).minute();
    if (currentEnd === endUnix) {
      return range(0, 60).splice(min + 1, 60 - min)

    } else {
      return []
    }
    
  } else {
    return []
  }
    
}

export const disabledRangeSeconds = (currentDate: any, type: string) => {
  console.log(type)
  const currentStart = dayjs(dayjs(currentDate[0]).format('YYYY-MM-DD')).unix()
  const currentEnd = dayjs(dayjs(currentDate[1]).format('YYYY-MM-DD')).unix()
    
  const startUnix = dayjs(dayjs(travelStore.teamTime[0]).format('YYYY-MM-DD')).unix();
  const endUnix = dayjs(dayjs(travelStore.teamTime[1]).format('YYYY-MM-DD')).unix();

  
  if (travelStore.teamTime[0] && type === 'start') {
    let second = dayjs(travelStore.teamTime[0]).second();
    if (currentStart === startUnix) {
      return range(0, 60).splice(0, second)

    } else {
      return []
    }
    
  } else if (travelStore.teamTime[0] && type === 'end') {
    let second = dayjs(travelStore.teamTime[1]).second();
    if (currentEnd === endUnix) {
      return range(0, 60).splice(second + 1, 60 - second)

    } else {
      return []
    }
    
  } else {
    return []
  }
    
}

/**
 * 
 * @param data 当前需要做比较的值
 * @param cur 当前选择的值
 * @returns Array 当前禁用时间
 */
export const disabledHours = (data: any, cur: any, type?: string) => {
  console.log(data, cur)
  let hour: any = ''
  const current = dayjs(dayjs(cur).format('YYYY-MM-DD')).unix()
  const startUnix = dayjs(dayjs(data).format('YYYY-MM-DD')).unix();
  
  if (data && cur && (current === startUnix)) {
    hour = dayjs(data).hour();
    return type === 'start' ? range(0, 24).splice(0, hour) : range(0, 24).splice(hour + 1, 24 - hour)
  } else {
    return []
  }
}



export const disabledMinutes = (data: any, cur: any, type?: string) => {
  let min: any = ''
  const current = dayjs(dayjs(cur).format('YYYY-MM-DD')).unix()
  const startUnix = dayjs(dayjs(data).format('YYYY-MM-DD')).unix();
  
  if (data && cur && (current === startUnix)) {
    min = dayjs(data).minute();
    return type === 'start' ? range(0, 60).splice(0, min) : range(0, 60).splice(min + 1, 60 - min)
  } else {
    return []
  }
}

export const disabledSeconds = (data: any, cur: any, type?: string) => {
  let second: any = ''
  const current = dayjs(dayjs(cur).format('YYYY-MM-DD')).unix()
  const startUnix = dayjs(dayjs(data).format('YYYY-MM-DD')).unix();
  
  if (data && cur && (current === startUnix)) {
    second = dayjs(data).second();
    return type === 'start' ? range(0, 60).splice(0, second) : range(0, 60).splice(second + 1, 60 - second)
  } else {
    return []
  }
}


export const disabledDateTime = (data: any, type: string) => {
  let start: any = {}
  
  return (_: Dayjs) => {
    const current = dayjs(dayjs(_).format('YYYY-MM-DD')).unix()
    const startUnix = dayjs(dayjs(data).format('YYYY-MM-DD')).unix();
    if (data && (current === startUnix)) {
      start.hour = dayjs(data).hour();
      start.min = dayjs(data).minute();
      start.second = dayjs(data).second();
      if (type === 'start') {
        return {
          disabledHours: () => range(0, 24).splice(0, start.hour),
          disabledMinutes: () => range(0, 60).splice(0, start.min),
          disabledSeconds: () => range(0, 60).splice(0, start.second)
        };
      } else {
        return {
          disabledHours: () => range(0, 24).splice(start.hour + 1, 24 - start.hour),
          disabledMinutes: () => range(0, 60).splice(start.min + 1, 60 - start.min),
          disabledSeconds: () => range(0, 60).splice(start.second + 1, 60 - start.second),
        };
      }
    }
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  }
};

// tab页是否有权限
export const getTabPermission = (tabName: any) => {
  const tabArr = JSON.parse(<string>localStorage.getItem('tabArr') || '[]');
  // let currentUrl = router.currentRoute.value.fullPath;
  let currentUrl = window.location.href.split('/#')[1];
  return tabArr?.some((item: any) => item.menuName === tabName && currentUrl.indexOf(item.pUrl) !== -1 );
}

// 日期时长计算
export const getDiffDay = (startDate: any, endDate: any) => {
  let aDate: any = new Date(startDate);
  let bDate: any = new Date(endDate); // 包含时间的日期字符串
  let aDay = 24 * 60 * 60 * 1000;
  let diffDay = (bDate - aDate) / aDay;
  // 向上取整
  return Math.ceil(diffDay);
}