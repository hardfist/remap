import SourceMap from '@parcel/source-map';
function ensureSourceMap(map: string) {
  return typeof map === 'string' ? JSON.parse(map) : map;
}
export default async function remapping(sourceMapList: string[] | any[]) {
  if (sourceMapList.length === 0) {
    throw new Error('No source map found');
  } else if (sourceMapList.length === 1) {
    return sourceMapList[0];
  }
  const first = sourceMapList[0];
  const mergedMap = new SourceMap();
  mergedMap.addVLQMap(ensureSourceMap(first));
  for (let i = 1; i < sourceMapList.length; i++) {
    const map = new SourceMap();
    map.addVLQMap(ensureSourceMap(sourceMapList[i]));
    mergedMap.extends(map.toBuffer());
  }
  const result = await mergedMap.stringify();
  
  return result;
}
