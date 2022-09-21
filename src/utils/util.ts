import router from "@/router/index";
export const to2 = async () => {
  window.localStorage.setItem("authorization", "");
  await router.push("/login");
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