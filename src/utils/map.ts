export function mapOmit<T extends Map<any, any>>(map: T, keys: any | any[], ...restKeys: any[]): T {
  const omitKeys = Array.isArray(keys) ? keys : [keys, ...restKeys];
  const copy = new Map(map);
  omitKeys.forEach(key => copy.delete(key));
  return copy as T;
}

export function mapGet<T extends Map<any, any>>(map: T, key: any): T extends Map<any, infer U> ? U : never {
  return map.get(key);
}
