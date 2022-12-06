// btnValue: 按钮名字,tabValue: tab页名
const treeForeach = (btnValue: any, tabValue?: any) => {
  const tabArr = JSON.parse(<string>localStorage.getItem('tabArr') || '{}');
  const btnArr = JSON.parse(<string>localStorage.getItem('btnArr') || '{}');
  if (tabValue) {
    let res = tabArr.find((item: any) => item.menuName === tabValue && window.location.href.split('/#')[1].indexOf(item.pUrl) !== -1 );
    return res.childMenuList.some((item: any) => item.menuName === btnValue && item.menuType === 3);
  } else {
    return btnArr.some((item: any) => item.menuName === btnValue && window.location.href.split('/#')[1].indexOf(item.pUrl) !== -1)
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
        status = treeForeach(type.split('_')[type.split('_').length - 1], type.split('_')[type.split('_').length - 2]);
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
