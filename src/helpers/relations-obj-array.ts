export function convertRelationsObjToArray(
  relations: { [key: string]: any },
  parentStr?: string,
) {
  function makeParentStr(key: string) {
    return `${parentStr ? `${parentStr}.` : ''}${key}`;
  }
  const keys = Object.keys(relations);
  let arr = keys.map((key) => makeParentStr(key));
  for (const key of keys) {
    if (relations[key] !== true && typeof relations[key] === 'object') {
      arr = [
        ...arr,
        ...convertRelationsObjToArray(relations[key], makeParentStr(key)),
      ];
    }
  }
  return arr;
}
