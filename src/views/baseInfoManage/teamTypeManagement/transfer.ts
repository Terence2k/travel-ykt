import type { TransferProps, TreeProps } from 'ant-design-vue';
function flatten(data: TransferProps['dataSource'] = []) {
  const transferDataSource: TransferProps['dataSource'] = [];
  /* 扁平化 */
  function flat(list: TransferProps['dataSource'] = []) {
    list.forEach(item => {
      transferDataSource.push(item);
      flat(item.children);
    });
  }
  flat(JSON.parse(JSON.stringify(data)));
  return transferDataSource
}

function isChecked(selectedKeys: (string | number)[], eventKey: string | number) {
  return selectedKeys.indexOf(eventKey) !== -1;
}

const onChecked = (
  e: Parameters<TreeProps['onCheck']>[1] | Parameters<TreeProps['onSelect']>[1],
  checkedKeys: string[],
  onItemSelect: (n: any, c: boolean) => void,
) => {
  if (e.node.children) {
    e.node.children.forEach((item: any) => {
      onItemSelect(item.key, !isChecked(checkedKeys, item.key));
    })
  } else {
    const { eventKey } = e.node;
    onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
  }
};

function formattingData(arr: any, keys: { parentKey: any, childrenKey: any }) {
  // 先定义一个空对象和空数组；
  let map: any = {};
  let res: any = [];
  // 循环需要筛选的数组
  for (let i = 0; i < arr.length; i++) {
    let ai = arr[i];
    // 将需要筛选的属性的值作为新对象的键，并且判断是否已经存在
    if (!map[ai[keys.parentKey]]) {
      // 不存在的话就在map对象中创建一个属性的值作为键名，键值为空数组的新对象，并且把arr[i]放入
      map[ai[keys.parentKey]] = [ai.productId];
    } else {
      // 如果已经存在就直接把arr[i]放入
      map[ai[keys.parentKey]].push(ai.productId);
    }
  }
  // 循环后对map进行处理生成分组的数组
  Object.keys(map).forEach((key) => {
    res.push({
      [keys.parentKey]: Number(key),
      [keys.childrenKey]: map[key],
    });
  });
  return res;
}

const format = (arr: any, tArr: TransferProps['dataSource'], keys: { parentKey: any, childrenKey: any }) => {
  let ret: any = []
  for (let i = arr.length - 1; i >= 0; i--) {
    const element = arr[i];
    for (let j = tArr.length - 1; j >= 0; j--) {
      const telement = tArr[j];
      if (telement?.children) {
        for (let k = telement.children.length - 1; k >= 0; k--) {
          const celement = telement.children[k];
          if (element === celement?.key) {
            ret.push({
              [keys.parentKey]: telement.key, //项目id
              [keys.childrenKey]: element //产品id
            })
            /* ret.push({
              itemId: telement.key, //项目id
              productId: element //产品id
            }) */
          }
        }
      }
    }
  }
  if (ret.length > 0) {
    return formattingData(ret, keys)
  }
}
/* function handleTreeData(data: TransferProps['dataSource'], targetKeys: string[] = []) {
  data.forEach((item, index) => {
    item['disabled'] = targetKeys.includes(item.key as any);
    if (item.children) {
      handleTreeData(item.children, targetKeys);
    }
  });
  return data as TreeProps['treeData'];
}
const treeData = computed(() => {
  return handleTreeData(tData, targetKeys.value);
}); */
export { flatten, onChecked, format }