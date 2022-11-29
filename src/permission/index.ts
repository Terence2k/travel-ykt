const getMenuUrl = (menuList: any, value: any) => {
    if (menuList.url == '/baseInfo') {
        console.log('getMenuUrl', menuList.url);
        console.log('getMenuUrlvalue', '/baseInfo');
        return menuList.url;
    } else if (menuList.childMenuList?.length) {
        menuList.childMenuList.forEach((menuList: any) => {
            getMenuUrl(menuList, window.location.href.split('/#')[1]);
        })
    }
}

const directives = [
  {
    name: 'permission',
    value: {
      mounted(el: HTMLElement, binding: any) {
        const userInfo = JSON.parse(<string>localStorage.getItem('userInfo') || '{}');
        // console.log('el:', el);
        // console.log('el:', el.innerText.replace(/\s+/g, ''));
        // console.log(window.location.href);
        // console.log(window.location.href.split('/#'));
        const type = binding.value || ''
        let status = false;
        console.log('type:', type);
        console.log('binding:', binding);
        
        // 获取当前角色codeList
        // userInfo.sysMenuVos?.forEach((item: any) => {
        // //   if (type == item.menuTypeName) {
        // //     status = true
        // //   }
          
        // //   getMenuUrl(item, window.location.href.split('/#')[1]);
        // })

        for (let index = 0; index < userInfo.sysMenuVos.length; index++) {
            let result = getMenuUrl(userInfo.sysMenuVos[index], window.location.href.split('/#')[1]);
            if (result) {
              status = true
              return
            }
        }
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
