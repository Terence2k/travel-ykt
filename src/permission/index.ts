const treeForeach = (tree: any, value: any) => {
  return tree.some((item: any) => {
    if (item.buttonName && item.buttonName.split('、').indexOf(value) != -1) {
      return window.location.href.split('/#')[1] == item.url;
    }
    if (item.childMenuList?.length) return treeForeach(item.childMenuList, value);
  })
}

const directives = [
  {
    name: 'permission',
    value: {
      mounted(el: HTMLElement, binding: any) {
        const userInfo = JSON.parse(<string>localStorage.getItem('userInfo') || '{}');
        console.log(window.location.href.split('/#'));
        const type = binding.value || ''
        let status = false;
        console.log('type:', type);
        console.log('binding:', binding);
        
        status = treeForeach(userInfo.sysMenuVos, type);
        console.log('status:', status);
        
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
