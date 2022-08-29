/**
 * @description: 找到target上的属性，如果当前元素上找不到，则向上找父节点的属性
 * @return {any} 返回data-*属性值
 */
export const findAttrOnTarget = (target: any, attrName: string) => {
  let limit = 3
  while (limit > 0 && target?.dataset?.[attrName] === void 0) {
    target = target?.parentElement
    limit--
  }
  return target?.dataset?.[attrName]
}
