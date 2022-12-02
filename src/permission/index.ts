
let targetMenu: any;

const treeForeach = (tree: any, value: any, tabValue?: any) => {
  const userInfo = JSON.parse(<string>localStorage.getItem('userInfo') || '{}');
  return tree.some((item: any) => {
    if (item.menuName === value) {
      findFatherMenu(userInfo.sysMenuVos, item.parentId);
      if (targetMenu && !tabValue) return window.location.href.split('/#')[1] === targetMenu.url;
      if (targetMenu && tabValue) return window.location.href.split('/#')[1] === targetMenu.url
      && 
      targetMenu.childMenuList.some((item: any) => item.menuName === tabValue);
    }
    if (item.childMenuList?.length) return treeForeach(item.childMenuList, value, tabValue);
    return false;
  })
}

const findFatherMenu = (menuList: any, pid: any) => {
  const userInfo = JSON.parse(<string>localStorage.getItem('userInfo') || '{}');
  const res = menuList.find((item: any) => {
    if (item.childMenuList?.length && item.oid != pid) findFatherMenu(item.childMenuList, pid);
    return item.oid === pid;
  });
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
