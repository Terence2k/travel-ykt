console.log('登录');

let targetMenu: any;
// btnValue: 按钮名字,tabValue: tab页名
const treeForeach = (tree: any, btnValue: any, tabValue?: any) => {
  // 获取用户有权限菜单
  const userInfo = JSON.parse(<string>localStorage.getItem('userInfo') || '{}');
  return tree.some((item: any) => {
    // 如果菜单名字与按钮名字匹配
    if (item.menuName === btnValue) {
      // 通过parentId找出所属父级菜单
      findFatherMenu(userInfo.sysMenuVos, item.parentId);
      // 通过当前路由地址匹配父级菜单是否一致
      if (targetMenu && !tabValue) return window.location.href.split('/#')[1].indexOf(targetMenu.url) !== -1;
      if (targetMenu && tabValue) return window.location.href.split('/#')[1].indexOf(targetMenu.url) !== -1
      && 
      targetMenu.childMenuList.some((item: any) => item.menuName === tabValue);
    }
    // 如有子菜单
    if (item.childMenuList?.length) return treeForeach(item.childMenuList, btnValue, tabValue);
    return false;
  })
}

const findFatherMenu = (menuList: any, pid: any) => {
  // 获取用户有权限菜单
  const userInfo = JSON.parse(<string>localStorage.getItem('userInfo') || '{}');
  // 通过parentId找出所属父级菜单
  const res = menuList.find((item: any) => {
    if (item.childMenuList?.length && item.oid != pid) findFatherMenu(item.childMenuList, pid);
    return item.oid === pid;
  });
  // 如果菜单类型是tab页,再找其所属父级菜单以找到url
  if (res?.menuType === 2) {
    findFatherMenu(userInfo.sysMenuVos, res.parentId);
  } else if (res) {
    targetMenu = res;
  }
}

const directives = [
  {
    name: 'permission',
    value: {
      mounted(el: HTMLElement, binding: any) {
        // 获取用户有权限菜单
        const userInfo = JSON.parse(<string>localStorage.getItem('userInfo') || '{}');
        const type = binding.value || '';
        let status = false;
        if (type.split('_').length)
        status = treeForeach(userInfo.sysMenuVos, type.split('_')[type.split('_').length - 1], type.split('_')[type.split('_').length - 2]);
        // 没有匹配则隐藏按钮
        if (!status) {
          el.style.display = 'none'
        }
      }
    }
  }
]
 
export const useDirectives = (app: any) => {
  directives.forEach((directive) => app.directive(directive.name, directive.value))
}
