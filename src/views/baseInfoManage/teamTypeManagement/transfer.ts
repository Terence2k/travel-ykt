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

function formattingData(arr: any) {
  // 先定义一个空对象和空数组；
  let map: any = {};
  let res: any = [];
  // 循环需要筛选的数组
  for (let i = 0, l = arr.length; i < l; i++) {
    let ai = arr[i];
    // 将需要筛选的属性的值作为新对象的键，并且判断是否已经存在
    if (!map[ai['itemId']]) {
      // 不存在的话就在map对象中创建一个属性的值作为键名，键值为空数组的新对象，并且把arr[i]放入
      map[ai['itemId']] = { itemId: ai.itemId, itemName: ai.itemName, products: ai.products ? ai.products : undefined };
    } else {
      // 如果已经存在就直接把arr[i]放入
      map[ai['itemId']]['products'].push(...ai.products);
    }
  }
  // 循环后对map进行处理生成分组的数组
  Object.keys(map).forEach((key) => {
    res.push(map[key]);
  });
  return res;
}

const format = (arr: any, tArr: TransferProps['dataSource']) => {
  let ret: any = []
  for (let i = 0, l = arr.length; i < l; i++) {
    const element = arr[i];
    for (let j = 0, l = tArr?.length!; j < l; j++) {
      const telement = tArr[j];
      if (element === telement.key) {
        ret.push({
          itemId: telement.key, //项目id
          itemName: telement.title //项目name
        })
      } else {
        if (telement.children) {
          for (let k = 0, l = telement.children.length; k < l; k++) {
            const celement = telement.children[k];
            if (element === celement.key) {
              ret.push({
                itemId: telement.key, //项目id
                itemName: telement.title, //项目name
                products: [{
                  productId: celement.key,
                  productName: celement.title
                }]
              })
            }
          }
        }
      }
    }
  }
  if (ret.length > 0) {
    return formattingData(ret)
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