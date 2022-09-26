import router from "@/router/index";
export const to2 = () => {
  window.localStorage.setItem("authorization", "");
  window.localStorage.setItem("userInfo", "");
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
  return JSON.parse(<string>localStorage.getItem('userInfo'));
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
